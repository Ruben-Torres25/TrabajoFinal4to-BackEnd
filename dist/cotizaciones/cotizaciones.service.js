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
exports.CotizacionService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const cotizacion_entity_1 = require("./entitis/cotizacion.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let CotizacionService = class CotizacionService {
    constructor(cotizacionRepository) {
        this.cotizacionRepository = cotizacionRepository;
        this.apiUrl = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/';
    }
    async obtenerCotizacion(codigoEmpresa, fecha, hora) {
        try {
            const response = await axios_1.default.get(`${this.apiUrl}empresas/${codigoEmpresa}/cotizacion`, {
                params: { fecha, hora },
            });
            const cotizacionIndividual = response.data;
            const guardado = this.cotizacionRepository.create({
                fecha: cotizacionIndividual.fecha,
                hora: cotizacionIndividual.hora,
                dateUTC: cotizacionIndividual.dateUTC,
                cotization: cotizacionIndividual.cotizacion,
                codempresa: cotizacionIndividual.codempresa,
            });
            await this.cotizacionRepository.save(guardado);
            return response.data;
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener la cotización', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerCotizaciones(codempresa, fechaDesde, fechaHasta) {
        try {
            const response = await axios_1.default.get(`${this.apiUrl}empresas/${codempresa}/cotizaciones?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
            return response.data;
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener las cotizaciones', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CotizacionService = CotizacionService;
exports.CotizacionService = CotizacionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cotizacion_entity_1.Cotizacion)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CotizacionService);
//# sourceMappingURL=cotizaciones.service.js.map