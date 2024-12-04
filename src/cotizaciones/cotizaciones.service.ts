import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import clienteAxios from 'axios';
import { CotizacionDto } from './dto/cotizacion.dto';
import { Cotizacion } from './entitis/cotizacion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { Empresa } from 'src/empresa/entities/empresa.entity';
import DateUtils from 'src/utils/DateUtils';
// empresas
@Injectable()
export class CotizacionService {
  private apiUrl = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/';
  private brazilTimezone = 'America/Sao_Paulo';

  constructor(
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) { }
  

  
  async obtenerPromedioTotalPorEmpresa(): Promise<{ codempresa: string; empresaNombre: string; promedioTotal: number }[]> {
    try {
      const promediosPorDia = await this.obtenerPromedioCotizacionesPorDiaDeTodasLasEmpresas();
      
      // Crear un objeto para almacenar la suma de promedios y conteo de días por empresa
      const promediosTotales: { [codempresa: string]: { suma: number; conteo: number; empresaNombre: string } } = {};
  
      for (const promedio of promediosPorDia) {
        const { codempresa, empresaNombre, promedio: valorPromedio } = promedio;
  
        // Si la empresa no está en el objeto, inicialízala
        if (!promediosTotales[codempresa]) {
          promediosTotales[codempresa] = { suma: 0, conteo: 0, empresaNombre };
        }
  
        // Sumar el promedio y aumentar el conteo
        promediosTotales[codempresa].suma += valorPromedio;
        promediosTotales[codempresa].conteo += 1;
      }
  
      // Calcular el promedio total por empresa
      const resultados = Object.keys(promediosTotales).map(codempresa => {
        const { suma, conteo, empresaNombre } = promediosTotales[codempresa];
        const promedioTotal = suma / conteo; // Calcular el promedio total
        return { codempresa, empresaNombre, promedioTotal: parseFloat(promedioTotal.toFixed(2)) }; // Redondear a 2 decimales
      });
  
      return resultados;
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener el promedio total por empresa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async obtenerPromedioCotizacionesUltimoMesAgrupadosPorEmpresa(): Promise<{ codempresa: string; empresaNombre: string; promedios: { fecha: string; promedio: number }[] }[]> {
    try {
      // Obtener todos los promedios de cotizaciones por día de todas las empresas
      const promediosPorDia = await this.obtenerPromedioCotizacionesPorDiaDeTodasLasEmpresas();
  
      // Obtener la fecha actual y la fecha de hace un mes
      const fechaActual = moment();
      const fechaHaceUnMes = moment().subtract(1, 'months');
  
      // Crear un objeto para almacenar los promedios agrupados por empresa
      const promediosAgrupados: { [codempresa: string]: { empresaNombre: string; promedios: { fecha: string; promedio: number }[] } } = {};
  
      // Filtrar y agrupar los resultados
      promediosPorDia.forEach(promedio => {
        const fechaCotizacion = moment(promedio.fecha);
        // Filtrar solo los del último mes
        if (fechaCotizacion.isBetween(fechaHaceUnMes, fechaActual, null, '[]')) {
          const { codempresa, empresaNombre } = promedio;
  
          // Si la empresa no está en el objeto, inicializarla
          if (!promediosAgrupados[codempresa]) {
            promediosAgrupados[codempresa] = { empresaNombre, promedios: [] };
          }
  
          // Agregar el promedio a la lista de promedios de la empresa
          promediosAgrupados[codempresa].promedios.push({
            fecha: promedio.fecha,
            promedio: promedio.promedio,
          });
        }
      });
  
      // Convertir el objeto en un array
      return Object.keys(promediosAgrupados).map(codempresa => ({
        codempresa,
        empresaNombre: promediosAgrupados[codempresa].empresaNombre,
        promedios: promediosAgrupados[codempresa].promedios,
      }));
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener los promedios de cotizaciones del último mes agrupados por empresa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async obtenerPromedioCotizacionesPorDiaDeTodasLasEmpresas(): Promise<{ codempresa: string; empresaNombre: string; fecha: string; promedio: number }[]> {
    try {
      const empresas = await this.empresaRepository.find(); // Obtener todas las empresas
      const resultados = [];
  
      for (const empresa of empresas) {
        const promedios = await this.obtenerPromedioCotizacionesPorDia(empresa.codempresa); // Llamar al método existente para cada empresa
        resultados.push(...promedios.map(promedio => ({
          codempresa: empresa.codempresa,
          nombre: empresa.empresaNombre, // Asegúrate de que 'nombre' es la propiedad correcta
          ...promedio
        })));
      }
  
      return resultados;
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener los promedios de cotizaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async obtenerUltimosTresDiasCotizaciones(codempresa: string): Promise<Cotizacion[]> {
    try {
      // Calcular la fecha de hace 3 días
      const fechaDesde = moment().subtract(3, 'days').startOf('day').toDate();
      const fechaHasta = new Date(); // Fecha actual

      // Realizar la consulta para obtener las cotizaciones en el rango de fechas para la empresa específica
      const cotizaciones = await this.cotizacionRepository.find({
        where: {
          fecha: Between(fechaDesde, fechaHasta), // Usar Between para el rango
          empresa: { codempresa: codempresa }, // Filtrar por el código de la empresa
        },
        order: {
          fecha: 'ASC',
        },
      }); 

      return cotizaciones;
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener las cotizaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async obtenerPromedioCotizacionesPorDia(codigoEmpresa: string): Promise<{ fecha: string; promedio: number }[]> {
    try {
      // Obtener todas las cotizaciones de la empresa
      const cotizaciones = await this.cotizacionRepository.find({
        where: {
          empresa: { codempresa: codigoEmpresa },
        },
      });

      // Verificar si hay cotizaciones
      if (cotizaciones.length === 0) {
        throw new HttpException('No se encontraron cotizaciones para la empresa especificada', HttpStatus.NOT_FOUND);
      }

      // Agrupar cotizaciones por fecha
      const cotizacionesPorFecha = cotizaciones.reduce((acc, cotizacion) => {
        const fecha = new Date(cotizacion.fecha).toISOString().substring(0, 10); // Formato yyyy-mm-dd
        if (!acc[fecha]) {
          acc[fecha] = [];
        }
        acc[fecha].push(cotizacion.cotization); // Asegúrate de que cotization sea un número
        return acc;
      }, {});

      // Calcular el promedio por día
      const promediosPorDia = Object.keys(cotizacionesPorFecha).map(fecha => {
        const cotizacionesDelDia = cotizacionesPorFecha[fecha];
        
        if (cotizacionesDelDia.length === 0) {
          return { fecha, promedio: 0 }; // O manejarlo de otra manera
        }

        const suma = cotizacionesDelDia.reduce((total, valor) => total + (parseFloat(valor) || 0), 0);
        const promedio = suma / cotizacionesDelDia.length;
        return { fecha, promedio: parseFloat(promedio.toFixed(2)) }; // Redondear a dos decimales
      });

      return promediosPorDia;
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener los promedios de cotizaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async obtenerTodasLasCotizaciones(): Promise<CotizacionDto[]> {
    try {
      const empresas = await this.empresaRepository.find();
      const { fecha, hora } = DateUtils.getFechaHoraActual(); 
      const promises = empresas.map(empresa =>
        this.obtenerCotizacionEmpresa(empresa.codempresa, fecha, hora)
      );

      
      const cotizaciones = await Promise.all(promises);
      return cotizaciones;
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener las cotizaciones de todas las empresas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async obtenerCotizacionesPorEmpresa(codigoEmpresa: string): Promise<CotizacionDto[]> {
    try {
      const cotizaciones = await this.cotizacionRepository.find({
        where: {
          empresa: {
            codempresa: codigoEmpresa,
          },
        },
      });
  
      return cotizaciones.map((cotizacion) => ({
        id: cotizacion.id.toString(),
        fecha: new Date(cotizacion.fecha).toISOString().substring(0, 10), 
        hora: cotizacion.hora,
        dateUTC: new Date(cotizacion.fecha).toISOString(), 
        cotization: cotizacion.cotization.toString(),
      }));
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener las cotizaciones de la empresa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async obtenerCotizacionEmpresa(codigoEmpresa: string, fecha: string, hora: string): Promise<CotizacionDto> {
    try {
      
      const cotizacionExistente = await this.cotizacionRepository.findOne({
        where: {
          empresa: { codempresa: codigoEmpresa },
          fecha: moment(fecha).toDate(), 
          hora: hora,
        },
      });
  
      if (cotizacionExistente) {
        throw new HttpException('La empresa ya existe en tu base de datos', HttpStatus.CONFLICT);
      }
  
      const response = await clienteAxios.get(`${this.apiUrl}cotizaciones/${codigoEmpresa}/cotizacion`, {
        params: { fecha, hora },
      });
  
      const cotizacionIndividual = response.data;
  
      const fechaLocal = moment(cotizacionIndividual.fecha).tz(this.brazilTimezone).format('YYYY-MM-DD');
      const horaLocal = moment(cotizacionIndividual.hora, 'HH:mm').tz(this.brazilTimezone).format('HH:mm');
  
      const empresa = await this.empresaRepository.findOne({ where: { codempresa: codigoEmpresa } });
  
      if (!empresa) {
        throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
      }
  
      const guardado = this.cotizacionRepository.create({
        fecha: new Date(fechaLocal),
        hora: horaLocal,
        cotization: parseFloat(parseFloat(cotizacionIndividual.cotization).toFixed(2)),
        empresa: empresa,
      });
  
      await this.cotizacionRepository.save(guardado);
  
      return response.data;
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener la cotización', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async obtenerCotizacionesRango(codempresa: string, fechaDesde: string, fechaHasta: string) {
    try {
      const response = await clienteAxios.get(
        `${this.apiUrl}cotizaciones/${codempresa}/cotizaciones?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`,

      );

      return response.data;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error al obtener las cotizaciones',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


 
  async obtenerCotizacionesDesdeInicioDelAno(): Promise<void> {
    try {
      const fechaInicio = moment().startOf('year').format('YYYY-MM-DD') + 'T00:00';
      const fechaActual = moment().endOf('day').format('YYYY-MM-DD') + 'T23:59';
  
      const empresas = await this.empresaRepository.find();
      const cotizacionesParaGuardar = []; // Array para almacenar las cotizaciones a guardar
  
      // Crear un array de promesas para obtener cotizaciones de todas las empresas
      const promises = empresas.map(async (empresa) => {
        const ultimaCotizacion = await this.cotizacionRepository.findOne({
          where: { empresa: { id: empresa.id } },
          order: { fecha: 'DESC' },
        });
  
        const fechaUltimaGuardada = ultimaCotizacion ? ultimaCotizacion.fecha : fechaInicio;
  
        for (let fecha = moment(fechaUltimaGuardada).add(1, 'days'); fecha.isBefore(fechaActual); fecha.add(1, 'days')) {
          const fechaStr = fecha.format('YYYY-MM-DD');
  
          // Iterar solo desde las 9:00 hasta las 15:00 (inclusive)
          for (let hora = 9; hora <= 15; hora++) {
            const horaStr = hora.toString().padStart(2, '0') + ':00';
  
            try {
              // Verificar si ya existe la cotización
              const cotizacionExistente = await this.cotizacionRepository.findOne({
                where: {
                  empresa: { id: empresa.id },
                  fecha: moment(`${fechaStr}T${horaStr}`).tz('America/Sao_Paulo').toDate(),
                  hora: horaStr,
                },
              });
  
              if (cotizacionExistente) {
                console.log(`Cotización ya existe para la empresa ${empresa.codempresa} en la fecha ${fechaStr} a las ${horaStr}`);
                continue; // Salta a la siguiente iteración si ya existe
              }
  
              const cotizacion = await clienteAxios.get(`${this.apiUrl}empresas/${empresa.codempresa}/cotizaciones`, {
                params: { fechaDesde: `${fechaStr}T${horaStr}`, fechaHasta: `${fechaStr}T${horaStr}` },
              });
  
              // Acceder al primer elemento del array
              const cotizacionData = cotizacion.data[0]; // Asegúrate de que hay al menos un elemento
              if (!cotizacionData) {
                console.error(`No se encontraron datos de cotización para la empresa ${empresa.codempresa} en la fecha ${fechaStr} a las ${horaStr}`);
                continue; // Salta a la siguiente iteración si no hay datos
              }
  
              cotizacionesParaGuardar.push(this.cotizacionRepository.create({
                fecha: moment(cotizacionData.fecha).tz('America/Sao_Paulo').toDate(),
                hora: horaStr,
                cotization: parseFloat(cotizacionData.cotization),
                empresa: empresa,
              }));
  
            } catch (error) {
              console.error(`Error al obtener cotización para la empresa ${empresa.codempresa} en la fecha ${fechaStr} a las ${horaStr}:`, error);
            }
          }
        }
      });
  
      // Esperar a que todas las promesas se resuelvan
      await Promise.all(promises);
  
      // Guardar las cotizaciones en lotes
      const batchSize = 1000; // Tamaño del lote
      for (let i = 0; i < cotizacionesParaGuardar.length; i += batchSize) {
        const batch = cotizacionesParaGuardar.slice(i, i + batchSize);
        await this.cotizacionRepository.save(batch);
        console.log(`Guardadas ${batch.length} cotizaciones en la base de datos.`);
      }
  
      console.log('Todas las cotizaciones han sido obtenidas y guardadas exitosamente.');
    } catch (error) {
      console.error('Error al obtener cotizaciones desde el inicio del año:', error);
      throw new HttpException('Error al obtener las cotizaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}


/*Tengo que hacer una funcion que me busque las cotizaciones desde el 1 de enero hasta la fecha actual,
  me traigo todas a mi db, busco mi ultima fecha guardada, y de ahi
  para que traiga las cotizaciones ausentes, para todas las empresas y eso lo guardo en mi db
  
  Tengo que hacer una funcion que me busque las cotizaciones desde el 1 de enero hasta la fecha actual,
  verifique si ya existen en mi base de datos para no repetirlas ,
  luego debo buscar mi ultima fecha guardada, y a partir de esa fecha, traer las cotizaciones que no tenga hasta la fecha actual,
  y si pasa esa verificacion me las guarde en mi db
  esto debe aplicarse para todas las empresas y eso lo guardo en mi db
  */