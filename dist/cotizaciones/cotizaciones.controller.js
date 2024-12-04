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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CotizacionController = void 0;
const common_1 = require("@nestjs/common");
const cotizaciones_service_1 = require("./cotizaciones.service");
const cron_service_1 = require("../services/cron.service");
let CotizacionController = class CotizacionController {
    constructor(cotizacionService, cotizacionCronService) {
        this.cotizacionService = cotizacionService;
        this.cotizacionCronService = cotizacionCronService;
    }
    async obtenerPromedioCotizacionesUltimoMes() {
        try {
            const promedios = await this.cotizacionService.obtenerPromedioCotizacionesUltimoMesAgrupadosPorEmpresa();
            return promedios;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener los promedios del último mes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerPromedioTotalPorEmpresa() {
        try {
            const promediosTotales = await this.cotizacionService.obtenerPromedioTotalPorEmpresa();
            return promediosTotales;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener el promedio total por empresa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerPromedioCotizacionesPorDiaDeTodasLasEmpresas() {
        try {
            const promedios = await this.cotizacionService.obtenerPromedioCotizacionesPorDiaDeTodasLasEmpresas();
            return promedios;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener los promedios de cotizaciones de todas las empresas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerUltimosTresDiasCotizaciones(codempresa) {
        try {
            return await this.cotizacionService.obtenerUltimosTresDiasCotizaciones(codempresa);
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerPromedioCotizacionesPorDia(codempresa) {
        try {
            const promedios = await this.cotizacionService.obtenerPromedioCotizacionesPorDia(codempresa);
            return promedios;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerCotizacionesPorEmpresa(codempresa) {
        return await this.cotizacionService.obtenerCotizacionesPorEmpresa(codempresa);
    }
    async obtenerCotizacionEmpresa(codigoEmpresa, fecha, hora) {
        return this.cotizacionService.obtenerCotizacionEmpresa(codigoEmpresa, fecha, hora);
    }
    async obtenerCotizacionesDesdeInicioDelAno() {
        try {
            await this.cotizacionService.obtenerCotizacionesDesdeInicioDelAno();
            return { message: 'Cotizaciones obtenidas y guardadas exitosamente.' };
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener las cotizaciones desde el inicio del año', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerCotizacionesRango(codempresa, fechaDesde, fechaHasta) {
        return this.cotizacionService.obtenerCotizacionesRango(codempresa, fechaDesde, fechaHasta);
    }
};
exports.CotizacionController = CotizacionController;
__decorate([
    (0, common_1.Get)('promedio-ultimo-mes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionController.prototype, "obtenerPromedioCotizacionesUltimoMes", null);
__decorate([
    (0, common_1.Get)('total-por-empresa'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionController.prototype, "obtenerPromedioTotalPorEmpresa", null);
__decorate([
    (0, common_1.Get)('promedio-todas-las-empresas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionController.prototype, "obtenerPromedioCotizacionesPorDiaDeTodasLasEmpresas", null);
__decorate([
    (0, common_1.Get)(':codempresa/ultimos-tres-dias'),
    __param(0, (0, common_1.Param)('codempresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CotizacionController.prototype, "obtenerUltimosTresDiasCotizaciones", null);
__decorate([
    (0, common_1.Get)(':codempresa/promedio-cotizacion'),
    __param(0, (0, common_1.Param)('codempresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CotizacionController.prototype, "obtenerPromedioCotizacionesPorDia", null);
__decorate([
    (0, common_1.Get)(':codempresa/cotizaciones'),
    __param(0, (0, common_1.Param)('codempresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CotizacionController.prototype, "obtenerCotizacionesPorEmpresa", null);
__decorate([
    (0, common_1.Get)(':codigoEmpresa/cotizacion'),
    __param(0, (0, common_1.Param)('codigoEmpresa')),
    __param(1, (0, common_1.Query)('fecha')),
    __param(2, (0, common_1.Query)('hora')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CotizacionController.prototype, "obtenerCotizacionEmpresa", null);
__decorate([
    (0, common_1.Get)('desde-inicio-del-ano'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionController.prototype, "obtenerCotizacionesDesdeInicioDelAno", null);
__decorate([
    (0, common_1.Get)(':codempresa/rango'),
    __param(0, (0, common_1.Param)('codempresa')),
    __param(1, (0, common_1.Query)('fechaDesde')),
    __param(2, (0, common_1.Query)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CotizacionController.prototype, "obtenerCotizacionesRango", null);
exports.CotizacionController = CotizacionController = __decorate([
    (0, common_1.Controller)('cotizaciones'),
    __metadata("design:paramtypes", [cotizaciones_service_1.CotizacionService,
        cron_service_1.CotizacionCronService])
], CotizacionController);
//# sourceMappingURL=cotizaciones.controller.js.map