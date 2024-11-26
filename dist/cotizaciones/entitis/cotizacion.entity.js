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
const class_validator_1 = require("class-validator");
const empresa_entity_1 = require("../../empresa/entities/empresa.entity");
const typeorm_1 = require("typeorm");
let Cotizacion = class Cotizacion {
};
exports.Cotizacion = Cotizacion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cotizacion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Cotizacion.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], Cotizacion.prototype, "hora", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Cotizacion.prototype, "cotization", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empresa_entity_1.Empresa, (empresa) => empresa.cotizaciones),
    (0, typeorm_1.JoinColumn)({ name: 'empresa_id' }),
    __metadata("design:type", empresa_entity_1.Empresa)
], Cotizacion.prototype, "empresa", void 0);
exports.Cotizacion = Cotizacion = __decorate([
    (0, typeorm_1.Entity)('cotizaciones'),
    (0, typeorm_1.Index)(['empresa', 'fecha', 'hora'], { unique: true })
], Cotizacion);
//# sourceMappingURL=cotizacion.entity.js.map