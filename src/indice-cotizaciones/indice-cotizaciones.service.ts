import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cotizacion } from 'src/cotizaciones/entitis/cotizacion.entity';
import { CotizacionIndice } from './entities/indice-cotizacione.entity';
import axios from 'axios';
import { Indice } from 'src/indice/entities/indice.entity';
import * as moment from 'moment-timezone';


@Injectable()
export class CotizacionIndiceService {
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
  ) { }

 


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


  async calcularYGuardarPromedios(): Promise<void> {
    try {
      const cotizacionesAgrupadas = await this.obtenerCotizacionesAgrupadas();

      for (const fecha in cotizacionesAgrupadas) {
        for (const hora in cotizacionesAgrupadas[fecha]) {
          const { suma, conteo } = this.calcularSumaYConteo(cotizacionesAgrupadas[fecha][hora]);

          if (conteo === 0) {
            continue; 
          }

          const promedio = suma / conteo;

          
          const indiceIBOV = await this.indiceRepository.findOne({ where: { codIndice: 'IBOV' } });
          if (!indiceIBOV) {
            console.warn(`El índice IBOV no se encontró en la base de datos.`);
            continue; // Salta a la siguiente iteración
          }

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

            await this.cotizacionIndiceRepository.save(cotizacionIndice);
            console.log(`Promedio ${promedio} guardado para la fecha ${fecha} y hora ${hora}`);
          } else {
            console.warn(`Cotización promedio ya existe para la fecha ${fecha} y hora ${hora}. No se guardará un nuevo promedio.`);
          }
        }
      }
    } catch (error) {
      console.error(`Error al calcular y guardar promedios: ${error.message}`);
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
      this.logger.error(`Error al publicar el índice ${codigoIndice} en Gempresa: ${error.message}`);
    }
  }






  async publicarTodasLasCotizaciones(): Promise<any> {
    const cotizaciones = await this.cotizacionIndiceRepository.find();

    
    if (cotizaciones.length === 0) {
      return { message: 'No hay cotizaciones para publicar' };
    }

    try {
      for (const cotizacion of cotizaciones) {
        
        if (!cotizacion.codIndice) {
          this.logger.warn(`Cotización sin índice encontrado: ${JSON.stringify(cotizacion)}`);
          continue; 
        }

        
        const yaPublicada = await this.verificarCotizacionEnGempresa(cotizacion.fecha, cotizacion.hora, cotizacion.codIndice);
        if (yaPublicada) {
          this.logger.warn(`Cotización ya publicada para la empresa ${cotizacion.codIndice} en la fecha ${cotizacion.fecha} a las ${cotizacion.hora}`);
          continue; 
        }

        const data = {
          fecha: cotizacion.fecha,
          hora: cotizacion.hora,
          codigoIndice: cotizacion.codIndice,
          valorIndice: cotizacion.valorCotizacionIndice,
        };

      
        try {
          const response = await axios.post(this.apiUrl, data);
          this.logger.log('Cotización publicada exitosamente:', response.data);
        } catch (error) {
          this.logger.error(`Error al publicar cotización: ${error.message}`);
        }
      }

      return { message: 'Todas las cotizaciones han sido procesadas para publicación' };
    } catch (error) {
      this.logger.error(`Error al procesar las cotizaciones: ${error.message}`);

    }
  }

  async verificarCotizacionEnGempresa(fecha: string, hora: string, codIndice: string): Promise<boolean> {
    const url = `http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/cotizaciones/${codIndice}?fecha=${fecha}&hora=${hora}`;
    try {
      const response = await axios.get(url);
      return response.data.length > 0;
    } catch (error) {
      this.logger.error(`Error al verificar el índice ${codIndice} en Gempresa: ${error.message}`);
      return false; 
    }
  }

  async verificarIndiceExistente(codigoIndice: string): Promise<boolean> {
    const indice = await this.indiceRepository.findOne({ where: { codIndice: codigoIndice } });
    return !!indice;
  }




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



  async verificarYPublicarCotizacionesIBOV(): Promise<void> {
    try {

      const cotizacionesExistentes = await this.cotizacionIndiceRepository.find();
     
      const cotizacionesIBOV = await this.obtenerCotizacionesIBOV();
      
      const cotizacionesIBOVSet = new Set(
        cotizacionesIBOV.map(cotizacion => `${cotizacion.fecha}-${cotizacion.hora}`)
      );
  
      const cotizacionesAFaltar = [];
      
      
      for (const cotizacion of cotizacionesExistentes) {
        const fecha = cotizacion.fecha; 
        const hora = cotizacion.hora; 
  
        const key = `${fecha}-${hora}`;
        if (!cotizacionesIBOVSet.has(key)) {
          cotizacionesAFaltar.push({
            fecha,
            hora,
            codigoIndice: cotizacion.codIndice, 
            valorIndice: cotizacion.valorCotizacionIndice, 
          });
        }
      }
  
      
      for (const cotizacion of cotizacionesAFaltar) {
        await this.publicarIndiceEnGempresa(cotizacion.fecha, cotizacion.hora, cotizacion.codigoIndice, cotizacion.valorIndice);
        console.log(`Cotización publicada para la fecha ${cotizacion.fecha} a las ${cotizacion.hora}`);
      }
  
    } catch (error) {
      console.error(`Error al verificar y publicar cotizaciones IBOV: ${error.message}`);
      throw new HttpException('Error al verificar y publicar cotizaciones IBOV', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}



/*

  async obtenerCotizacionesIBOV(): Promise<any> {
    try {
      const fechaDesde = '2024-01-01'; // Fecha inicial
      const fechaHasta = moment().format('YYYY-MM-DD'); // Fecha final, que es la fecha actual
  
      // Realiza la solicitud a la API
      const response = await axios.get(this.apiUrlIBOV, {
        params: {
          fechaDesde: `${fechaDesde}T00:00`, // Combina fecha y hora para el inicio
          fechaHasta: `${fechaHasta}T23:59`, // Combina fecha y hora para el final
        },
      });
  
      const cotizaciones = response.data; // Los datos que recibes
  
      return cotizaciones; // Devuelve las cotizaciones obtenidas
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error.response ? error.response.data : error.message);
      throw new HttpException('Error al obtener las cotizaciones del índice IBOV', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  ------------------------------------

  async publicarTodasLasCotizaciones(): Promise<any> {
    const cotizaciones = await this.cotizacionIndiceRepository.find();
    console.log('ACA ESTAN LAS COTIZACIONES',cotizaciones)
    // Asegúrate de que hay cotizaciones para publicar
    if (cotizaciones.length === 0) {
      return { message: 'No hay cotizaciones para publicar' };
    }
  
    try {
      for (const cotizacion of cotizaciones) {
        // Verifica que la cotización tenga un índice asociado
        if (!cotizacion.codIndice) {
          this.logger.warn(`Cotización sin índice encontrado: ${JSON.stringify(cotizacion)}`);
          continue; // O podrías lanzar un error aquí si prefieres
        }
  
        const data = {
          fecha: cotizacion.fecha,
          hora: cotizacion.hora,
          codigoIndice: cotizacion.codIndice, // Asegúrate de que este campo esté correctamente mapeado
          valorIndice: cotizacion.valorCotizacionIndice,
        };
  
        // Publicar los datos transformados
        try {
          const response = await axios.post(this.apiUrl, data); // Cambia this.apiUrl a la URL correcta de tu API
          this.logger.log('Cotización publicada exitosamente:', response.data);
        } catch (error) {
          this.logger.error(`Error al publicar cotización: ${error.message}`);
        }
      }
  
      return { message: 'Todas las cotizaciones han sido procesadas para publicación' };
    } catch (error) {
      this.logger.error(`Error al procesar las cotizaciones: ${error.message}`);
      throw new HttpException('Error al publicar las cotizaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

*/