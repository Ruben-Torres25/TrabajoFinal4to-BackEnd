import { CotizacionIndiceService } from './indice-cotizaciones.service';
export declare class CotizacionIndiceController {
    private readonly cotizacionIndiceService;
    constructor(cotizacionIndiceService: CotizacionIndiceService);
    obtenerCotizacionesAgrupadas(): Promise<any>;
    calcularPromedios(): Promise<{
        message: string;
    }>;
    publicarTodas(): Promise<any>;
    obtenerCotizacionesIBOV(): Promise<any>;
    verificarYPublicarCotizacionesIBOV(): Promise<{
        message: string;
    }>;
}
