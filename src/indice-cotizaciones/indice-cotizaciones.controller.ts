import { Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { CotizacionIndiceService } from './indice-cotizaciones.service';

import { IndiceService } from 'src/indice/indice.service';
@Controller('IndiceCotizaciones')
export class CotizacionIndiceController {
  constructor(
    private readonly cotizacionIndiceService: CotizacionIndiceService,
    private readonly indiceService: IndiceService,
  ) {}
  
  @Get('agrupadas')
  async obtenerCotizacionesAgrupadas() {
    return this.cotizacionIndiceService.obtenerCotizacionesAgrupadas();
  }
 
  @Get('calcular-promedios')
  async calcularPromedios() {
    try {
      await this.cotizacionIndiceService.calcularYGuardarPromedios();
      return { message: 'Promedios calculados y guardados exitosamente.' };
    } catch (error) {
      throw new HttpException('Error al calcular y guardar promedios', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
 
 @Post('publicar-todas')
  async publicarTodas() {
    try {
      const result = await this.cotizacionIndiceService.verificarYPublicarCotizacionesIBOV();
      return result;
    } catch (error) {
      throw new HttpException('Error al publicar las cotizaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get('ibov')
  async obtenerCotizacionesIBOV() {
    return await this.cotizacionIndiceService.obtenerCotizacionesIBOV();
  }
  
 
  @Get('por-indices')
  async obtenerCotizacionesPorIndices() {
    try {
      const cotizaciones = await this.cotizacionIndiceService.obtenerCotizacionesPorIndices();
      return cotizaciones;
    } catch (error) {
      throw new HttpException('Error al obtener cotizaciones por índices', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Post('guardar-manualmente')
  async guardarCotizacionesManualmente(): Promise<{ message: string }> {
    try {

      await this.cotizacionIndiceService.obtenerYGuardarCotizacionesPorIndices();

      return { message: 'Cotizaciones obtenidas y guardadas exitosamente.' };
    } catch (error) {
      throw new HttpException('Error al guardar las cotizaciones manualmente: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  


  /* ----------------------------------------------  */


  @Get('promedio-por-dia')
  async obtenerPromedioCotizacionesPorDia() {
    try {
      const promedios = await this.cotizacionIndiceService.obtenerPromedioCotizacionesPorDiaDeTodosLosIndices();
      return promedios;
    } catch (error) {
      throw new HttpException('Error al obtener los promedios de cotizaciones por día', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  

  @Get('ultimo-mes')
  async obtenerCotizacionesUltimoMesPorIndices() {
    return await this.cotizacionIndiceService.obtenerCotizacionesUltimoMesPorIndices();
  }

  @Get('promedio-total-sin-tse')
  async obtenerPromedioTotalSinTSE() {
    try {
      const promedios = await this.cotizacionIndiceService.calcularPromedioTotalPorIndiceSinTSE();
      return promedios;
    } catch (error) {
      throw new HttpException('Error al obtener el promedio total sin TSE', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('promedio-total-por-indice')
async obtenerPromedioTotalPorIndice() {
  return await this.cotizacionIndiceService.calcularPromedioTotalPorIndice();
}


  @Get('ultimo-mes')
  async obtenerCotizacionesUltimoMes() {
    try {
      const cotizacionesUltimoMes = await this.cotizacionIndiceService.obtenerCotizacionesUltimoMes();
      return cotizacionesUltimoMes;
    } catch (error) {
      throw new HttpException('Error al obtener las cotizaciones del último mes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('promedio-mensual')
  async obtenerPromedioMensual(): Promise<any[]> {
    try {
      const promediosMensuales = await this.cotizacionIndiceService.obtenerPromedioMensualCotizacionesIndices();
      return promediosMensuales;
    } catch (error) {
      throw new HttpException('Error al obtener el promedio mensual de cotizaciones de índices', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }









  
} 