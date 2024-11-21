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
exports.Cotizacion = void 0;
const typeorm_1 = require("typeorm");
const empresa_entity_1 = require("./empresa.entity");
let Cotizacion = class Cotizacion {
    constructor() { }
};
exports.Cotizacion = Cotizacion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint',
    }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'fecha',
        type: 'varchar',
        precision: 10,
    }),
    __metadata("design:type", String)
], Cotizacion.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'hora',
        type: 'varchar',
        precision: 5,
    }),
    __metadata("design:type", String)
], Cotizacion.prototype, "hora", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'date',
    }),
    __metadata("design:type", String)
], Cotizacion.prototype, "dateUTC", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cotization',
        type: 'decimal',
        precision: 7,
        scale: 2,
    }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "cotization", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empresa_entity_1.Empresa),
    (0, typeorm_1.JoinColumn)({
        name: 'idEmpresa',
        referencedColumnName: 'id',
    }),
    __metadata("design:type", empresa_entity_1.Empresa)
], Cotizacion.prototype, "empresa", void 0);
exports.Cotizacion = Cotizacion = __decorate([
    (0, typeorm_1.Entity)('cotizaciones'),
    __metadata("design:paramtypes", [])
], Cotizacion);
//# sourceMappingURL=cotizacion.entity.js.map