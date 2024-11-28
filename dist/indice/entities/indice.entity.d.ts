import { CotizacionIndice } from 'src/indice-cotizaciones/entities/indice-cotizacione.entity';
export declare class Indice {
    id: string;
    codIndice: string;
    nombreIndice: string;
    valor: number;
    cotizaciones: CotizacionIndice[];
}
