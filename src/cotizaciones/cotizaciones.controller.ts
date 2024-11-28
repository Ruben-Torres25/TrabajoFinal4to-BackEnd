import { Controller, Get, Param, Query } from '@nestjs/common';
import { CotizacionService } from './cotizaciones.service';
import { CotizacionDto } from './dto/cotizacion.dto';
import { CotizacionCronService } from 'src/services/cron.service';


@Controller('empresas')
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService,
    private readonly cotizacionCronService: CotizacionCronService
  ) {}


  @Get('ejecutar-cotizaciones')
  async ejecutarCotizaciones() {
      await this.cotizacionCronService.ejecutarAhora();
      return { message: 'Ejecutando cron para obtener cotizaciones ahora.' };
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