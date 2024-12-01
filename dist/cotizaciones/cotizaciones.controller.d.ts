import { CotizacionService } from './cotizaciones.service';
import { CotizacionDto } from './dto/cotizacion.dto';
import { CotizacionCronService } from 'src/services/cron.service';
import { Cotizacion } from './entitis/cotizacion.entity';
export declare class CotizacionController {
    private readonly cotizacionService;
    private readonly cotizacionCronService;
    constructor(cotizacionService: CotizacionService, cotizacionCronService: CotizacionCronService);
    obtenerUltimosTresDiasCotizaciones(codempresa: string): Promise<Cotizacion[]>;
    obtenerPromedioCotizacionesPorDia(codempresa: string): Promise<{
        fecha: string;
        promedio: number;
    }[]>;
    ejecutarCotizaciones(): Promise<{
        message: string;
    }>;
    obtenerCotizacionesPorEmpresa(codempresa: string): Promise<CotizacionDto[]>;
    obtenerCotizacionEmpresa(codigoEmpresa: string, fecha: string, hora: string): Promise<CotizacionDto>;
    obtenerCotizacionesRango(codempresa: string, fechaDesde: string, fechaHasta: string): Promise<any>;
}
