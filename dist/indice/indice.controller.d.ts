import { IndiceService } from './indice.service';
export declare class IndiceController {
    private readonly indiceService;
    constructor(indiceService: IndiceService);
    obtenerIndices(): Promise<{
        message: string;
    }>;
    getAllIndices(): Promise<{
        _id: string;
        codIndice: string;
        nombreIndice: string;
        __v: number;
    }[]>;
}
