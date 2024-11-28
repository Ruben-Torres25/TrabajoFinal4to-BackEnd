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
var CotizacionIndiceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CotizacionIndiceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cotizacion_entity_1 = require("../cotizaciones/entitis/cotizacion.entity");
const indice_cotizacione_entity_1 = require("./entities/indice-cotizacione.entity");
const axios_1 = require("axios");
const indice_entity_1 = require("../indice/entities/indice.entity");
const moment = require("moment-timezone");
let CotizacionIndiceService = CotizacionIndiceService_1 = class CotizacionIndiceService {
    constructor(cotizacionRepository, cotizacionIndiceRepository, indiceRepository) {
        this.cotizacionRepository = cotizacionRepository;
        this.cotizacionIndiceRepository = cotizacionIndiceRepository;
        this.indiceRepository = indiceRepository;
        this.logger = new common_1.Logger(CotizacionIndiceService_1.name);
        this.apiUrl = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/cotizaciones';
        this.apiUrlIBOV = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/IBOV/cotizaciones';
    }
    calcularSumaYConteo(cotizaciones) {
        return cotizaciones.reduce((acc, cotizacion) => {
            const cotizationValue = parseFloat(cotizacion.cotization.toString());
            if (!isNaN(cotizationValue) && cotizationValue >= 0) {
                acc.suma += cotizationValue;
                acc.conteo += 1;
            }
            else {
                this.logger.warn(`Valor de cotization no válido: ${cotizacion.cotization}`);
            }
            return acc;
        }, { suma: 0, conteo: 0 });
    }
    async obtenerCotizacionesAgrupadas() {
        try {
            const cotizaciones = await this.cotizacionRepository.find();
            const agrupadas = cotizaciones.reduce((acc, cotizacion) => {
                const fecha = new Date(cotizacion.fecha).toISOString().substring(0, 10);
                const hora = cotizacion.hora;
                if (!acc[fecha]) {
                    acc[fecha] = {};
                }
                if (!acc[fecha][hora]) {
                    acc[fecha][hora] = [];
                }
                acc[fecha][hora].push(cotizacion);
                return acc;
            }, {});
            return agrupadas;
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener las cotizaciones agrupadas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async calcularYGuardarPromedios() {
        try {
            const cotizacionesAgrupadas = await this.obtenerCotizacionesAgrupadas();
            for (const fecha in cotizacionesAgrupadas) {
                for (const hora in cotizacionesAgrupadas[fecha]) {
                    const { suma, conteo } = this.calcularSumaYConteo(cotizacionesAgrupadas[fecha][hora]);
                    if (conteo === 0) {
                        continue;
                    }
                    const promedio = suma / conteo;
                    const indiceIBOV = await this.indiceRepository.findOne({ where: { codIndice: 'IBOV' } });
                    if (!indiceIBOV) {
                        console.warn(`El índice IBOV no se encontró en la base de datos.`);
                        continue;
                    }
                    const cotizacionExistente = await this.cotizacionIndiceRepository.findOne({
                        where: {
                            fecha: fecha,
                            hora: hora,
                            codigoIndice: { codIndice: 'IBOV' }
                        }
                    });
                    if (!cotizacionExistente) {
                        const cotizacionIndice = this.cotizacionIndiceRepository.create({
                            fecha,
                            hora,
                            valorCotizacionIndice: parseFloat(promedio.toFixed(2)),
                            codigoIndice: indiceIBOV,
                        });
                        await this.cotizacionIndiceRepository.save(cotizacionIndice);
                        console.log(`Promedio ${promedio} guardado para la fecha ${fecha} y hora ${hora}`);
                    }
                    else {
                        console.warn(`Cotización promedio ya existe para la fecha ${fecha} y hora ${hora}. No se guardará un nuevo promedio.`);
                    }
                }
            }
        }
        catch (error) {
            console.error(`Error al calcular y guardar promedios: ${error.message}`);
        }
    }
    async publicarIndiceEnGempresa(fecha, hora, codigoIndice, indice) {
        const data = {
            fecha,
            hora,
            codigoIndice,
            valorIndice: indice,
        };
        const url = "http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/cotizaciones";
        try {
            const response = await axios_1.default.post(url, data);
            this.logger.log(`Índice ${codigoIndice} publicado en Gempresa`);
            return response.data;
        }
        catch (error) {
            this.logger.error(`Error al publicar el índice ${codigoIndice} en Gempresa: ${error.message}`);
        }
    }
    async publicarTodasLasCotizaciones() {
        const cotizaciones = await this.cotizacionIndiceRepository.find();
        if (cotizaciones.length === 0) {
            return { message: 'No hay cotizaciones para publicar' };
        }
        try {
            for (const cotizacion of cotizaciones) {
                if (!cotizacion.codIndice) {
                    this.logger.warn(`Cotización sin índice encontrado: ${JSON.stringify(cotizacion)}`);
                    continue;
                }
                const yaPublicada = await this.verificarCotizacionEnGempresa(cotizacion.fecha, cotizacion.hora, cotizacion.codIndice);
                if (yaPublicada) {
                    this.logger.warn(`Cotización ya publicada para la empresa ${cotizacion.codIndice} en la fecha ${cotizacion.fecha} a las ${cotizacion.hora}`);
                    continue;
                }
                const data = {
                    fecha: cotizacion.fecha,
                    hora: cotizacion.hora,
                    codigoIndice: cotizacion.codIndice,
                    valorIndice: cotizacion.valorCotizacionIndice,
                };
                try {
                    const response = await axios_1.default.post(this.apiUrl, data);
                    this.logger.log('Cotización publicada exitosamente:', response.data);
                }
                catch (error) {
                    this.logger.error(`Error al publicar cotización: ${error.message}`);
                }
            }
            return { message: 'Todas las cotizaciones han sido procesadas para publicación' };
        }
        catch (error) {
            this.logger.error(`Error al procesar las cotizaciones: ${error.message}`);
        }
    }
    async verificarCotizacionEnGempresa(fecha, hora, codIndice) {
        const url = `http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/cotizaciones/${codIndice}?fecha=${fecha}&hora=${hora}`;
        try {
            const response = await axios_1.default.get(url);
            return response.data.length > 0;
        }
        catch (error) {
            this.logger.error(`Error al verificar el índice ${codIndice} en Gempresa: ${error.message}`);
            return false;
        }
    }
    async verificarIndiceExistente(codigoIndice) {
        const indice = await this.indiceRepository.findOne({ where: { codIndice: codigoIndice } });
        return !!indice;
    }
    async obtenerCotizacionesIBOV() {
        try {
            const fechaDesde = '2024-01-01';
            const fechaHasta = moment().format('YYYY-MM-DD');
            const response = await axios_1.default.get(this.apiUrlIBOV, {
                params: {
                    fechaDesde: `${fechaDesde}T00:00`,
                    fechaHasta: `${fechaHasta}T23:59`,
                },
            });
            const cotizaciones = response.data;
            return cotizaciones;
        }
        catch (error) {
            console.error('Error al obtener cotizaciones:', error.response ? error.response.data : error.message);
            throw new common_1.HttpException('Error al obtener las cotizaciones del índice IBOV', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verificarYPublicarCotizacionesIBOV() {
        try {
            const cotizacionesExistentes = await this.cotizacionIndiceRepository.find();
            console.log('EXISTENTES', cotizacionesExistentes);
            const cotizacionesIBOV = await this.obtenerCotizacionesIBOV();
            console.log('IBOV COTIZACIOENS', cotizacionesIBOV);
            const cotizacionesIBOVSet = new Set(cotizacionesIBOV.map(cotizacion => `${cotizacion.fecha}-${cotizacion.hora}`));
            const cotizacionesAFaltar = [];
            for (const cotizacion of cotizacionesExistentes) {
                const fecha = cotizacion.fecha;
                const hora = cotizacion.hora;
                const key = `${fecha}-${hora}`;
                if (!cotizacionesIBOVSet.has(key)) {
                    cotizacionesAFaltar.push({
                        fecha,
                        hora,
                        codigoIndice: cotizacion.codIndice,
                        valorIndice: cotizacion.valorCotizacionIndice,
                    });
                }
            }
            for (const cotizacion of cotizacionesAFaltar) {
                await this.publicarIndiceEnGempresa(cotizacion.fecha, cotizacion.hora, cotizacion.codigoIndice, cotizacion.valorIndice);
                console.log(`Cotización publicada para la fecha ${cotizacion.fecha} a las ${cotizacion.hora}`);
            }
        }
        catch (error) {
            console.error(`Error al verificar y publicar cotizaciones IBOV: ${error.message}`);
            throw new common_1.HttpException('Error al verificar y publicar cotizaciones IBOV', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CotizacionIndiceService = CotizacionIndiceService;
exports.CotizacionIndiceService = CotizacionIndiceService = CotizacionIndiceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cotizacion_entity_1.Cotizacion)),
    __param(1, (0, typeorm_1.InjectRepository)(indice_cotizacione_entity_1.CotizacionIndice)),
    __param(2, (0, typeorm_1.InjectRepository)(indice_entity_1.Indice)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CotizacionIndiceService);
//# sourceMappingURL=indice-cotizaciones.service.js.map