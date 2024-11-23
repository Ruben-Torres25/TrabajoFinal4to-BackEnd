import { Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
export declare class EmpresaService {
    private readonly indiceRepository;
    private apiUrl;
    constructor(indiceRepository: Repository<Empresa>);
    findByCodempresa(codempresa: string): Promise<any>;
}
