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
exports.Indice = void 0;
const indice_cotizacione_entity_1 = require("../../indice-cotizaciones/entities/indice-cotizacione.entity");
const typeorm_1 = require("typeorm");
let Indice = class Indice {
};
exports.Indice = Indice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Indice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'codIndice', unique: true, nullable: false }),
    __metadata("design:type", String)
], Indice.prototype, "codIndice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nombreIndice', type: 'varchar' }),
    __metadata("design:type", String)
], Indice.prototype, "nombreIndice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'valor', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Indice.prototype, "valor", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => indice_cotizacione_entity_1.CotizacionIndice, (cotizacionIndice) => cotizacionIndice.codigoIndice),
    __metadata("design:type", Array)
], Indice.prototype, "cotizaciones", void 0);
exports.Indice = Indice = __decorate([
    (0, typeorm_1.Entity)('indices')
], Indice);
//# sourceMappingURL=indice.entity.js.map