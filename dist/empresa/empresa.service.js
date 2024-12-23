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
exports.EmpresaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = require("axios");
const empresa_entity_1 = require("./entities/empresa.entity");
let EmpresaService = class EmpresaService {
    constructor(indiceRepository) {
        this.indiceRepository = indiceRepository;
        this.apiUrl = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/';
    }
    async findAll() {
        try {
            return await this.indiceRepository.find();
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener las empresas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByCodempresa(codempresa) {
        try {
            const empresaExistente = await this.indiceRepository.findOne({
                where: { codempresa: codempresa }
            });
            if (empresaExistente) {
                throw new common_1.HttpException('La empresa ya existe en tu base de datos', common_1.HttpStatus.CONFLICT);
            }
            const response = await axios_1.default.get(`${this.apiUrl}empresas/${codempresa}/details`);
            const empresas = response.data;
            const guardado = this.indiceRepository.create({
                codempresa: empresas.codempresa,
                empresaNombre: empresas.empresaNombre,
                cotizationInicial: parseFloat(empresas.cotizationInicial),
                cantidadAcciones: BigInt(empresas.cantidadAcciones),
            });
            await this.indiceRepository.save(guardado);
            return empresas;
        }
        catch (error) {
            console.error(error);
            throw new common_1.HttpException('Error al obtener la empresa', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.EmpresaService = EmpresaService;
exports.EmpresaService = EmpresaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(empresa_entity_1.Empresa)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmpresaService);
//# sourceMappingURL=empresa.service.js.map