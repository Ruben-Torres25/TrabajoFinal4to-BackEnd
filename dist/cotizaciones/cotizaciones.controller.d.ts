export declare class CotizacionesController {
    private readonly cotizacionesService;
    constructor(cotizacionesService: any);
    create(createCotizacioneDto: any): any;
    findAll(): any;
    findOne(id: string): any;
    update(id: string, updateCotizacioneDto: any): any;
    remove(id: string): any;
}
