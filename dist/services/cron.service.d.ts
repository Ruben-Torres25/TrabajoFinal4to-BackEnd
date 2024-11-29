import { CotizacionService } from 'src/cotizaciones/cotizaciones.service';
import { CotizacionIndiceService } from 'src/indice-cotizaciones/indice-cotizaciones.service';
export declare class CotizacionCronService {
    private readonly cotizacionService;
    private readonly cotizacionIndiceService;
    constructor(cotizacionService: CotizacionService, cotizacionIndiceService: CotizacionIndiceService);
    handleCronObtenerCotizacionesDesdeInicioDelAno(): Promise<void>;
    ejecutarObtenerCotizacionesDesdeInicioDelAno(): Promise<void>;
    ejecutarAhora(): Promise<void>;
    handleCronVerificarYPublicarCotizacionesIBOV(): Promise<void>;
}
