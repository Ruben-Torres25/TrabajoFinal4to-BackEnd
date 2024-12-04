import { CotizacionService } from './cotizaciones.service';
import { CotizacionDto } from './dto/cotizacion.dto';
import { CotizacionCronService } from 'src/services/cron.service';
import { Cotizacion } from './entitis/cotizacion.entity';
export declare class CotizacionController {
    private readonly cotizacionService;
    private readonly cotizacionCronService;
    constructor(cotizacionService: CotizacionService, cotizacionCronService: CotizacionCronService);
    obtenerPromedioCotizacionesUltimoMes(): Promise<{
        codempresa: string;
        empresaNombre: string;
        promedios: {
            fecha: string;
            promedio: number;
        }[];
    }[]>;
    obtenerPromedioTotalPorEmpresa(): Promise<{
        codempresa: string;
        empresaNombre: string;
        promedioTotal: number;
    }[]>;
    obtenerPromedioCotizacionesPorDiaDeTodasLasEmpresas(): Promise<{
        codempresa: string;
        empresaNombre: string;
        fecha: string;
        promedio: number;
    }[]>;
    obtenerUltimosTresDiasCotizaciones(codempresa: string): Promise<Cotizacion[]>;
    obtenerPromedioCotizacionesPorDia(codempresa: string): Promise<{
        fecha: string;
        promedio: number;
    }[]>;
    obtenerCotizacionesPorEmpresa(codempresa: string): Promise<CotizacionDto[]>;
    obtenerCotizacionEmpresa(codigoEmpresa: string, fecha: string, hora: string): Promise<CotizacionDto>;
    obtenerCotizacionesDesdeInicioDelAno(): Promise<{
        message: string;
    }>;
    obtenerCotizacionesRango(codempresa: string, fechaDesde: string, fechaHasta: string): Promise<any>;
}
