import { EmpresaService } from './empresa.service';
import { Empresa } from './entities/empresa.entity';
export declare class EmpresaController {
    private readonly empresaService;
    constructor(empresaService: EmpresaService);
    obtenerTodasLasEmpresas(): Promise<Empresa[]>;
    obtenerInformacionEmpresa(codempresa: string): Promise<any>;
}
