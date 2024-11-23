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
exports.Empresa = void 0;
const typeorm_1 = require("typeorm");
let Empresa = class Empresa {
    constructor(partial) {
        if (partial) {
            Object.assign(this, partial);
        }
    }
    getId() {
        return this.id;
    }
    getCodempresa() {
        return this.codempresa;
    }
    setCodempresa(codempresa) {
        this.codempresa = codempresa;
    }
    getEmpresaNombre() {
        return this.empresaNombre;
    }
    setEmpresaNombre(empresaNombre) {
        this.empresaNombre = empresaNombre;
    }
    getCotizacionInicial() {
        return this.cotizationInicial;
    }
    setCotizacionInicial(cotizationInicial) {
        this.cotizationInicial = cotizationInicial;
    }
    getCantidadAcciones() {
        return this.cantidadAcciones;
    }
    setCantidadAcciones(cantidadAcciones) {
        this.cantidadAcciones = cantidadAcciones;
    }
};
exports.Empresa = Empresa;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'int',
    }),
    __metadata("design:type", Number)
], Empresa.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'codEmpresa',
        length: 100,
        nullable: false,
    }),
    __metadata("design:type", String)
], Empresa.prototype, "codempresa", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'empresaNombre',
        length: 100,
    }),
    __metadata("design:type", String)
], Empresa.prototype, "empresaNombre", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cotizationInicial',
        type: 'decimal',
        precision: 7,
        scale: 2,
    }),
    __metadata("design:type", Number)
], Empresa.prototype, "cotizationInicial", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cantidadAcciones',
        type: 'bigint',
    }),
    __metadata("design:type", Number)
], Empresa.prototype, "cantidadAcciones", void 0);
exports.Empresa = Empresa = __decorate([
    (0, typeorm_1.Entity)('empresas'),
    __metadata("design:paramtypes", [Object])
], Empresa);
//# sourceMappingURL=empresa.entity.js.map