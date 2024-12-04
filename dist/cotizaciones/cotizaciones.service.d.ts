import { CotizacionDto } from './dto/cotizacion.dto';
import { Cotizacion } from './entitis/cotizacion.entity';
import { Repository } from 'typeorm';
import { Empresa } from 'src/empresa/entities/empresa.entity';
export declare class CotizacionService {
    private readonly cotizacionRepository;
    private readonly empresaRepository;
    private apiUrl;
    private brazilTimezone;
    constructor(cotizacionRepository: Repository<Cotizacion>, empresaRepository: Repository<Empresa>);
    obtenerPromedioTotalPorEmpresa(): Promise<{
        codempresa: string;
        empresaNombre: string;
        promedioTotal: number;
    }[]>;
    obtenerPromedioCotizacionesUltimoMesAgrupadosPorEmpresa(): Promise<{
        codempresa: string;
        empresaNombre: string;
        promedios: {
            fecha: string;
            promedio: number;
        }[];
    }[]>;
    obtenerPromedioCotizacionesPorDiaDeTodasLasEmpresas(): Promise<{
        codempresa: string;
        empresaNombre: string;
        fecha: string;
        promedio: number;
    }[]>;
    obtenerUltimosTresDiasCotizaciones(codempresa: string): Promise<Cotizacion[]>;
    obtenerPromedioCotizacionesPorDia(codigoEmpresa: string): Promise<{
        fecha: string;
        promedio: number;
    }[]>;
    obtenerTodasLasCotizaciones(): Promise<CotizacionDto[]>;
    obtenerCotizacionesPorEmpresa(codigoEmpresa: string): Promise<CotizacionDto[]>;
    obtenerCotizacionEmpresa(codigoEmpresa: string, fecha: string, hora: string): Promise<CotizacionDto>;
    obtenerCotizacionesRango(codempresa: string, fechaDesde: string, fechaHasta: string): Promise<any>;
    obtenerCotizacionesDesdeInicioDelAno(): Promise<void>;
}
