"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CotizacionIndiceController = void 0;
const common_1 = require("@nestjs/common");
const indice_cotizaciones_service_1 = require("./indice-cotizaciones.service");
let CotizacionIndiceController = class CotizacionIndiceController {
    constructor(cotizacionIndiceService) {
        this.cotizacionIndiceService = cotizacionIndiceService;
    }
    async obtenerCotizacionesAgrupadas() {
        return this.cotizacionIndiceService.obtenerCotizacionesAgrupadas();
    }
    async calcularPromedios() {
        try {
            await this.cotizacionIndiceService.calcularYGuardarPromedios();
            return { message: 'Promedios calculados y guardados exitosamente.' };
        }
        catch (error) {
            throw new common_1.HttpException('Error al calcular y guardar promedios', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async publicarTodas() {
        try {
            const result = await this.cotizacionIndiceService.publicarTodasLasCotizaciones();
            return result;
        }
        catch (error) {
            throw new common_1.HttpException('Error al publicar las cotizaciones', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerCotizacionesIBOV() {
        return await this.cotizacionIndiceService.obtenerCotizacionesIBOV();
    }
    async verificarYPublicarCotizacionesIBOV() {
        try {
            await this.cotizacionIndiceService.verificarYPublicarCotizacionesIBOV();
            return { message: 'Verificación y publicación de cotizaciones IBOV completadas exitosamente.' };
        }
        catch (error) {
            throw new common_1.HttpException('Error al verificar y publicar cotizaciones IBOV', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CotizacionIndiceController = CotizacionIndiceController;
__decorate([
    (0, common_1.Get)('agrupadas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionIndiceController.prototype, "obtenerCotizacionesAgrupadas", null);
__decorate([
    (0, common_1.Post)('calcular-promedios'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionIndiceController.prototype, "calcularPromedios", null);
__decorate([
    (0, common_1.Post)('publicar-todas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionIndiceController.prototype, "publicarTodas", null);
__decorate([
    (0, common_1.Get)('ibov'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionIndiceController.prototype, "obtenerCotizacionesIBOV", null);
__decorate([
    (0, common_1.Post)('verificar-publicar-ibov'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionIndiceController.prototype, "verificarYPublicarCotizacionesIBOV", null);
exports.CotizacionIndiceController = CotizacionIndiceController = __decorate([
    (0, common_1.Controller)('cotizaciones'),
    __metadata("design:paramtypes", [indice_cotizaciones_service_1.CotizacionIndiceService])
], CotizacionIndiceController);
//# sourceMappingURL=indice-cotizaciones.controller.js.map