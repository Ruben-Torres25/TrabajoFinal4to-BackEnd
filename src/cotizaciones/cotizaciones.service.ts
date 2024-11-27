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
      const fechaInicio = moment().startOf('year').toDate(); 
      const fechaActual = new Date(); 
  
      const empresas = await this.empresaRepository.find();
      
      for (const empresa of empresas) {
        
        const ultimaCotizacion = await this.cotizacionRepository.findOne({
          where: { empresa: { id: empresa.id } },
          order: { fecha: 'DESC' },
        });
        
        const fechaUltimaGuardada = ultimaCotizacion ? ultimaCotizacion.fecha : fechaInicio;
        
        
        for (let fecha = moment(fechaUltimaGuardada).add(1, 'days'); fecha.isBefore(fechaActual); fecha.add(1, 'days')) {
          const fechaStr = fecha.format('YYYY-MM-DD');
  
          
          for (let hora = 9; hora <= 15; hora++) {
            const horaStr = hora.toString().padStart(2, '0') + ':00';
  
           
            try {
              const cotizacion = await clienteAxios.get(`${this.apiUrl}empresas/${empresa.codempresa}/cotizacion`, {
                params: { fecha: fechaStr, hora: horaStr },
              });
              
              const cotizacionExistente = await this.cotizacionRepository.findOne({
                where: {
                  empresa: { id: empresa.id },
                  fecha: moment(fechaStr).tz(this.brazilTimezone).toDate(),
                  hora: horaStr,
                },
              });
              
              if (!cotizacionExistente) {
                const guardado = this.cotizacionRepository.create({
                  fecha: moment(cotizacion.data.fecha).tz(this.brazilTimezone).toDate(),
                  hora: cotizacion.data.hora,
                  cotization: parseFloat(cotizacion.data.cotization),
                  empresa: empresa,
                });
                
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