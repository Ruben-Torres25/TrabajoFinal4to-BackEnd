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
exports.CotizacionCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const cotizaciones_service_1 = require("../cotizaciones/cotizaciones.service");
const indice_cotizaciones_service_1 = require("../indice-cotizaciones/indice-cotizaciones.service");
let CotizacionCronService = class CotizacionCronService {
    constructor(cotizacionService, cotizacionIndiceService) {
        this.cotizacionService = cotizacionService;
        this.cotizacionIndiceService = cotizacionIndiceService;
    }
    async handleCronObtenerCotizacionesDesdeInicioDelAno() {
        await this.ejecutarObtenerCotizacionesDesdeInicioDelAno();
    }
    async ejecutarObtenerCotizacionesDesdeInicioDelAno() {
        try {
            console.log('Ejecutando cron para obtener cotizaciones desde el inicio del año:', new Date().toISOString());
            await this.cotizacionService.obtenerCotizacionesDesdeInicioDelAno();
            console.log('Cotizaciones desde el inicio del año han sido obtenidas correctamente.');
        }
        catch (error) {
            console.error('Error al obtener cotizaciones desde el inicio del año:', error);
        }
    }
    async ejecutarAhora() {
        await this.ejecutarObtenerCotizacionesDesdeInicioDelAno();
    }
    async handleCronVerificarYPublicarCotizacionesIBOV() {
        await this.cotizacionIndiceService.verificarYPublicarCotizacionesIBOV();
    }
};
exports.CotizacionCronService = CotizacionCronService;
__decorate([
    (0, schedule_1.Cron)('0 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionCronService.prototype, "handleCronObtenerCotizacionesDesdeInicioDelAno", null);
__decorate([
    (0, schedule_1.Cron)('5 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CotizacionCronService.prototype, "handleCronVerificarYPublicarCotizacionesIBOV", null);
exports.CotizacionCronService = CotizacionCronService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cotizaciones_service_1.CotizacionService,
        indice_cotizaciones_service_1.CotizacionIndiceService])
], CotizacionCronService);
//# sourceMappingURL=cron.service.js.map