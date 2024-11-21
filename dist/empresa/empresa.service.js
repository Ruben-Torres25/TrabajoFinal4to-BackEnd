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
var EmpresaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const empresa_entity_1 = require("./entities/empresa.entity");
const cotizacion_entity_1 = require("./entities/cotizacion.entity");
let EmpresaService = EmpresaService_1 = class EmpresaService {
    constructor(empresaRepository, cotizacionRepository) {
        this.empresaRepository = empresaRepository;
        this.cotizacionRepository = cotizacionRepository;
        this.logger = new common_1.Logger(EmpresaService_1.name);
    }
    async getDetalleEmpresa(codigoEmpresa) {
        try {
            const criterio = {
                codempresa: codigoEmpresa,
            };
            const empresaResponse = await this.empresaRepository.findOneBy(criterio);
            if (!empresaResponse) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    error: 'Error la empresa ' + codigoEmpresa + ' : no se encuentra',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return empresaResponse;
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: 'Error la empresa ' + codigoEmpresa + ' : no se encuentra',
            }, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async getAllEmpresas() {
        try {
            const empresaResponse = await this.empresaRepository.find();
            return empresaResponse;
        }
        catch (error) {
            this.logger.error(error);
        }
        return [];
    }
    async getLast20CotizacionEmpresa(empresaId) {
        try {
            const sql = `select * from cotizaciones where idEmpresa = ${empresaId} order by dateUTC desc, hora desc limit 20`;
            const response = await this.cotizacionRepository.query(sql);
            return response;
        }
        catch (error) {
            this.logger.error(error);
        }
        return [];
    }
    async saveCotizacion(newCot) {
        return await this.cotizacionRepository.save(newCot);
    }
    async getCotizationFecha(codigoEmpresa, regFecha) {
        const criterio = {
            empresa: {
                codempresa: codigoEmpresa,
            },
            fecha: regFecha.fecha,
            hora: regFecha.hora,
        };
        const cotizacion = await this.cotizacionRepository.findOneBy(criterio);
        if (cotizacion) {
            return cotizacion;
        }
        throw new common_1.HttpException({
            status: common_1.HttpStatus.NOT_FOUND,
            error: 'No se encuentra cotizacion para ' +
                codigoEmpresa +
                ' ' +
                regFecha.fecha +
                ' ' +
                regFecha.hora,
        }, common_1.HttpStatus.NOT_FOUND);
    }
    async getCotizationesbyFechas(codigoEmpresa, fechaDesde, fechaHasta) {
        const fechaDesdeArray = fechaDesde.split('T');
        const fechaHastaArray = fechaHasta.split('T');
        const criterio = {
            empresa: {
                codempresa: codigoEmpresa,
            },
            dateUTC: (0, typeorm_2.Between)(fechaDesdeArray[0], fechaHastaArray[0]),
        };
        const cotizaciones = await this.cotizacionRepository.findBy(criterio);
        return cotizaciones.filter((cot) => {
            let validoDesde = true;
            let validoHasta = true;
            if (cot.fecha == fechaDesdeArray[0]) {
                if (cot.hora < fechaDesdeArray[1]) {
                    validoDesde = false;
                }
            }
            if (cot.fecha == fechaHastaArray[0]) {
                if (cot.hora > fechaHastaArray[1]) {
                    validoHasta = false;
                }
            }
            return validoDesde && validoHasta;
        });
    }
};
exports.EmpresaService = EmpresaService;
exports.EmpresaService = EmpresaService = EmpresaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(empresa_entity_1.Empresa)),
    __param(1, (0, typeorm_1.InjectRepository)(cotizacion_entity_1.Cotizacion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EmpresaService);
//# sourceMappingURL=empresa.service.js.map