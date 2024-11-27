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
const moment = require("moment-timezone");
const empresa_entity_1 = require("../empresa/entities/empresa.entity");
const DateUtils_1 = require("../utils/DateUtils");
let CotizacionService = class CotizacionService {
    constructor(cotizacionRepository, empresaRepository) {
        this.cotizacionRepository = cotizacionRepository;
        this.empresaRepository = empresaRepository;
        this.apiUrl = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/';
        this.brazilTimezone = 'America/Sao_Paulo';
    }
    async obtenerTodasLasCotizaciones() {
        try {
            const empresas = await this.empresaRepository.find();
            const { fecha, hora } = DateUtils_1.default.getFechaHoraActual();
            const promises = empresas.map(empresa => this.obtenerCotizacionEmpresa(empresa.codempresa, fecha, hora));
            const cotizaciones = await Promise.all(promises);
            return cotizaciones;
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener las cotizaciones de todas las empresas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerCotizacionEmpresa(codigoEmpresa, fecha, hora) {
        try {
            const cotizacionExistente = await this.cotizacionRepository.findOne({
                where: {
                    empresa: { codempresa: codigoEmpresa },
                    fecha: moment(fecha).toDate(),
                    hora: hora,
                },
            });
            if (cotizacionExistente) {
                throw new common_1.HttpException('La empresa ya existe en tu base de datos', common_1.HttpStatus.CONFLICT);
            }
            const response = await axios_1.default.get(`${this.apiUrl}empresas/${codigoEmpresa}/cotizacion`, {
                params: { fecha, hora },
            });
            const cotizacionIndividual = response.data;
            const fechaLocal = moment(cotizacionIndividual.fecha).tz(this.brazilTimezone).format('YYYY-MM-DD');
            const horaLocal = moment(cotizacionIndividual.hora, 'HH:mm').tz(this.brazilTimezone).format('HH:mm');
            const empresa = await this.empresaRepository.findOne({ where: { codempresa: codigoEmpresa } });
            if (!empresa) {
                throw new common_1.HttpException('Empresa no encontrada', common_1.HttpStatus.NOT_FOUND);
            }
            const guardado = this.cotizacionRepository.create({
                fecha: new Date(fechaLocal),
                hora: horaLocal,
                cotization: parseFloat(parseFloat(cotizacionIndividual.cotization).toFixed(2)),
                empresa: empresa,
            });
            await this.cotizacionRepository.save(guardado);
            return response.data;
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener la cotización', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerCotizacionesRango(codempresa, fechaDesde, fechaHasta) {
        try {
            const response = await axios_1.default.get(`${this.apiUrl}empresas/${codempresa}/cotizaciones?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
            return response.data;
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener las cotizaciones', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerCotizacionesDesdeInicioDelAno() {
        try {
            const fechaInicio = moment().startOf('year').toDate();
            const fechaActual = new Date();
            const empresas = await this.empresaRepository.find();
            for (const empresa of empresas) {
                const ultimaCotizacion = await this.cotizacionRepository.findOne({
                    where: { empresa: { id: empresa.id } },
                    order: { fecha: 'DESC' },
                });
                const fechaUltimaGuardada = ultimaCotizacion ? ultimaCotizacion.fecha : fechaInicio;
                for (let fecha = moment(fechaUltimaGuardada).add(1, 'days'); fecha.isBefore(fechaActual); fecha.add(1, 'days')) {
                    const fechaStr = fecha.format('YYYY-MM-DD');
                    for (let hora = 9; hora <= 15; hora++) {
                        const horaStr = hora.toString().padStart(2, '0') + ':00';
                        try {
                            const cotizacion = await axios_1.default.get(`${this.apiUrl}empresas/${empresa.codempresa}/cotizacion`, {
                                params: { fecha: fechaStr, hora: horaStr },
                            });
                            const cotizacionExistente = await this.cotizacionRepository.findOne({
                                where: {
                                    empresa: { id: empresa.id },
                                    fecha: moment(fechaStr).tz(this.brazilTimezone).toDate(),
                                    hora: horaStr,
                                },
                            });
                            if (!cotizacionExistente) {
                                const guardado = this.cotizacionRepository.create({
                                    fecha: moment(cotizacion.data.fecha).tz(this.brazilTimezone).toDate(),
                                    hora: cotizacion.data.hora,
                                    cotization: parseFloat(cotizacion.data.cotization),
                                    empresa: empresa,
                                });
                                await this.cotizacionRepository.save(guardado);
                                console.log(`Cotización guardada para la empresa ${empresa.codempresa} en la fecha ${fechaStr} a las ${horaStr}`);
                            }
                            else {
                                console.log(`Cotización ya existe para la empresa ${empresa.codempresa} en la fecha ${fechaStr} a las ${horaStr}`);
                            }
                        }
                        catch (error) {
                            console.error(`Error al obtener cotización para la empresa ${empresa.codempresa} en la fecha ${fechaStr} a las ${horaStr}:`, error);
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error('Error al obtener cotizaciones desde el inicio del año:', error);
            throw new common_1.HttpException('Error al obtener las cotizaciones', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CotizacionService = CotizacionService;
exports.CotizacionService = CotizacionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cotizacion_entity_1.Cotizacion)),
    __param(1, (0, typeorm_1.InjectRepository)(empresa_entity_1.Empresa)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CotizacionService);
//# sourceMappingURL=cotizaciones.service.js.map