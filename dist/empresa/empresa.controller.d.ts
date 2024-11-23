import { EmpresaService } from './empresa.service';
export declare class EmpresaController {
    private readonly empresaService;
    constructor(empresaService: EmpresaService);
    obtenerInformacionEmpresa(codempresa: string): Promise<any>;
}
