import { Repository } from 'typeorm';
import { Indice } from './entities/indice.entity';
export declare class IndiceService {
    private readonly indiceRepository;
    private apiUrl;
    constructor(indiceRepository: Repository<Indice>);
    obtenerIndices(): Promise<{
        message: string;
    }>;
    findAll(): Promise<Indice[]>;
}
