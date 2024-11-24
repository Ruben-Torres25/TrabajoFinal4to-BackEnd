import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import clienteAxios from 'axios';
import { CotizacionDto } from './dto/cotizacion.dto';
import { Cotizacion } from './entitis/cotizacion.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class CotizacionService {
  private apiUrl = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/';


  constructor(
    @InjectRepository(Cotizacion)
    private readonly cotizacionRepository: Repository<Cotizacion>,
  ) {}


  async obtenerCotizacion(codigoEmpresa: string, fecha: string, hora: string): Promise<CotizacionDto> {
    try {
      const response = await clienteAxios.get(`${this.apiUrl}empresas/${codigoEmpresa}/cotizacion`, {
        params: { fecha, hora },
      });

      const cotizacionIndividual = response.data;
      const guardado = this.cotizacionRepository.create({
        fecha: cotizacionIndividual.fecha,
        hora: cotizacionIndividual.hora,
        dateUTC: cotizacionIndividual.dateUTC,
        cotization: cotizacionIndividual.cotizacion,
        codempresa: cotizacionIndividual.codempresa,
      });
      
      await this.cotizacionRepository.save(guardado);
      


      return response.data;
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener la cotización', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    



  }




  
  async obtenerCotizaciones(codempresa: string, fechaDesde: string, fechaHasta: string) {
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
}