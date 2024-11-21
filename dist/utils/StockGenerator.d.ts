import { Cotizacion } from 'src/empresa/entities/cotizacion.entity';
export declare class StockGenerator {
    history: Cotizacion[];
    currentPrice: number;
    stabilityFactor: number;
    constructor({ history, estabilidad, }: {
        history: Cotizacion[];
        estabilidad: number;
    });
    generateNextStockPrice(): number;
    tendency(): 1 | -1;
}
