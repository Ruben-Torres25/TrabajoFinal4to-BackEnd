import { Controller, Get, Param, Query } from '@nestjs/common';
import { CotizacionService } from './cotizaciones.service';
import { CotizacionDto } from './dto/cotizacion.dto';


@Controller('empresas')
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService) {}

  @Get(':codigoEmpresa/cotizacion')
  async obtenerCotizacion(
    @Param('codigoEmpresa') codigoEmpresa: string,
    @Query('fecha') fecha: string,
    @Query('hora') hora: string,
  ): Promise<CotizacionDto> {
    return this.cotizacionService.obtenerCotizacion(codigoEmpresa, fecha, hora);
  }


  @Get(':codempresa/rango')
  async obtenerCotizacionesRango(
    @Param('codempresa') codempresa: string,
    @Query('fechaDesde') fechaDesde: string,
    @Query('fechaHasta') fechaHasta: string,
  ) {
    return this.cotizacionService.obtenerCotizaciones(codempresa, fechaDesde, fechaHasta);
  }

}