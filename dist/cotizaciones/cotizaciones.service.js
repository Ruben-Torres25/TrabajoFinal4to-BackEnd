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
    async obtenerPromedioTotalPorEmpresa() {
        try {
            const promediosPorDia = await this.obtenerPromedioCotizacionesPorDiaDeTodasLasEmpresas();
            const promediosTotales = {};
            for (const promedio of promediosPorDia) {
                const { codempresa, empresaNombre, promedio: valorPromedio } = promedio;
                if (!promediosTotales[codempresa]) {
                    promediosTotales[codempresa] = { suma: 0, conteo: 0, empresaNombre };
                }
                promediosTotales[codempresa].suma += valorPromedio;
                promediosTotales[codempresa].conteo += 1;
            }
            const resultados = Object.keys(promediosTotales).map(codempresa => {
                const { suma, conteo, empresaNombre } = promediosTotales[codempresa];
                const promedioTotal = suma / conteo;
                return { codempresa, empresaNombre, promedioTotal: parseFloat(promedioTotal.toFixed(2)) };
            });
            return resultados;
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener el promedio total por empresa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerPromedioCotizacionesUltimoMesAgrupadosPorEmpresa() {
        try {
            const promediosPorDia = await this.obtenerPromedioCotizacionesPorDiaDeTodasLasEmpresas();
            const fechaActual = moment();
            const fechaHaceUnMes = moment().subtract(1, 'months');
            const promediosAgrupados = {};
            promediosPorDia.forEach(promedio => {
                const fechaCotizacion = moment(promedio.fecha);
                if (fechaCotizacion.isBetween(fechaHaceUnMes, fechaActual, null, '[]')) {
                    const { codempresa, empresaNombre } = promedio;
                    if (!promediosAgrupados[codempresa]) {
                        promediosAgrupados[codempresa] = { empresaNombre, promedios: [] };
                    }
                    promediosAgrupados[codempresa].promedios.push({
                        fecha: promedio.fecha,
                        promedio: promedio.promedio,
                    });
                }
            });
            return Object.keys(promediosAgrupados).map(codempresa => ({
                codempresa,
                empresaNombre: promediosAgrupados[codempresa].empresaNombre,
                promedios: promediosAgrupados[codempresa].promedios,
            }));
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener los promedios de cotizaciones del último mes agrupados por empresa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerPromedioCotizacionesPorDiaDeTodasLasEmpresas() {
        try {
            const empresas = await this.empresaRepository.find();
            const resultados = [];
            for (const empresa of empresas) {
                const promedios = await this.obtenerPromedioCotizacionesPorDia(empresa.codempresa);
                resultados.push(...promedios.map(promedio => ({
                    codempresa: empresa.codempresa,
                    nombre: empresa.empresaNombre,
                    ...promedio
                })));
            }
            return resultados;
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener los promedios de cotizaciones', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerUltimosTresDiasCotizaciones(codempresa) {
        try {
            const fechaDesde = moment().subtract(3, 'days').startOf('day').toDate();
            const fechaHasta = new Date();
            const cotizaciones = await this.cotizacionRepository.find({
                where: {
                    fecha: (0, typeorm_2.Between)(fechaDesde, fechaHasta),
                    empresa: { codempresa: codempresa },
                },
                order: {
                    fecha: 'ASC',
                },
            });
            return cotizaciones;
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener las cotizaciones', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerPromedioCotizacionesPorDia(codigoEmpresa) {
        try {
            const cotizaciones = await this.cotizacionRepository.find({
                where: {
                    empresa: { codempresa: codigoEmpresa },
                },
            });
            if (cotizaciones.length === 0) {
                throw new common_1.HttpException('No se encontraron cotizaciones para la empresa especificada', common_1.HttpStatus.NOT_FOUND);
            }
            const cotizacionesPorFecha = cotizaciones.reduce((acc, cotizacion) => {
                const fecha = new Date(cotizacion.fecha).toISOString().substring(0, 10);
                if (!acc[fecha]) {
                    acc[fecha] = [];
                }
                acc[fecha].push(cotizacion.cotization);
                return acc;
            }, {});
            const promediosPorDia = Object.keys(cotizacionesPorFecha).map(fecha => {
                const cotizacionesDelDia = cotizacionesPorFecha[fecha];
                if (cotizacionesDelDia.length === 0) {
                    return { fecha, promedio: 0 };
                }
                const suma = cotizacionesDelDia.reduce((total, valor) => total + (parseFloat(valor) || 0), 0);
                const promedio = suma / cotizacionesDelDia.length;
                return { fecha, promedio: parseFloat(promedio.toFixed(2)) };
            });
            return promediosPorDia;
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener los promedios de cotizaciones', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
    async obtenerCotizacionesPorEmpresa(codigoEmpresa) {
        try {
            const cotizaciones = await this.cotizacionRepository.find({
                where: {
                    empresa: {
                        codempresa: codigoEmpresa,
                    },
                },
            });
            return cotizaciones.map((cotizacion) => ({
                id: cotizacion.id.toString(),
                fecha: new Date(cotizacion.fecha).toISOString().substring(0, 10),
                hora: cotizacion.hora,
                dateUTC: new Date(cotizacion.fecha).toISOString(),
                cotization: cotizacion.cotization.toString(),
            }));
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener las cotizaciones de la empresa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
            const response = await axios_1.default.get(`${this.apiUrl}cotizaciones/${codigoEmpresa}/cotizacion`, {
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
            const response = await axios_1.default.get(`${this.apiUrl}cotizaciones/${codempresa}/cotizaciones?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`);
            return response.data;
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener las cotizaciones', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerCotizacionesDesdeInicioDelAno() {
        try {
            const fechaInicio = moment().startOf('year').format('YYYY-MM-DD') + 'T00:00';
            const fechaActual = moment().endOf('day').format('YYYY-MM-DD') + 'T23:59';
            const empresas = await this.empresaRepository.find();
            const cotizacionesParaGuardar = [];
            const promises = empresas.map(async (empresa) => {
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
                            const cotizacionExistente = await this.cotizacionRepository.findOne({
                                where: {
                                    empresa: { id: empresa.id },
                                    fecha: moment(`${fechaStr}T${horaStr}`).tz('America/Sao_Paulo').toDate(),
                                    hora: horaStr,
                                },
                            });
                            if (cotizacionExistente) {
                                console.log(`Cotización ya existe para la empresa ${empresa.codempresa} en la fecha ${fechaStr} a las ${horaStr}`);
                                continue;
                            }
                            const cotizacion = await axios_1.default.get(`${this.apiUrl}empresas/${empresa.codempresa}/cotizaciones`, {
                                params: { fechaDesde: `${fechaStr}T${horaStr}`, fechaHasta: `${fechaStr}T${horaStr}` },
                            });
                            const cotizacionData = cotizacion.data[0];
                            if (!cotizacionData) {
                                console.error(`No se encontraron datos de cotización para la empresa ${empresa.codempresa} en la fecha ${fechaStr} a las ${horaStr}`);
                                continue;
                            }
                            cotizacionesParaGuardar.push(this.cotizacionRepository.create({
                                fecha: moment(cotizacionData.fecha).tz('America/Sao_Paulo').toDate(),
                                hora: horaStr,
                                cotization: parseFloat(cotizacionData.cotization),
                                empresa: empresa,
                            }));
                        }
                        catch (error) {
                            console.error(`Error al obtener cotización para la empresa ${empresa.codempresa} en la fecha ${fechaStr} a las ${horaStr}:`, error);
                        }
                    }
                }
            });
            await Promise.all(promises);
            const batchSize = 1000;
            for (let i = 0; i < cotizacionesParaGuardar.length; i += batchSize) {
                const batch = cotizacionesParaGuardar.slice(i, i + batchSize);
                await this.cotizacionRepository.save(batch);
                console.log(`Guardadas ${batch.length} cotizaciones en la base de datos.`);
            }
            console.log('Todas las cotizaciones han sido obtenidas y guardadas exitosamente.');
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