import { Empresa } from 'src/empresa/entities/empresa.entity';
export declare class Cotizacion {
    id: number;
    fecha: Date;
    hora: string;
    cotization: number;
    empresa: Empresa;
}
