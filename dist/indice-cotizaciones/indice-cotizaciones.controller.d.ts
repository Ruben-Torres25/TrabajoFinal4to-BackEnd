import { CotizacionIndiceService } from './indice-cotizaciones.service';
import { IndiceService } from 'src/indice/indice.service';
export declare class CotizacionIndiceController {
    private readonly cotizacionIndiceService;
    private readonly indiceService;
    constructor(cotizacionIndiceService: CotizacionIndiceService, indiceService: IndiceService);
    obtenerCotizacionesAgrupadas(): Promise<any>;
    calcularPromedios(): Promise<{
        message: string;
    }>;
    publicarTodas(): Promise<void>;
    obtenerCotizacionesIBOV(): Promise<any>;
    obtenerCotizacionesPorIndices(): Promise<any[]>;
    guardarCotizacionesManualmente(): Promise<{
        message: string;
    }>;
    obtenerPromedioCotizacionesPorDia(): Promise<{
        codigoIndice: string;
        fecha: string;
        promedio: number;
    }[]>;
    obtenerCotizacionesUltimoMesPorIndices(): Promise<any[]>;
    obtenerPromedioTotalSinTSE(): Promise<any[]>;
    obtenerPromedioTotalPorIndice(): Promise<any[]>;
    obtenerCotizacionesUltimoMes(): Promise<any[]>;
    obtenerPromedioMensual(): Promise<any[]>;
}
