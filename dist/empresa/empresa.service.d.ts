import { Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { Cotizacion } from './entities/cotizacion.entity';
import { RegistroFecha } from 'src/model/registro.fecha';
export declare class EmpresaService {
    private readonly empresaRepository;
    private readonly cotizacionRepository;
    private logger;
    constructor(empresaRepository: Repository<Empresa>, cotizacionRepository: Repository<Cotizacion>);
    getDetalleEmpresa(codigoEmpresa: string): Promise<any>;
    getAllEmpresas(): Promise<any>;
    getLast20CotizacionEmpresa(empresaId: number): Promise<any>;
    saveCotizacion(newCot: Cotizacion): Promise<Cotizacion>;
    getCotizationFecha(codigoEmpresa: string, regFecha: RegistroFecha): Promise<Cotizacion>;
    getCotizationesbyFechas(codigoEmpresa: string, fechaDesde: string, fechaHasta: string): Promise<Cotizacion[]>;
}
