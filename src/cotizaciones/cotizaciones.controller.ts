import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { CotizacionService } from './cotizaciones.service';
import { CotizacionDto } from './dto/cotizacion.dto';
import { CotizacionCronService } from 'src/services/cron.service';
import { Cotizacion } from './entitis/cotizacion.entity';

@Controller('cotizaciones')
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService,
    private readonly cotizacionCronService: CotizacionCronService
  ) { }
  
  @Get('promedio-ultimo-mes')
async obtenerPromedioCotizacionesUltimoMes() {
  try {
    const promedios = await this.cotizacionService.obtenerPromedioCotizacionesUltimoMesAgrupadosPorEmpresa();
    return promedios;
  } catch (error) {
    throw new HttpException('Error al obtener los promedios del último mes', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

  @Get('total-por-empresa')
  async obtenerPromedioTotalPorEmpresa() {
    try {
      const promediosTotales = await this.cotizacionService.obtenerPromedioTotalPorEmpresa();
      return promediosTotales;
    } catch (error) {
      throw new HttpException('Error al obtener el promedio total por empresa', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('promedio-todas-las-empresas')
  async obtenerPromedioCotizacionesPorDiaDeTodasLasEmpresas() {
    try {
      // Llama al servicio para obtener los promedios de cotizaciones por día de todas las empresas
      const promedios = await this.cotizacionService.obtenerPromedioCotizacionesPorDiaDeTodasLasEmpresas();
      return promedios; // Retorna los promedios obtenidos
    } catch (error) {
      // Manejo de errores en caso de que falle la obtención de promedios
      throw new HttpException('Error al obtener los promedios de cotizaciones de todas las empresas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':codempresa/ultimos-tres-dias')
  async obtenerUltimosTresDiasCotizaciones(@Param('codempresa') codempresa: string): Promise<Cotizacion[]> {
    try {
      return await this.cotizacionService.obtenerUltimosTresDiasCotizaciones(codempresa);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } 
  }

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

  @Get('desde-inicio-del-ano')
  async obtenerCotizacionesDesdeInicioDelAno() {
    try {
      await this.cotizacionService.obtenerCotizacionesDesdeInicioDelAno();
      return { message: 'Cotizaciones obtenidas y guardadas exitosamente.' };
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener las cotizaciones desde el inicio del año', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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