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
    obtenerTodasLasCotizaciones(): Promise<CotizacionDto[]>;
    obtenerCotizacionEmpresa(codigoEmpresa: string, fecha: string, hora: string): Promise<CotizacionDto>;
    obtenerCotizacionesRango(codempresa: string, fechaDesde: string, fechaHasta: string): Promise<any>;
    obtenerCotizacionesDesdeInicioDelAno(): Promise<void>;
}
