import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cotizacion } from 'src/cotizaciones/entitis/cotizacion.entity';
import { CotizacionIndice } from './entities/indice-cotizacione.entity';
import axios from 'axios';
import { Indice } from 'src/indice/entities/indice.entity';
import * as moment from 'moment-timezone';
import { IndiceService } from 'src/indice/indice.service';


@Injectable()
export class CotizacionIndiceService {
  [x: string]: any;
  private readonly logger = new Logger(CotizacionIndiceService.name);
  private readonly apiUrl = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/cotizaciones';
  private readonly apiUrlIBOV = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/IBOV/cotizaciones';
  constructor(
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
    @InjectRepository(CotizacionIndice)
    private readonly cotizacionIndiceRepository: Repository<CotizacionIndice>,
    @InjectRepository(Indice)
    private readonly indiceRepository: Repository<Indice>,
    private readonly indiceService: IndiceService,
  ) { } 
// IBOV

  //funcion que obtiene las cotizaciones de los indices de la api
  async obtenerCotizacionesPorIndices(): Promise<any[]> {
    try {
      const fechaDesde = moment().startOf('year').format('YYYY-MM-DD') + 'T00:00'; // Fecha de inicio del año a las 00:00
      const fechaHasta = moment().endOf('day').format('YYYY-MM-DD') + 'T23:59'; // Fecha actual a las 23:59
  
      // Obtener todos los índices
      const indices = await this.indiceService.findAll();
      
      // Crear un array de promesas para las solicitudes
      const cotizacionesPorIndicesPromises = indices.map(async (indice) => {
        const codigoIndice = indice.codIndice; // Obtener el código del índice
  
        // Construir la URL para la solicitud
        const url = `http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/${codigoIndice}/cotizaciones?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
  
        // Realizar la solicitud a la API
        const response = await axios.get(url);
        return { codigoIndice, cotizaciones: response.data }; // Suponiendo que la respuesta contiene las cotizaciones
      });
  
      // Esperar a que todas las promesas se resuelvan
      const cotizacionesPorIndices = await Promise.all(cotizacionesPorIndicesPromises);
  
      return cotizacionesPorIndices; // Devolver todas las cotizaciones obtenidas
    } catch (error) {
      console.error('Error al obtener cotizaciones por índices:', error);
      throw new HttpException('Error al obtener cotizaciones por índices', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  


  //funcion que valida y guarda en base de datos
  async guardarCotizaciones(indicesCotizaciones: any[]): Promise<void> {
    const cotizacionesParaGuardar = [];
    for (const indiceCotizacion of indicesCotizaciones) {
      const { codigoIndice, cotizaciones } = indiceCotizacion;
      for (const cotizacion of cotizaciones) {
        const horaCotizacion = cotizacion.hora;
        if (horaCotizacion >= '09:00' && horaCotizacion <= '15:00') {
          const cotizacionExistente = await this.cotizacionIndiceRepository.findOne({
            where: {
              fecha: cotizacion.fecha,
              hora: cotizacion.hora,
              codigoIndice: { codIndice: codigoIndice },
            },
          });
          if (!cotizacionExistente) {
            cotizacionesParaGuardar.push(this.cotizacionIndiceRepository.create({
              fecha: cotizacion.fecha,
              hora: cotizacion.hora,
              valorCotizacionIndice: parseFloat(cotizacion.valor.toFixed(2)),
              codigoIndice: { codIndice: codigoIndice },
            }));
          }
        }
      }
    }
    await this.cotizacionIndiceRepository.save(cotizacionesParaGuardar);
  }

//funcion que, obtiene los datos de obtenerCotizacionesPorIndices, y utiliza guardarCotizaciones para validar y guardar en la base de datos(DOCKER INDICE DEMAS)
  async obtenerYGuardarCotizacionesPorIndices(): Promise<void> {
    try {
      // Obtener las cotizaciones por índices
      const cotizacionesPorIndices = await this.obtenerCotizacionesPorIndices();

      // Verificar si se obtuvieron cotizaciones
      if (!cotizacionesPorIndices || cotizacionesPorIndices.length === 0) {
        throw new Error('No se encontraron cotizaciones para guardar');
      }

      // Guardar las cotizaciones en la base de datos
      await this.guardarCotizaciones(cotizacionesPorIndices);
    } catch (error) {
      throw new HttpException('Error al obtener y guardar cotizaciones: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  
  //CALCULO MI INDICE COTIZACIONES
  //hago el calculo para crear mi indiceCotizacion
  private calcularSumaYConteo(cotizaciones: Cotizacion[]): { suma: number; conteo: number } {
    return cotizaciones.reduce(
      (acc, cotizacion) => {
        const cotizationValue = parseFloat(cotizacion.cotization.toString()); 
        if (!isNaN(cotizationValue) && cotizationValue >= 0) { 
          acc.suma += cotizationValue; 
          acc.conteo += 1; 
        } else {
          this.logger.warn(`Valor de cotization no válido: ${cotizacion.cotization}`); 
        }
        return acc; 
      },
      { suma: 0, conteo: 0 }, 
    );
  }

  async obtenerCotizacionesAgrupadas(): Promise<any> {
    try {
      const cotizaciones = await this.cotizacionRepository.find();

      const agrupadas = cotizaciones.reduce((acc, cotizacion) => {
        const fecha = new Date(cotizacion.fecha).toISOString().substring(0, 10); 
        const hora = cotizacion.hora;

        if (!acc[fecha]) {
          acc[fecha] = {};
        }

        if (!acc[fecha][hora]) {
          acc[fecha][hora] = [];
        }

        acc[fecha][hora].push(cotizacion);
        return acc;
      }, {});

      return agrupadas;
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener las cotizaciones agrupadas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //calcular y guardar promedio de IBOV
  async calcularYGuardarPromedios(): Promise<void> {
    try {
      const cotizacionesAgrupadas = await this.obtenerCotizacionesAgrupadas();
  
      const promediosParaGuardar = []; // Array para almacenar los promedios a guardar
  
      // Iterar sobre cada fecha y hora en las cotizaciones agrupadas
      for (const fecha in cotizacionesAgrupadas) {
        for (const hora in cotizacionesAgrupadas[fecha]) {
          const cotizaciones = cotizacionesAgrupadas[fecha][hora];
          const { suma, conteo } = this.calcularSumaYConteo(cotizaciones);
  
          if (conteo === 0) {
            continue; // Si no hay cotizaciones, saltar a la siguiente iteración
          }
  
          const promedio = suma / conteo;
  
          const indiceIBOV = await this.indiceRepository.findOne({ where: { codIndice: 'IBOV' } });
          if (!indiceIBOV) {
            console.warn(`El índice IBOV no se encontró en la base de datos.`);
            continue; // Salta a la siguiente iteración
          }
  
          // Verificar si el promedio ya existe
          const cotizacionExistente = await this.cotizacionIndiceRepository.findOne({
            where: {
              fecha: fecha,
              hora: hora,
              codigoIndice: { codIndice: 'IBOV' }
            }
          });
  
          if (!cotizacionExistente) {
            const cotizacionIndice = this.cotizacionIndiceRepository.create({
              fecha,
              hora,
              valorCotizacionIndice: parseFloat(promedio.toFixed(2)),
              codigoIndice: indiceIBOV,
            });
  
            promediosParaGuardar.push(cotizacionIndice); // Agregar a la lista de promedios a guardar
            console.log(`Promedio ${promedio} calculado para la fecha ${fecha} y hora ${hora}`);
          } else {
            console.warn(`Cotización promedio ya existe para la fecha ${fecha} y hora ${hora}. No se guardará un nuevo promedio.`);
          }
        }
      }
  
      // Guardar los promedios en lotes
      const batchSize = 1000; // Tamaño del lote
      for (let i = 0; i < promediosParaGuardar.length; i += batchSize) {
        const batch = promediosParaGuardar.slice(i, i + batchSize);
        await this.cotizacionIndiceRepository.save(batch);
        console.log(`Guardados ${batch.length} promedios en la base de datos.`);
      }
  
      console.log('Todos los promedios han sido calculados y guardados exitosamente.');
    } catch (error) {
      console.error(`Error al calcular y guardar promedios: ${error.message}`);
      throw new HttpException('Error al calcular y guardar promedios', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // FIN DE MI CALCULO DE INDICECOTIZACIONES

  
 //verificar si existe un indiceCotizaciones
 async verificarCotizacionEnGempresa(fecha: string, hora: string, codIndice: string): Promise<boolean> {
  const url = `http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/cotizaciones/${codIndice}?fecha=${fecha}&hora=${hora}`;
  try {
    const response = await axios.get(url);
    return response.data.length > 0;
  } catch (error) {
    // No registrar nada en el log para errores
    return false; // Devuelve false si hay un error
  }
}

  //Publicar mi indiceCotizacionesen la base
  async publicarTodasLasCotizaciones(): Promise<any> {
  try {
    // Obtener las cotizaciones agrupadas
    const cotizacionesAgrupadas = await this.indiceCoti();

    if (Object.keys(cotizacionesAgrupadas).length === 0) {
      return { message: 'No hay cotizaciones para publicar' };
    }

    for (const fecha in cotizacionesAgrupadas) {
      for (const hora in cotizacionesAgrupadas[fecha]) {
        const cotizaciones = cotizacionesAgrupadas[fecha][hora];

        for (const cotizacion of cotizaciones) {
          if (!cotizacion.codIndice) {
            console.warn(`Cotización sin índice para la fecha ${fecha}. Se omitirá.`);
            continue; // Salta a la siguiente cotización si no hay índice
          }

          // Verificar si la cotización ya ha sido publicada en el servicio externo
          const yaPublicada = await this.verificarCotizacionEnGempresa(fecha, hora, cotizacion.codIndice);
          if (yaPublicada) {
            console.warn(`Cotización ya publicada para la fecha ${fecha} a las ${hora}. Se omitirá.`);
            continue; // Salta a la siguiente cotización si ya fue publicada
          }

          const data = {
            fecha: cotizacion.fecha,
            hora: cotizacion.hora,
            codigoIndice: cotizacion.codIndice,
            valorIndice: cotizacion.valorCotizacionIndice,
          };

          try {
            // Publicar la cotización en el servicio externo
            const response = await axios.post(this.apiUrl, data);
            console.log(`Cotización publicada exitosamente: ${JSON.stringify(response.data)}`);
          } catch (error) {
            console.error(`Error al publicar la cotización para la fecha ${fecha} a las ${hora}:`, error.message);
            continue; // Salta a la siguiente cotización si ocurre un error
          }
        }
      }
    }

    return { message: 'Todas las cotizaciones han sido procesadas para publicación' };
  } catch (error) {
    console.error(`Error al procesar las cotizaciones: ${error.message}`);
    throw new HttpException('Error al procesar las cotizaciones', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  //publicar mi indice en gempresa

  async obtenerCotizacionesIBOV(): Promise<any> {
    try {
      const fechaDesde = '2024-01-01'; 
      const fechaHasta = moment().format('YYYY-MM-DD'); 
  
     
      const response = await axios.get(this.apiUrlIBOV, {
        params: {
          fechaDesde: `${fechaDesde}T00:00`, 
          fechaHasta: `${fechaHasta}T23:59`, 
        },
      });
  
      const cotizaciones = response.data; 
  
      return cotizaciones; 
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error.response ? error.response.data : error.message);
      throw new HttpException('Error al obtener las cotizaciones del índice IBOV', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async publicarIndiceEnGempresa(fecha: string, hora: string, codigoIndice: string, indice: number): Promise<any> {
    const data = {
      fecha,
      hora,
      codigoIndice,
      valorIndice: indice,
    };
    const url = "http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/cotizaciones"
    try {
      
      const response = await axios.post(url, data);
      this.logger.log(`Índice ${codigoIndice} publicado en Gempresa`);
      return response.data
    } catch (error) {
       this.logger.error(`fecha ya publicada para el indice ${codigoIndice} en Gempresa`);
   }
  }

  //Verifica las cotizaciones existentes para el 
  //índice IBOV y publica las que falten en el sistema externo.
  // Utiliza las funciones anteriores para obtener y comparar cotizaciones.
  async verificarYPublicarCotizacionesIBOV(): Promise<void> {
    try {
      // Obtener todas las cotizaciones existentes en la base de datos para IBOV
      const cotizacionesExistentes = await this.cotizacionIndiceRepository.find({
        where: { codIndice: 'IBOV' }, // Asegúrate de que este campo se llama así
      });
  
      // Obtener las cotizaciones de IBOV desde la API externa
      const cotizacionesIBOV = await this.obtenerCotizacionesIBOV(); // Método que obtiene las cotizaciones desde la API
  
      // Crear un conjunto para facilitar la verificación de cotizaciones existentes
      const cotizacionesExistentesSet = new Set(
        cotizacionesExistentes.map(cotizacion => `${cotizacion.fecha}-${cotizacion.hora}`)
      );
  
      // Crear un array para almacenar las cotizaciones a publicar
      const cotizacionesParaPublicar = [];
  
      // Publicar las cotizaciones que faltan
      for (const cotizacion of cotizacionesIBOV) {
        const fecha = cotizacion.fecha; // Fecha de la cotización
        const hora = cotizacion.hora; // Hora de la cotización
        const key = `${fecha}-${hora}`; // Crear una clave única para la verificación
  
        // Verificar si la cotización ya existe en la base de datos
        if (!cotizacionesExistentesSet.has(key)) {
          // Si no existe, crear el objeto con el formato esperado
          const data = {
            _id: cotizacion.id, // Asegúrate de que este campo esté disponible
            code: 'IBOV',
            fecha: cotizacion.fecha,
            hora: cotizacion.hora,
            fechaDate: moment(`${cotizacion.fecha}T00:00:00.000Z`).toISOString(), // Formatear la fecha
            valor: cotizacion.valorCotizacionIndice, // Asegúrate de que este campo esté disponible
            __v: 0,
          };
  
          // Agregar a la lista de cotizaciones a publicar
          cotizacionesParaPublicar.push(data);
          console.log(`Cotización a publicar: ${JSON.stringify(data)}`);
        } else {
          console.log(`Cotización ya existe para la fecha ${fecha} a las ${hora}. Se omitirá.`);
        }
      }
  
      // Publicar las cotizaciones en la API externa en lotes
      const batchSize = 1000; // Tamaño del lote
      for (let i = 0; i < cotizacionesParaPublicar.length; i += batchSize) {
        const batch = cotizacionesParaPublicar.slice(i, i + batchSize);
        await Promise.all(batch.map(data => axios.post(this.apiUrl, data)));
        console.log(`Publicadas ${batch.length} cotizaciones en la API externa.`);
      }
  
      console.log('Todas las cotizaciones han sido verificadas y publicadas exitosamente.');
    } catch (error) {
      console.error(`Error al verificar y publicar cotizaciones IBOV: ${error.message}`);
      throw new HttpException('Error al verificar y publicar cotizaciones IBOV', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

/* 

async verificarYPublicarCotizacionesIBOV(): Promise<void> {
    try {
      // Obtener todas las cotizaciones existentes en la base de datos para IBOV
      const cotizacionesExistentes = await this.cotizacionIndiceRepository.find({
        where: { codIndice: 'IBOV' }, // Asegúrate de que este campo se llama así
      });
  
      // Obtener las cotizaciones de IBOV desde la API externa
      const cotizacionesIBOV = await this.obtenerCotizacionesIBOV(); // Método que obtiene las cotizaciones desde la API
  
      // Crear un conjunto para facilitar la verificación de cotizaciones existentes
      const cotizacionesExistentesSet = new Set(
        cotizacionesExistentes.map(cotizacion => `${cotizacion.fecha}-${cotizacion.hora}`)
      );
  
      // Publicar las cotizaciones que faltan
      for (const cotizacion of cotizacionesIBOV) {
        const fecha = cotizacion.fecha; // Fecha de la cotización
        const hora = cotizacion.hora; // Hora de la cotización
        const key = `${fecha}-${hora}`; // Crear una clave única para la verificación
  
        // Verificar si la cotización ya existe en la base de datos
        if (!cotizacionesExistentesSet.has(key)) {
          // Si no existe, crear el objeto con el formato esperado
          const data = {
            _id: cotizacion.id, // Asegúrate de que este campo esté disponible
            code: 'IBOV',
            fecha: cotizacion.fecha,
            hora: cotizacion.hora,
            fechaDate: moment(`${cotizacion.fecha}T00:00:00.000Z`).toISOString(), // Formatear la fecha
            valor: cotizacion.valorCotizacionIndice, // Asegúrate de que este campo esté disponible
            __v: 0,
          };
  
          // Enviar a la API externa
          await axios.post(this.apiUrl, data);
          console.log(`Cotización publicada: ${JSON.stringify(data)}`);
        } else {
          console.log(`Cotización ya existe para la fecha ${fecha} a las ${hora}. Se omitirá.`);
        }
      }
    } catch (error) {
      console.error(`Error al verificar y publicar cotizaciones IBOV: ${error.message}`);
      throw new HttpException('Error al verificar y publicar cotizaciones IBOV', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
----------------------------------------------------------------------------------------------------------------
ACA ABAJO TODO LO DE FRONT    -----      ACA ABAJO TODO LO DE FRONT    -------    ACA ABAJO TODO LO DE FRONT
----------------------------------------------------------------------------------------------------------------
*/

async obtenerPromedioCotizacionesPorDiaDeTodosLosIndices(): Promise<{ codigoIndice: string; fecha: string; promedio: number }[]> {
  try {
    // Obtener todas las cotizaciones por índices
    const cotizacionesPorIndices = await this.obtenerCotizacionesPorIndices();

    // Crear un objeto para almacenar los promedios agrupados por índice y fecha
    const promediosPorDia: { [codigoIndice: string]: { [fecha: string]: number[] } } = {};

    // Iterar sobre cada índice y sus cotizaciones
    cotizacionesPorIndices.forEach(indice => {
      const codigoIndice = indice.codigoIndice;
      indice.cotizaciones.forEach(cotizacion => {
        const fechaCotizacion = moment(cotizacion.fecha).format('YYYY-MM-DD'); // Formato año-mes-día

        // Inicializar la estructura si no existe
        if (!promediosPorDia[codigoIndice]) {
          promediosPorDia[codigoIndice] = {};
        }
        if (!promediosPorDia[codigoIndice][fechaCotizacion]) {
          promediosPorDia[codigoIndice][fechaCotizacion] = [];
        }

        // Agregar el valor de la cotización al array correspondiente
        promediosPorDia[codigoIndice][fechaCotizacion].push(cotizacion.valor); // Asumiendo que cotizacion.valor es el valor de la cotización
      });
    });

    // Calcular el promedio por día para cada índice
    const resultados = Object.keys(promediosPorDia).flatMap(codigoIndice => {
      return Object.keys(promediosPorDia[codigoIndice]).map(fecha => {
        const valores = promediosPorDia[codigoIndice][fecha];
        const suma = valores.reduce((acc, valor) => acc + valor, 0);
        const promedio = valores.length > 0 ? parseFloat((suma / valores.length).toFixed(2)) : 0; // Evitar división por cero
        return { codigoIndice, fecha, promedio };
      });
    });

    return resultados; // Devolver los promedios por día y por índice
  } catch (error) {
    console.error('Error al obtener el promedio de cotizaciones por día de todos los índices:', error);
    throw new HttpException('Error al obtener el promedio de cotizaciones por día de todos los índices', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}





async calcularPromedioTotalPorIndiceSinTSE(): Promise<any[]> {
  try {
    // Obtener todas las cotizaciones por índices
    const cotizacionesPorIndices = await this.obtenerCotizacionesPorIndices();

    // Crear un objeto para almacenar los totales y conteos por índice
    const promediosTotales: { [codigoIndice: string]: { suma: number; conteo: number; nombre: string } } = {};

    // Iterar sobre cada índice y sus cotizaciones
    cotizacionesPorIndices.forEach(indice => {
      const codigoIndice = indice.codigoIndice; // Obtener el código del índice
      const nombreIndice = indice.nombre; // Suponiendo que tienes el nombre del índice en el objeto indice

      // Ignorar el índice TSE
      if (codigoIndice === 'TSE') {
        return; // Salir de la iteración si es TSE
      }

      indice.cotizaciones.forEach(cotizacion => {
        const valorCotizacion = cotizacion.valor; // Asumiendo que cotizacion.valor es el valor de la cotización

        // Inicializar la estructura si no existe
        if (!promediosTotales[codigoIndice]) {
          promediosTotales[codigoIndice] = { suma: 0, conteo: 0, nombre: nombreIndice }; // Guardar el nombre del índice
        }

        // Sumar el valor de la cotización y aumentar el conteo
        promediosTotales[codigoIndice].suma += valorCotizacion;
        promediosTotales[codigoIndice].conteo += 1;
      });
    });

    // Calcular el promedio total por índice
    const resultados = Object.keys(promediosTotales).map(codigoIndice => {
      const { suma, conteo, nombre } = promediosTotales[codigoIndice];
      const promedioTotal = conteo > 0 ? parseFloat((suma / conteo).toFixed(2)) : 0; // Evitar división por cero
      return { codigoIndice, nombre, promedioTotal }; // Incluir el nombre en el resultado
    });

    return resultados; // Devolver los promedios totales
  } catch (error) {
    console.error('Error al calcular el promedio total por índice sin TSE:', error);
    throw new HttpException('Error al calcular el promedio total por índice sin TSE', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

async calcularPromedioTotalPorIndice(): Promise<any[]> {
  try {
    // Obtener todas las cotizaciones por índices
    const cotizacionesPorIndices = await this.obtenerCotizacionesPorIndices();

    // Crear un objeto para almacenar los totales y conteos por índice
    const promediosTotales: { [codigoIndice: string]: { suma: number; conteo: number; nombre: string } } = {};

    // Iterar sobre cada índice y sus cotizaciones
    cotizacionesPorIndices.forEach(indice => {
      const codigoIndice = indice.codigoIndice; // Obtener el código del índice
      const nombreIndice = indice.nombre; // Suponiendo que tienes el nombre del índice en el objeto indice
      indice.cotizaciones.forEach(cotizacion => {
        const valorCotizacion = cotizacion.valor; // Asumiendo que cotizacion.valor es el valor de la cotización

        // Inicializar la estructura si no existe
        if (!promediosTotales[codigoIndice]) {
          promediosTotales[codigoIndice] = { suma: 0, conteo: 0, nombre: nombreIndice }; // Guardar el nombre del índice
        }

        // Sumar el valor de la cotización y aumentar el conteo
        promediosTotales[codigoIndice].suma += valorCotizacion;
        promediosTotales[codigoIndice].conteo += 1;
      });
    });

    // Calcular el promedio total por índice
    const resultados = Object.keys(promediosTotales).map(codigoIndice => {
      const { suma, conteo, nombre } = promediosTotales[codigoIndice];
      const promedioTotal = conteo > 0 ? parseFloat((suma / conteo).toFixed(2)) : 0; // Evitar división por cero
      return { codigoIndice, nombre, promedioTotal }; // Incluir el nombre en el resultado
    });

    return resultados; // Devolver los promedios totales
  } catch (error) {
    console.error('Error al calcular el promedio total por índice:', error);
    throw new HttpException('Error al calcular el promedio total por índice', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

async obtenerCotizacionesUltimoMesPorIndices(): Promise<any[]> {
  try {
    // Obtener la fecha actual y la fecha de hace un mes
    const fechaActual = moment();
    const fechaHaceUnMes = moment().subtract(1, 'months');

    // Obtener todos los índices
    const indices = await this.indiceService.findAll();
    const cotizacionesPorIndices = [];

    // Iterar sobre cada índice
    for (const indice of indices) {
      const codigoIndice = indice.codIndice; // Obtener el código del índice
      const cotizacionesPorDia = [];

      // Iterar sobre cada día del último mes
      for (let fecha = fechaHaceUnMes.clone(); fecha.isBefore(fechaActual); fecha.add(1, 'days')) {
        const fechaStr = fecha.format('YYYY-MM-DD');

        // Obtener las cotizaciones del índice para la fecha actual
        const cotizaciones = await this.cotizacionIndiceRepository.find({
          where: {
            codigoIndice: { codIndice: codigoIndice },
            fecha: fechaStr,
          },
        });

        cotizacionesPorDia.push({
          fecha: fechaStr,
          cotizaciones, // Almacenar las cotizaciones para ese día
        });
      }

      cotizacionesPorIndices.push({
        codigoIndice,
        cotizacionesPorDia, // Almacenar las cotizaciones por día para el índice
      });
    }

    return cotizacionesPorIndices; // Devolver todas las cotizaciones obtenidas
  } catch (error) {
    console.error('Error al obtener cotizaciones del último mes por índices:', error);
    throw new HttpException('Error al obtener cotizaciones del último mes por índices', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

async obtenerPromedioMensualCotizacionesIndices(): Promise<any[]> {
  try {
    const fechaDesde = moment().startOf('year').format('YYYY-MM-DD') + 'T00:00'; // Fecha de inicio del año a las 00:00
    const fechaHasta = moment().endOf('day').format('YYYY-MM-DD') + 'T23:59'; // Fecha actual a las 23:59

    // Obtener todas las cotizaciones por índices
    const cotizacionesPorIndices = await this.obtenerCotizacionesPorIndices(); // Asegúrate de que este método devuelve todas las cotizaciones del año

    // Crear un objeto para almacenar los totales y conteos por mes y por índice
    const promediosMensuales: { [codigoIndice: string]: { [mes: string]: { suma: number; conteo: number } } } = {};

    // Iterar sobre cada índice y sus cotizaciones
    cotizacionesPorIndices.forEach(indice => {
      indice.cotizaciones.forEach(cotizacion => {
        const fechaCotizacion = moment(cotizacion.fecha);
        const mesKey = fechaCotizacion.format('YYYY-MM'); // Formato año-mes
        const codigoIndice = indice.codigoIndice; // Obtener el código del índice

        // Inicializar la estructura si no existe
        if (!promediosMensuales[codigoIndice]) {
          promediosMensuales[codigoIndice] = {};
        }
        if (!promediosMensuales[codigoIndice][mesKey]) {
          promediosMensuales[codigoIndice][mesKey] = { suma: 0, conteo: 0 };
        }

        // Sumar el valor de la cotización y aumentar el conteo
        promediosMensuales[codigoIndice][mesKey].suma += cotizacion.valor; // Asumiendo que cotizacion.valor es el valor de la cotización
        promediosMensuales[codigoIndice][mesKey].conteo += 1;
      });
    });

    // Calcular el promedio mensual para cada índice
    const resultados = Object.keys(promediosMensuales).map(codigoIndice => {
      const promediosPorIndice = Object.keys(promediosMensuales[codigoIndice]).map(mes => {
        const { suma, conteo } = promediosMensuales[codigoIndice][mes];
        const promedioMensual = conteo > 0 ? parseFloat((suma / conteo).toFixed(2)) : 0; // Evitar división por cero
        return { mes, promedioMensual }; // Incluir el mes y el promedio en el resultado
      });
      return { codigoIndice, promedios: promediosPorIndice }; // Agrupar por código de índice
    });

    return resultados; // Devolver los promedios mensuales por índice
  } catch (error) {
    console.error('Error al obtener el promedio mensual de cotizaciones de índices:', error);
    throw new HttpException('Error al obtener el promedio mensual de cotizaciones de índices', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

async obtenerCotizacionesUltimoMes(): Promise<any[]> {
  try {
    // Obtener todas las cotizaciones por índices
    const cotizacionesPorIndices = await this.obtenerCotizacionesPorIndices();
    
    // Obtener la fecha actual y la fecha de hace un mes
    const fechaActual = moment();
    const fechaHaceUnMes = moment().subtract(1, 'months');

    // Crear un objeto para almacenar los promedios diarios agrupados por codIndice
    const promediosDiarios: { [key: string]: { [fecha: string]: { suma: number; conteo: number } } } = {};

    // Iterar sobre cada índice y sus cotizaciones
    cotizacionesPorIndices.forEach(indice => {
      const codigoIndice = indice.codigoIndice; // Obtener el código del índice
      indice.cotizaciones.forEach(cotizacion => {
        const fechaCotizacion = moment(cotizacion.fecha);
        if (fechaCotizacion.isBetween(fechaHaceUnMes, fechaActual, null, '[]')) {
          const fechaKey = fechaCotizacion.format('YYYY-MM-DD');

          // Inicializar la estructura si no existe
          if (!promediosDiarios[codigoIndice]) {
            promediosDiarios[codigoIndice] = {};
          }
          if (!promediosDiarios[codigoIndice][fechaKey]) {
            promediosDiarios[codigoIndice][fechaKey] = { suma: 0, conteo: 0 };
          }

          promediosDiarios[codigoIndice][fechaKey].suma += cotizacion.valor; // Asumiendo que cotizacion.valor es el valor de la cotización
          promediosDiarios[codigoIndice][fechaKey].conteo += 1;
        }
      });
    });

    // Calcular el promedio por día para cada índice
    const promediosPorIndice = Object.keys(promediosDiarios).map(codigoIndice => {
      const promediosPorDia = Object.keys(promediosDiarios[codigoIndice]).map(fecha => {
        const { suma, conteo } = promediosDiarios[codigoIndice][fecha];
        const promedio = conteo > 0 ? parseFloat((suma / conteo).toFixed(2)) : 0; // Evitar división por cero
        return { fecha, promedio };
      });
      return { codigoIndice, promedios: promediosPorDia }; // Agrupar por código de índice
    });

    return promediosPorIndice;
  } catch (error) {
    console.error('Error al obtener las cotizaciones del último mes:', error);
    throw new HttpException('Error al obtener las cotizaciones del último mes', HttpStatus.INTERNAL_SERVER_ERROR);
  }
} 





}