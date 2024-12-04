import { Repository } from 'typeorm';
import { Cotizacion } from 'src/cotizaciones/entitis/cotizacion.entity';
import { CotizacionIndice } from './entities/indice-cotizacione.entity';
import { Indice } from 'src/indice/entities/indice.entity';
import { IndiceService } from 'src/indice/indice.service';
export declare class CotizacionIndiceService {
    private readonly cotizacionRepository;
    private readonly cotizacionIndiceRepository;
    private readonly indiceRepository;
    private readonly indiceService;
    [x: string]: any;
    private readonly logger;
    private readonly apiUrl;
    private readonly apiUrlIBOV;
    constructor(cotizacionRepository: Repository<Cotizacion>, cotizacionIndiceRepository: Repository<CotizacionIndice>, indiceRepository: Repository<Indice>, indiceService: IndiceService);
    obtenerCotizacionesPorIndices(): Promise<any[]>;
    guardarCotizaciones(indicesCotizaciones: any[]): Promise<void>;
    obtenerYGuardarCotizacionesPorIndices(): Promise<void>;
    private calcularSumaYConteo;
    obtenerCotizacionesAgrupadas(): Promise<any>;
    calcularYGuardarPromedios(): Promise<void>;
    verificarCotizacionEnGempresa(fecha: string, hora: string, codIndice: string): Promise<boolean>;
    publicarTodasLasCotizaciones(): Promise<any>;
    obtenerCotizacionesIBOV(): Promise<any>;
    publicarIndiceEnGempresa(fecha: string, hora: string, codigoIndice: string, indice: number): Promise<any>;
    verificarYPublicarCotizacionesIBOV(): Promise<void>;
    obtenerPromedioCotizacionesPorDiaDeTodosLosIndices(): Promise<{
        codigoIndice: string;
        fecha: string;
        promedio: number;
    }[]>;
    calcularPromedioTotalPorIndiceSinTSE(): Promise<any[]>;
    calcularPromedioTotalPorIndice(): Promise<any[]>;
    obtenerCotizacionesUltimoMesPorIndices(): Promise<any[]>;
    obtenerPromedioMensualCotizacionesIndices(): Promise<any[]>;
    obtenerCotizacionesUltimoMes(): Promise<any[]>;
}
