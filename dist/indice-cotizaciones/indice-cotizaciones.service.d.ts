import { Repository } from 'typeorm';
import { Cotizacion } from 'src/cotizaciones/entitis/cotizacion.entity';
import { CotizacionIndice } from './entities/indice-cotizacione.entity';
import { Indice } from 'src/indice/entities/indice.entity';
export declare class CotizacionIndiceService {
    private readonly cotizacionRepository;
    private readonly cotizacionIndiceRepository;
    private readonly indiceRepository;
    private readonly logger;
    private readonly apiUrl;
    private readonly apiUrlIBOV;
    constructor(cotizacionRepository: Repository<Cotizacion>, cotizacionIndiceRepository: Repository<CotizacionIndice>, indiceRepository: Repository<Indice>);
    private calcularSumaYConteo;
    obtenerCotizacionesAgrupadas(): Promise<any>;
    calcularYGuardarPromedios(): Promise<void>;
    publicarIndiceEnGempresa(fecha: string, hora: string, codigoIndice: string, indice: number): Promise<any>;
    publicarTodasLasCotizaciones(): Promise<any>;
    verificarCotizacionEnGempresa(fecha: string, hora: string, codIndice: string): Promise<boolean>;
    verificarIndiceExistente(codigoIndice: string): Promise<boolean>;
    obtenerCotizacionesIBOV(): Promise<any>;
    verificarYPublicarCotizacionesIBOV(): Promise<void>;
}
