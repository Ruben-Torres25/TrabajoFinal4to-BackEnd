import { CotizacionDto } from './dto/cotizacion.dto';
import { Cotizacion } from './entitis/cotizacion.entity';
import { Repository } from 'typeorm';
export declare class CotizacionService {
    private readonly cotizacionRepository;
    private apiUrl;
    constructor(cotizacionRepository: Repository<Cotizacion>);
    obtenerCotizacion(codigoEmpresa: string, fecha: string, hora: string): Promise<CotizacionDto>;
    obtenerCotizaciones(codempresa: string, fechaDesde: string, fechaHasta: string): Promise<any>;
}
