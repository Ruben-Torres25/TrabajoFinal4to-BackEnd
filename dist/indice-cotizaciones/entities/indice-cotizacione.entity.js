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
exports.CotizacionIndice = void 0;
const typeorm_1 = require("typeorm");
const indice_entity_1 = require("../../indice/entities/indice.entity");
let CotizacionIndice = class CotizacionIndice {
    constructor(fecha, hora, valorCotizacionIndice, codigoIndice) {
        this.fecha = fecha;
        this.hora = hora;
        this.valorCotizacionIndice = valorCotizacionIndice;
        this.codigoIndice = codigoIndice || null;
        this.codIndice = codigoIndice ? codigoIndice.codIndice : null;
    }
};
exports.CotizacionIndice = CotizacionIndice;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'bigint',
    }),
    __metadata("design:type", Number)
], CotizacionIndice.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'fecha',
        type: 'varchar',
        precision: 10,
    }),
    __metadata("design:type", String)
], CotizacionIndice.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'hora',
        type: 'varchar',
        precision: 10,
    }),
    __metadata("design:type", String)
], CotizacionIndice.prototype, "hora", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'valorCotizacionIndice',
        type: 'decimal',
        precision: 10,
        scale: 2,
    }),
    __metadata("design:type", Number)
], CotizacionIndice.prototype, "valorCotizacionIndice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'codIndice',
        type: 'varchar',
    }),
    __metadata("design:type", String)
], CotizacionIndice.prototype, "codIndice", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => indice_entity_1.Indice, (indice) => indice.cotizaciones),
    (0, typeorm_1.JoinColumn)({
        name: 'codIndice',
        referencedColumnName: 'codIndice',
    }),
    __metadata("design:type", indice_entity_1.Indice)
], CotizacionIndice.prototype, "codigoIndice", void 0);
exports.CotizacionIndice = CotizacionIndice = __decorate([
    (0, typeorm_1.Entity)('cotizacionesIndices'),
    __metadata("design:paramtypes", [String, String, Number, indice_entity_1.Indice])
], CotizacionIndice);
//# sourceMappingURL=indice-cotizacione.entity.js.map