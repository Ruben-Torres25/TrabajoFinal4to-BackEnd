import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { CotizacionIndiceService } from './indice-cotizaciones.service';



@Controller('cotizaciones')
export class CotizacionIndiceController {
  constructor(private readonly cotizacionIndiceService: CotizacionIndiceService) {}

  @Get('agrupadas')
  async obtenerCotizacionesAgrupadas() {
    return this.cotizacionIndiceService.obtenerCotizacionesAgrupadas();
  }

  @Post('calcular-promedios')
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
      const result = await this.cotizacionIndiceService.publicarTodasLasCotizaciones();
      return result;
    } catch (error) {
      throw new HttpException('Error al publicar las cotizaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Get('ibov')
  async obtenerCotizacionesIBOV() {
    return await this.cotizacionIndiceService.obtenerCotizacionesIBOV();
  }

  @Post('verificar-publicar-ibov')
  async verificarYPublicarCotizacionesIBOV() {
    try {
      await this.cotizacionIndiceService.verificarYPublicarCotizacionesIBOV();
      return { message: 'Verificación y publicación de cotizaciones IBOV completadas exitosamente.' };
    } catch (error) {
      throw new HttpException('Error al verificar y publicar cotizaciones IBOV', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
} 