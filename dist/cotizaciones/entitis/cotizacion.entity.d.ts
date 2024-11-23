import { Empresa } from 'src/empresa/entities/empresa.entity';
export declare class Cotizacion {
    id: number;
    fecha: string;
    hora: string;
    dateUTC: string;
    cotization: number;
    empresa: Empresa;
    constructor();
}
