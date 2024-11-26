import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import clienteAxios from 'axios';
import { CotizacionDto } from './dto/cotizacion.dto';
import { Cotizacion } from './entitis/cotizacion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import { Empresa } from 'src/empresa/entities/empresa.entity';
import DateUtils from 'src/utils/DateUtils';

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


  async obtenerTodasLasCotizaciones(): Promise<CotizacionDto[]> {
    try {
      const empresas = await this.empresaRepository.find();
      const { fecha, hora } = DateUtils.getFechaHoraActual(); // Obtén fecha y hora aquí
      const promises = empresas.map(empresa =>
        this.obtenerCotizacionEmpresa(empresa.codempresa, fecha, hora)
      );

      // Espera a que todas las promesas se resuelvan
      const cotizaciones = await Promise.all(promises);
      return cotizaciones;
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener las cotizaciones de todas las empresas', HttpStatus.INTERNAL_SERVER_ERROR);
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
  
      const response = await clienteAxios.get(`${this.apiUrl}empresas/${codigoEmpresa}/cotizacion`, {
        params: { fecha, hora },
      });
  
      const cotizacionIndividual = response.data;
  
      const fechaLocal = moment(cotizacionIndividual.fecha).tz(this.brazilTimezone).format('YYYY-MM-DD');
      const horaLocal = moment(cotizacionIndividual.hora, 'HH:mm').tz(this.brazilTimezone).format('HH:mm');
  
      const empresa = await this.empresaRepository.findOne({ where: { codempresa: codigoEmpresa } });
  
      if (!empresa) {
        throw new HttpException('Empresa no encontrada', HttpStatus.NOT_FOUND);
      }
  
      // Crea el objeto de cotización
      const guardado = this.cotizacionRepository.create({
        fecha: new Date(fechaLocal),
        hora: horaLocal,
        cotization: parseFloat(parseFloat(cotizacionIndividual.cotization).toFixed(2)),
        empresa: empresa,
      });
  
      // Guarda la cotización en la base de datos
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
        `${this.apiUrl}empresas/${codempresa}/cotizaciones?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`,

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
      const fechaInicio = moment().startOf('year').toDate(); // 1 de enero del año actual
      const fechaActual = new Date(); // Fecha actual
  
      // Obtener todas las empresas
      const empresas = await this.empresaRepository.find();
      
      for (const empresa of empresas) {
        // Buscar la última fecha guardada para la empresa
        const ultimaCotizacion = await this.cotizacionRepository.findOne({
          where: { empresa: { id: empresa.id } },
          order: { fecha: 'DESC' },
        });
        
        const fechaUltimaGuardada = ultimaCotizacion ? ultimaCotizacion.fecha : fechaInicio;
        
        // Obtener cotizaciones desde la API desde la última fecha guardada hasta la fecha actual
        for (let fecha = moment(fechaUltimaGuardada).add(1, 'days'); fecha.isBefore(fechaActual); fecha.add(1, 'days')) {
          const fechaStr = fecha.format('YYYY-MM-DD');
  
          // Obtener cotización para cada hora que necesites (ej. cada hora de 9 a 15)
          for (let hora = 9; hora <= 15; hora++) {
            const horaStr = hora.toString().padStart(2, '0') + ':00';
  
            // Llamar a la API para obtener la cotización
            try {
              const cotizacion = await clienteAxios.get(`${this.apiUrl}empresas/${empresa.codempresa}/cotizacion`, {
                params: { fecha: fechaStr, hora: horaStr },
              });
              
              // Verificar si la cotización ya existe en la base de datos
              const cotizacionExistente = await this.cotizacionRepository.findOne({
                where: {
                  empresa: { id: empresa.id },
                  fecha: moment(fechaStr).tz(this.brazilTimezone).toDate(),
                  hora: horaStr,
                },
              });
              
              // Solo insertar si no existe
              if (!cotizacionExistente) {
                const guardado = this.cotizacionRepository.create({
                  fecha: moment(cotizacion.data.fecha).tz(this.brazilTimezone).toDate(),
                  hora: cotizacion.data.hora,
                  cotization: parseFloat(cotizacion.data.cotization),
                  empresa: empresa,
                });
   
                // Guarda la cotización en la base de datos
                await this.cotizacionRepository.save(guardado);
                console.log(`Cotización guardada para la empresa ${empresa.codempresa} en la fecha ${fechaStr} a las ${horaStr}`);
              } else {
                console.log(`Cotización ya existe para la empresa ${empresa.codempresa} en la fecha ${fechaStr} a las ${horaStr}`);
              }
            } catch (error) {
              console.error(`Error al obtener cotización para la empresa ${empresa.codempresa} en la fecha ${fechaStr} a las ${horaStr}:`, error);
            }
          }
        }
      }
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


/*
 
2 empresas mas a eleccion
preguntar si para esa empresa existe una cotizaxion entre esta fecha y hora*/ 


/*
 async obtenerCotizacionesDesdeInicioDelAno(): Promise<void> {
    try {
      const fechaInicio = moment().startOf('year').toDate(); // 1 de enero del año actual
      const fechaActual = new Date(); // Fecha actual
  
      // Obtener todas las empresas
      const empresas = await this.empresaRepository.find();
  
      for (const empresa of empresas) {
        // Obtener las cotizaciones desde la API para cada día entre la fecha de inicio y la fecha actual
        for (let fecha = moment(fechaInicio); fecha.isBefore(fechaActual); fecha.add(1, 'days')) {
          const fechaStr = fecha.format('YYYY-MM-DD');
          const horaStr = '00:00'; // Puedes ajustar la hora según sea necesario
  
          // Llamar a la función para obtener la cotización de la API
          const cotizacion = await this.obtenerCotizacionEmpresa(empresa.codempresa, fechaStr, horaStr);
  
          // Verificar si la cotización ya existe en la base de datos
          const cotizacionExistente = await this.cotizacionRepository.findOne({
            where: {
              empresa: { id: empresa.id },
              fecha: new Date(cotizacion.fecha),
              hora: cotizacion.hora,
            },
          });
  
          // Si no existe, guardar la nueva cotización
          if (!cotizacionExistente) {
            const guardado = this.cotizacionRepository.create({
              fecha: new Date(cotizacion.fecha),
              hora: cotizacion.hora,
              cotization: parseFloat(cotizacion.cotization),
              empresa: empresa,
            });
  
            await this.cotizacionRepository.save(guardado);
            console.log(`Cotización guardada para la empresa ${empresa.codempresa} en la fecha ${fechaStr}`);
          } else {
            console.log(`Cotización ya existe para la empresa ${empresa.codempresa} en la fecha ${fechaStr}`);
          }
        }
      }
    } catch (error) {
      console.error('Error al obtener cotizaciones desde el inicio del año:', error);
      throw new HttpException('Error al obtener las cotizaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
 

*/ 




/*


async obtenerCotizacionesDesdeInicioDelAno(): Promise<void> {
    try {
        // Establece la fecha de inicio en la zona horaria de Brasil
        const fechaInicio = moment.tz('2024-01-01', 'America/Sao_Paulo').startOf('day').toDate();
        const fechaActual = moment.tz(new Date(), 'America/Sao_Paulo').toDate(); 

        const empresas = await this.empresaRepository.find();

        for (const empresa of empresas) {
            for (let fecha = moment(fechaInicio); fecha.isBefore(fechaActual); fecha.add(1, 'days')) {
                const fechaStr = fecha.format('YYYY-MM-DD');

                for (let hora = 9; hora <= 15; hora++) {
                    const horaStr = hora.toString().padStart(2, '0') + ':00';

                    // Verificar si la cotización ya existe
                    const cotizacionExistente = await this.cotizacionRepository.findOne({
                        where: {
                            empresa: { id: empresa.id },
                            fecha: moment(fechaStr).tz('America/Sao_Paulo').startOf('day').toDate(), // Asegúrate de que la fecha esté en la zona horaria de Brasil
                            hora: horaStr,
                        },
                    });

                    // Solo insertar si no existe
                    if (!cotizacionExistente) {
                        const cotizacion = await this.obtenerCotizacionEmpresa(empresa.codempresa, fechaStr, horaStr);
                        if (cotizacion) {
                            console.log(`Intentando guardar cotización: ${fechaStr}, ${horaStr}, ${cotizacion.cotization}, ${empresa.id}`);
                            const guardado = this.cotizacionRepository.create({
                                fecha: moment(cotizacion.fecha).tz('America/Sao_Paulo').toDate(), // Convertir a la zona horaria de Brasil
                                hora: cotizacion.hora, // Asegúrate de que cotizacion.hora esté en el formato HH:mm
                                cotization: parseFloat(cotizacion.cotization),
                                empresa: empresa,
                            });

                            // Guarda la cotización en la base de datos
                            await this.cotizacionRepository.save(guardado);
                            console.log(`Cotización guardada para la empresa ${empresa.codempresa} en la fecha ${fechaStr} a las ${horaStr}`);
                        } else {
                            console.log(`No se pudo obtener cotización para la empresa ${empresa.codempresa} en la fecha ${fechaStr} a las ${horaStr}`);
                        }
                    } else {
                        console.log(`Cotización ya existe para la empresa ${empresa.codempresa} en la fecha ${fechaStr} a las ${horaStr}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error al obtener cotizaciones desde el inicio del año:', error);
        throw new HttpException('Error al obtener las cotizaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

*/ 