export declare class Empresa {
    id: number;
    codempresa: string;
    empresaNombre: string;
    cotizationInicial: number;
    cantidadAcciones: number;
    constructor(codempresa: string, empresaNombre: string);
    getId(): number;
    getCodempresa(): string;
    setCodempresa(codempresa: string): void;
    getEmpresaNombre(): string;
    setEmpresaNombre(empresaNombre: string): void;
    getCotizacionInicial(): number;
    getCantidadAcciones(): number;
}
