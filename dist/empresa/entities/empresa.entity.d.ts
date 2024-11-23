export declare class Empresa {
    id: number;
    codempresa: string;
    empresaNombre: string;
    cotizationInicial: number;
    cantidadAcciones: number;
    constructor(partial?: Partial<Empresa>);
    getId(): number;
    getCodempresa(): string;
    setCodempresa(codempresa: string): void;
    getEmpresaNombre(): string;
    setEmpresaNombre(empresaNombre: string): void;
    getCotizacionInicial(): number;
    setCotizacionInicial(cotizationInicial: number): void;
    getCantidadAcciones(): number;
    setCantidadAcciones(cantidadAcciones: number): void;
}
