import { Indice } from "src/indice/entities/indice.entity";
export declare class CotizacionIndice {
    id: number;
    fecha: string;
    hora: string;
    valorCotizacionIndice: number;
    codIndice: string;
    codigoIndice: Indice;
    constructor(fecha: string, hora: string, valorCotizacionIndice: number, codigoIndice?: Indice);
}
