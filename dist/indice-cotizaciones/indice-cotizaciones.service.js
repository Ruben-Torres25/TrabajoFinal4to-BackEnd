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
const indice_service_1 = require("../indice/indice.service");
let CotizacionIndiceService = CotizacionIndiceService_1 = class CotizacionIndiceService {
    constructor(cotizacionRepository, cotizacionIndiceRepository, indiceRepository, indiceService) {
        this.cotizacionRepository = cotizacionRepository;
        this.cotizacionIndiceRepository = cotizacionIndiceRepository;
        this.indiceRepository = indiceRepository;
        this.indiceService = indiceService;
        this.logger = new common_1.Logger(CotizacionIndiceService_1.name);
        this.apiUrl = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/cotizaciones';
        this.apiUrlIBOV = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/IBOV/cotizaciones';
    }
    async obtenerCotizacionesPorIndices() {
        try {
            const fechaDesde = moment().startOf('year').format('YYYY-MM-DD') + 'T00:00';
            const fechaHasta = moment().endOf('day').format('YYYY-MM-DD') + 'T23:59';
            const indices = await this.indiceService.findAll();
            const cotizacionesPorIndicesPromises = indices.map(async (indice) => {
                const codigoIndice = indice.codIndice;
                const url = `http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/${codigoIndice}/cotizaciones?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
                const response = await axios_1.default.get(url);
                return { codigoIndice, cotizaciones: response.data };
            });
            const cotizacionesPorIndices = await Promise.all(cotizacionesPorIndicesPromises);
            return cotizacionesPorIndices;
        }
        catch (error) {
            console.error('Error al obtener cotizaciones por índices:', error);
            throw new common_1.HttpException('Error al obtener cotizaciones por índices', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async guardarCotizaciones(indicesCotizaciones) {
        const cotizacionesParaGuardar = [];
        for (const indiceCotizacion of indicesCotizaciones) {
            const { codigoIndice, cotizaciones } = indiceCotizacion;
            for (const cotizacion of cotizaciones) {
                const horaCotizacion = cotizacion.hora;
                if (horaCotizacion >= '09:00' && horaCotizacion <= '15:00') {
                    const cotizacionExistente = await this.cotizacionIndiceRepository.findOne({
                        where: {
                            fecha: cotizacion.fecha,
                            hora: cotizacion.hora,
                            codigoIndice: { codIndice: codigoIndice },
                        },
                    });
                    if (!cotizacionExistente) {
                        cotizacionesParaGuardar.push(this.cotizacionIndiceRepository.create({
                            fecha: cotizacion.fecha,
                            hora: cotizacion.hora,
                            valorCotizacionIndice: parseFloat(cotizacion.valor.toFixed(2)),
                            codigoIndice: { codIndice: codigoIndice },
                        }));
                    }
                }
            }
        }
        await this.cotizacionIndiceRepository.save(cotizacionesParaGuardar);
    }
    async obtenerYGuardarCotizacionesPorIndices() {
        try {
            const cotizacionesPorIndices = await this.obtenerCotizacionesPorIndices();
            if (!cotizacionesPorIndices || cotizacionesPorIndices.length === 0) {
                throw new Error('No se encontraron cotizaciones para guardar');
            }
            await this.guardarCotizaciones(cotizacionesPorIndices);
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener y guardar cotizaciones: ' + error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
            const promediosParaGuardar = [];
            for (const fecha in cotizacionesAgrupadas) {
                for (const hora in cotizacionesAgrupadas[fecha]) {
                    const cotizaciones = cotizacionesAgrupadas[fecha][hora];
                    const { suma, conteo } = this.calcularSumaYConteo(cotizaciones);
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
                        promediosParaGuardar.push(cotizacionIndice);
                        console.log(`Promedio ${promedio} calculado para la fecha ${fecha} y hora ${hora}`);
                    }
                    else {
                        console.warn(`Cotización promedio ya existe para la fecha ${fecha} y hora ${hora}. No se guardará un nuevo promedio.`);
                    }
                }
            }
            const batchSize = 1000;
            for (let i = 0; i < promediosParaGuardar.length; i += batchSize) {
                const batch = promediosParaGuardar.slice(i, i + batchSize);
                await this.cotizacionIndiceRepository.save(batch);
                console.log(`Guardados ${batch.length} promedios en la base de datos.`);
            }
            console.log('Todos los promedios han sido calculados y guardados exitosamente.');
        }
        catch (error) {
            console.error(`Error al calcular y guardar promedios: ${error.message}`);
            throw new common_1.HttpException('Error al calcular y guardar promedios', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verificarCotizacionEnGempresa(fecha, hora, codIndice) {
        const url = `http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/indices/cotizaciones/${codIndice}?fecha=${fecha}&hora=${hora}`;
        try {
            const response = await axios_1.default.get(url);
            return response.data.length > 0;
        }
        catch (error) {
            return false;
        }
    }
    async publicarTodasLasCotizaciones() {
        try {
            const cotizacionesAgrupadas = await this.indiceCoti();
            if (Object.keys(cotizacionesAgrupadas).length === 0) {
                return { message: 'No hay cotizaciones para publicar' };
            }
            for (const fecha in cotizacionesAgrupadas) {
                for (const hora in cotizacionesAgrupadas[fecha]) {
                    const cotizaciones = cotizacionesAgrupadas[fecha][hora];
                    for (const cotizacion of cotizaciones) {
                        if (!cotizacion.codIndice) {
                            console.warn(`Cotización sin índice para la fecha ${fecha}. Se omitirá.`);
                            continue;
                        }
                        const yaPublicada = await this.verificarCotizacionEnGempresa(fecha, hora, cotizacion.codIndice);
                        if (yaPublicada) {
                            console.warn(`Cotización ya publicada para la fecha ${fecha} a las ${hora}. Se omitirá.`);
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
                            console.log(`Cotización publicada exitosamente: ${JSON.stringify(response.data)}`);
                        }
                        catch (error) {
                            console.error(`Error al publicar la cotización para la fecha ${fecha} a las ${hora}:`, error.message);
                            continue;
                        }
                    }
                }
            }
            return { message: 'Todas las cotizaciones han sido procesadas para publicación' };
        }
        catch (error) {
            console.error(`Error al procesar las cotizaciones: ${error.message}`);
            throw new common_1.HttpException('Error al procesar las cotizaciones', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
            this.logger.error(`fecha ya publicada para el indice ${codigoIndice} en Gempresa`);
        }
    }
    async verificarYPublicarCotizacionesIBOV() {
        try {
            const cotizacionesExistentes = await this.cotizacionIndiceRepository.find({
                where: { codIndice: 'IBOV' },
            });
            const cotizacionesIBOV = await this.obtenerCotizacionesIBOV();
            const cotizacionesExistentesSet = new Set(cotizacionesExistentes.map(cotizacion => `${cotizacion.fecha}-${cotizacion.hora}`));
            const cotizacionesParaPublicar = [];
            for (const cotizacion of cotizacionesIBOV) {
                const fecha = cotizacion.fecha;
                const hora = cotizacion.hora;
                const key = `${fecha}-${hora}`;
                if (!cotizacionesExistentesSet.has(key)) {
                    const data = {
                        _id: cotizacion.id,
                        code: 'IBOV',
                        fecha: cotizacion.fecha,
                        hora: cotizacion.hora,
                        fechaDate: moment(`${cotizacion.fecha}T00:00:00.000Z`).toISOString(),
                        valor: cotizacion.valorCotizacionIndice,
                        __v: 0,
                    };
                    cotizacionesParaPublicar.push(data);
                    console.log(`Cotización a publicar: ${JSON.stringify(data)}`);
                }
                else {
                    console.log(`Cotización ya existe para la fecha ${fecha} a las ${hora}. Se omitirá.`);
                }
            }
            const batchSize = 1000;
            for (let i = 0; i < cotizacionesParaPublicar.length; i += batchSize) {
                const batch = cotizacionesParaPublicar.slice(i, i + batchSize);
                await Promise.all(batch.map(data => axios_1.default.post(this.apiUrl, data)));
                console.log(`Publicadas ${batch.length} cotizaciones en la API externa.`);
            }
            console.log('Todas las cotizaciones han sido verificadas y publicadas exitosamente.');
        }
        catch (error) {
            console.error(`Error al verificar y publicar cotizaciones IBOV: ${error.message}`);
            throw new common_1.HttpException('Error al verificar y publicar cotizaciones IBOV', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerPromedioCotizacionesPorDiaDeTodosLosIndices() {
        try {
            const cotizacionesPorIndices = await this.obtenerCotizacionesPorIndices();
            const promediosPorDia = {};
            cotizacionesPorIndices.forEach(indice => {
                const codigoIndice = indice.codigoIndice;
                indice.cotizaciones.forEach(cotizacion => {
                    const fechaCotizacion = moment(cotizacion.fecha).format('YYYY-MM-DD');
                    if (!promediosPorDia[codigoIndice]) {
                        promediosPorDia[codigoIndice] = {};
                    }
                    if (!promediosPorDia[codigoIndice][fechaCotizacion]) {
                        promediosPorDia[codigoIndice][fechaCotizacion] = [];
                    }
                    promediosPorDia[codigoIndice][fechaCotizacion].push(cotizacion.valor);
                });
            });
            const resultados = Object.keys(promediosPorDia).flatMap(codigoIndice => {
                return Object.keys(promediosPorDia[codigoIndice]).map(fecha => {
                    const valores = promediosPorDia[codigoIndice][fecha];
                    const suma = valores.reduce((acc, valor) => acc + valor, 0);
                    const promedio = valores.length > 0 ? parseFloat((suma / valores.length).toFixed(2)) : 0;
                    return { codigoIndice, fecha, promedio };
                });
            });
            return resultados;
        }
        catch (error) {
            console.error('Error al obtener el promedio de cotizaciones por día de todos los índices:', error);
            throw new common_1.HttpException('Error al obtener el promedio de cotizaciones por día de todos los índices', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async calcularPromedioTotalPorIndiceSinTSE() {
        try {
            const cotizacionesPorIndices = await this.obtenerCotizacionesPorIndices();
            const promediosTotales = {};
            cotizacionesPorIndices.forEach(indice => {
                const codigoIndice = indice.codigoIndice;
                const nombreIndice = indice.nombre;
                if (codigoIndice === 'TSE') {
                    return;
                }
                indice.cotizaciones.forEach(cotizacion => {
                    const valorCotizacion = cotizacion.valor;
                    if (!promediosTotales[codigoIndice]) {
                        promediosTotales[codigoIndice] = { suma: 0, conteo: 0, nombre: nombreIndice };
                    }
                    promediosTotales[codigoIndice].suma += valorCotizacion;
                    promediosTotales[codigoIndice].conteo += 1;
                });
            });
            const resultados = Object.keys(promediosTotales).map(codigoIndice => {
                const { suma, conteo, nombre } = promediosTotales[codigoIndice];
                const promedioTotal = conteo > 0 ? parseFloat((suma / conteo).toFixed(2)) : 0;
                return { codigoIndice, nombre, promedioTotal };
            });
            return resultados;
        }
        catch (error) {
            console.error('Error al calcular el promedio total por índice sin TSE:', error);
            throw new common_1.HttpException('Error al calcular el promedio total por índice sin TSE', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async calcularPromedioTotalPorIndice() {
        try {
            const cotizacionesPorIndices = await this.obtenerCotizacionesPorIndices();
            const promediosTotales = {};
            cotizacionesPorIndices.forEach(indice => {
                const codigoIndice = indice.codigoIndice;
                const nombreIndice = indice.nombre;
                indice.cotizaciones.forEach(cotizacion => {
                    const valorCotizacion = cotizacion.valor;
                    if (!promediosTotales[codigoIndice]) {
                        promediosTotales[codigoIndice] = { suma: 0, conteo: 0, nombre: nombreIndice };
                    }
                    promediosTotales[codigoIndice].suma += valorCotizacion;
                    promediosTotales[codigoIndice].conteo += 1;
                });
            });
            const resultados = Object.keys(promediosTotales).map(codigoIndice => {
                const { suma, conteo, nombre } = promediosTotales[codigoIndice];
                const promedioTotal = conteo > 0 ? parseFloat((suma / conteo).toFixed(2)) : 0;
                return { codigoIndice, nombre, promedioTotal };
            });
            return resultados;
        }
        catch (error) {
            console.error('Error al calcular el promedio total por índice:', error);
            throw new common_1.HttpException('Error al calcular el promedio total por índice', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerCotizacionesUltimoMesPorIndices() {
        try {
            const fechaActual = moment();
            const fechaHaceUnMes = moment().subtract(1, 'months');
            const indices = await this.indiceService.findAll();
            const cotizacionesPorIndices = [];
            for (const indice of indices) {
                const codigoIndice = indice.codIndice;
                const cotizacionesPorDia = [];
                for (let fecha = fechaHaceUnMes.clone(); fecha.isBefore(fechaActual); fecha.add(1, 'days')) {
                    const fechaStr = fecha.format('YYYY-MM-DD');
                    const cotizaciones = await this.cotizacionIndiceRepository.find({
                        where: {
                            codigoIndice: { codIndice: codigoIndice },
                            fecha: fechaStr,
                        },
                    });
                    cotizacionesPorDia.push({
                        fecha: fechaStr,
                        cotizaciones,
                    });
                }
                cotizacionesPorIndices.push({
                    codigoIndice,
                    cotizacionesPorDia,
                });
            }
            return cotizacionesPorIndices;
        }
        catch (error) {
            console.error('Error al obtener cotizaciones del último mes por índices:', error);
            throw new common_1.HttpException('Error al obtener cotizaciones del último mes por índices', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerPromedioMensualCotizacionesIndices() {
        try {
            const fechaDesde = moment().startOf('year').format('YYYY-MM-DD') + 'T00:00';
            const fechaHasta = moment().endOf('day').format('YYYY-MM-DD') + 'T23:59';
            const cotizacionesPorIndices = await this.obtenerCotizacionesPorIndices();
            const promediosMensuales = {};
            cotizacionesPorIndices.forEach(indice => {
                indice.cotizaciones.forEach(cotizacion => {
                    const fechaCotizacion = moment(cotizacion.fecha);
                    const mesKey = fechaCotizacion.format('YYYY-MM');
                    const codigoIndice = indice.codigoIndice;
                    if (!promediosMensuales[codigoIndice]) {
                        promediosMensuales[codigoIndice] = {};
                    }
                    if (!promediosMensuales[codigoIndice][mesKey]) {
                        promediosMensuales[codigoIndice][mesKey] = { suma: 0, conteo: 0 };
                    }
                    promediosMensuales[codigoIndice][mesKey].suma += cotizacion.valor;
                    promediosMensuales[codigoIndice][mesKey].conteo += 1;
                });
            });
            const resultados = Object.keys(promediosMensuales).map(codigoIndice => {
                const promediosPorIndice = Object.keys(promediosMensuales[codigoIndice]).map(mes => {
                    const { suma, conteo } = promediosMensuales[codigoIndice][mes];
                    const promedioMensual = conteo > 0 ? parseFloat((suma / conteo).toFixed(2)) : 0;
                    return { mes, promedioMensual };
                });
                return { codigoIndice, promedios: promediosPorIndice };
            });
            return resultados;
        }
        catch (error) {
            console.error('Error al obtener el promedio mensual de cotizaciones de índices:', error);
            throw new common_1.HttpException('Error al obtener el promedio mensual de cotizaciones de índices', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async obtenerCotizacionesUltimoMes() {
        try {
            const cotizacionesPorIndices = await this.obtenerCotizacionesPorIndices();
            const fechaActual = moment();
            const fechaHaceUnMes = moment().subtract(1, 'months');
            const promediosDiarios = {};
            cotizacionesPorIndices.forEach(indice => {
                const codigoIndice = indice.codigoIndice;
                indice.cotizaciones.forEach(cotizacion => {
                    const fechaCotizacion = moment(cotizacion.fecha);
                    if (fechaCotizacion.isBetween(fechaHaceUnMes, fechaActual, null, '[]')) {
                        const fechaKey = fechaCotizacion.format('YYYY-MM-DD');
                        if (!promediosDiarios[codigoIndice]) {
                            promediosDiarios[codigoIndice] = {};
                        }
                        if (!promediosDiarios[codigoIndice][fechaKey]) {
                            promediosDiarios[codigoIndice][fechaKey] = { suma: 0, conteo: 0 };
                        }
                        promediosDiarios[codigoIndice][fechaKey].suma += cotizacion.valor;
                        promediosDiarios[codigoIndice][fechaKey].conteo += 1;
                    }
                });
            });
            const promediosPorIndice = Object.keys(promediosDiarios).map(codigoIndice => {
                const promediosPorDia = Object.keys(promediosDiarios[codigoIndice]).map(fecha => {
                    const { suma, conteo } = promediosDiarios[codigoIndice][fecha];
                    const promedio = conteo > 0 ? parseFloat((suma / conteo).toFixed(2)) : 0;
                    return { fecha, promedio };
                });
                return { codigoIndice, promedios: promediosPorDia };
            });
            return promediosPorIndice;
        }
        catch (error) {
            console.error('Error al obtener las cotizaciones del último mes:', error);
            throw new common_1.HttpException('Error al obtener las cotizaciones del último mes', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
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
        typeorm_2.Repository,
        indice_service_1.IndiceService])
], CotizacionIndiceService);
//# sourceMappingURL=indice-cotizaciones.service.js.map