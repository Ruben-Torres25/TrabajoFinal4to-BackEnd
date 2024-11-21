import { EmpresaService } from './empresa.service';
export declare class EmpresaController {
    private readonly empresaService;
    constructor(empresaService: EmpresaService);
    getDetalleEmpresa(codigoEmpresa: string): Promise<any>;
    getCotizacionesEmpresa(codigoEmpresa: string, fechaDesde: string, fechaHasta: string): Promise<any>;
    getCotizacionEmpresa(codigoEmpresa: string, fecha: string, hora: string): Promise<any>;
}
