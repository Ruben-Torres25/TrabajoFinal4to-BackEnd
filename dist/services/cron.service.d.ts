import { CotizacionService } from 'src/cotizaciones/cotizaciones.service';
import { CotizacionIndiceService } from 'src/indice-cotizaciones/indice-cotizaciones.service';
import { IndiceService } from 'src/indice/indice.service';
export declare class CotizacionCronService {
    private readonly cotizacionService;
    private readonly cotizacionIndiceService;
    private readonly indiceService;
    constructor(cotizacionService: CotizacionService, cotizacionIndiceService: CotizacionIndiceService, indiceService: IndiceService);
    handleCronObtenerCotizacionesEmpresas(): Promise<void>;
    handleCronObtenerIndices(): Promise<void>;
    handleCronCalcularMiIndiceYGuardarloEnDB(): Promise<void>;
    handleCronPublicarIndice(): Promise<void>;
    handleCronObtenerIndicesDeLosDemas(): Promise<void>;
}
