import { CotizacionService } from './cotizaciones.service';
import { CotizacionDto } from './dto/cotizacion.dto';
export declare class CotizacionController {
    private readonly cotizacionService;
    constructor(cotizacionService: CotizacionService);
    obtenerCotizacion(codigoEmpresa: string, fecha: string, hora: string): Promise<CotizacionDto>;
    obtenerCotizacionesRango(codempresa: string, fechaDesde: string, fechaHasta: string): Promise<any>;
}
