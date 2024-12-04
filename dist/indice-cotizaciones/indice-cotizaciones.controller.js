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
const indice_service_1 = require("../indice/indice.service");
let CotizacionIndiceController = class CotizacionIndiceController {
    constructor(cotizacionIndiceService, indiceService) {
        this.cotizacionIndiceService = cotizacionIndiceService;
        this.indiceService = indiceService;
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
            const result = await this.cotizacionIndiceService.verificarYPublicarCotizacionesIBOV();
            return result;
        }
        catch (error) {
            throw new common_1.HttpException('Error al publicar las cotizaciones', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerCotizacionesIBOV() {
        return await this.cotizacionIndiceService.obtenerCotizacionesIBOV();
    }
    async obtenerCotizacionesPorIndices() {
        try {
            const cotizaciones = await this.cotizacionIndiceService.obtenerCotizacionesPorIndices();
            return cotizaciones;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener cotizaciones por índices', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async guardarCotizacionesManualmente() {
        try {
            await this.cotizacionIndiceService.obtenerYGuardarCotizacionesPorIndices();
            return { message: 'Cotizaciones obtenidas y guardadas exitosamente.' };
        }
        catch (error) {
            throw new common_1.HttpException('Error al guardar las cotizaciones manualmente: ' + error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerPromedioCotizacionesPorDia() {
        try {
            const promedios = await this.cotizacionIndiceService.obtenerPromedioCotizacionesPorDiaDeTodosLosIndices();
            return promedios;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener los promedios de cotizaciones por día', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerCotizacionesUltimoMesPorIndices() {
        return await this.cotizacionIndiceService.obtenerCotizacionesUltimoMesPorIndices();
    }
    async obtenerPromedioTotalSinTSE() {
        try {
            const promedios = await this.cotizacionIndiceService.calcularPromedioTotalPorIndiceSinTSE();
            return promedios;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener el promedio total sin TSE', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerPromedioTotalPorIndice() {
        return await this.cotizacionIndiceService.calcularPromedioTotalPorIndice();
    }
    async obtenerCotizacionesUltimoMes() {
        try {
            const cotizacionesUltimoMes = await this.cotizacionIndiceService.obtenerCotizacionesUltimoMes();
            return cotizacionesUltimoMes;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener las cotizaciones del último mes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerPromedioMensual() {
        try {
            const promediosMensuales = await this.cotizacionIndiceService.obtenerPromedioMensualCotizacionesIndices();
            return promediosMensuales;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener el promedio mensual de cotizaciones de índices', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
    (0, common_1.Get)('calcular-promedios'),
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
    (0, common_1.Get)('por-indices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionIndiceController.prototype, "obtenerCotizacionesPorIndices", null);
__decorate([
    (0, common_1.Post)('guardar-manualmente'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionIndiceController.prototype, "guardarCotizacionesManualmente", null);
__decorate([
    (0, common_1.Get)('promedio-por-dia'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionIndiceController.prototype, "obtenerPromedioCotizacionesPorDia", null);
__decorate([
    (0, common_1.Get)('ultimo-mes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionIndiceController.prototype, "obtenerCotizacionesUltimoMesPorIndices", null);
__decorate([
    (0, common_1.Get)('promedio-total-sin-tse'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionIndiceController.prototype, "obtenerPromedioTotalSinTSE", null);
__decorate([
    (0, common_1.Get)('promedio-total-por-indice'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionIndiceController.prototype, "obtenerPromedioTotalPorIndice", null);
__decorate([
    (0, common_1.Get)('ultimo-mes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionIndiceController.prototype, "obtenerCotizacionesUltimoMes", null);
__decorate([
    (0, common_1.Get)('promedio-mensual'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionIndiceController.prototype, "obtenerPromedioMensual", null);
exports.CotizacionIndiceController = CotizacionIndiceController = __decorate([
    (0, common_1.Controller)('IndiceCotizaciones'),
    __metadata("design:paramtypes", [indice_cotizaciones_service_1.CotizacionIndiceService,
        indice_service_1.IndiceService])
], CotizacionIndiceController);
//# sourceMappingURL=indice-cotizaciones.controller.js.map