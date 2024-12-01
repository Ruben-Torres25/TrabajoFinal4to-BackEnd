import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { CotizacionService } from './cotizaciones.service';
import { CotizacionDto } from './dto/cotizacion.dto';
import { CotizacionCronService } from 'src/services/cron.service';


@Controller('empresas')
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService,
    private readonly cotizacionCronService: CotizacionCronService
  ) { }
  

  @Get(':codempresa/promedio-cotizacion')
  async obtenerPromedioCotizacionesPorDia(
    @Param('codempresa') codempresa: string,
  ): Promise<{ fecha: string; promedio: number }[]> {
    try {
      const promedios = await this.cotizacionService.obtenerPromedioCotizacionesPorDia(codempresa);
      return promedios; // Retorna los promedios en un array de objetos
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('ejecutar-cotizaciones')
  async ejecutarCotizaciones() {
    await this.cotizacionCronService.ejecutarAhora();
    return { message: 'Ejecutando cron para obtener cotizaciones ahora.' };
  }

  @Get(':codempresa/cotizaciones')
  async obtenerCotizacionesPorEmpresa(
    @Param('codempresa') codempresa: string,
  ): Promise<CotizacionDto[]> {
    return await this.cotizacionService.obtenerCotizacionesPorEmpresa(codempresa);
  }

  @Get(':codigoEmpresa/cotizacion')
  async obtenerCotizacionEmpresa(
    @Param('codigoEmpresa') codigoEmpresa: string,
    @Query('fecha') fecha: string,
    @Query('hora') hora: string,
  ): Promise<CotizacionDto> {
    return this.cotizacionService.obtenerCotizacionEmpresa(codigoEmpresa, fecha, hora);
  }


  @Get(':codempresa/rango')
  async obtenerCotizacionesRango(
    @Param('codempresa') codempresa: string,
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string,
  ) {
    return this.cotizacionService.obtenerCotizacionesRango(codempresa, fechaDesde, fechaHasta);
  }

}