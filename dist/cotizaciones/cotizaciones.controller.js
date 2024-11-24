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
let CotizacionController = class CotizacionController {
    constructor(cotizacionService) {
        this.cotizacionService = cotizacionService;
    }
    async obtenerCotizacion(codigoEmpresa, fecha, hora) {
        return this.cotizacionService.obtenerCotizacion(codigoEmpresa, fecha, hora);
    }
    async obtenerCotizacionesRango(codempresa, fechaDesde, fechaHasta) {
        return this.cotizacionService.obtenerCotizaciones(codempresa, fechaDesde, fechaHasta);
    }
};
exports.CotizacionController = CotizacionController;
__decorate([
    (0, common_1.Get)(':codigoEmpresa/cotizacion'),
    __param(0, (0, common_1.Param)('codigoEmpresa')),
    __param(1, (0, common_1.Query)('fecha')),
    __param(2, (0, common_1.Query)('hora')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], CotizacionController.prototype, "obtenerCotizacion", null);
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
    (0, common_1.Controller)('empresas'),
    __metadata("design:paramtypes", [cotizaciones_service_1.CotizacionService])
], CotizacionController);
//# sourceMappingURL=cotizaciones.controller.js.map