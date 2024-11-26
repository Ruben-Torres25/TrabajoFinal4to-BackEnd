import { CotizacionService } from 'src/cotizaciones/cotizaciones.service';
export declare class CotizacionCronService {
    private readonly cotizacionService;
    constructor(cotizacionService: CotizacionService);
    handleCronObtenerCotizacionesDesdeInicioDelAno(): Promise<void>;
    ejecutarObtenerCotizacionesDesdeInicioDelAno(): Promise<void>;
    ejecutarAhora(): Promise<void>;
}
