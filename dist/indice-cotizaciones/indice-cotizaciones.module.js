"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndiceCotizacionesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const indice_cotizaciones_controller_1 = require("./indice-cotizaciones.controller");
const indice_cotizaciones_service_1 = require("./indice-cotizaciones.service");
const indice_cotizacione_entity_1 = require("./entities/indice-cotizacione.entity");
const indice_entity_1 = require("../indice/entities/indice.entity");
const cotizacion_entity_1 = require("../cotizaciones/entitis/cotizacion.entity");
const indice_service_1 = require("../indice/indice.service");
let IndiceCotizacionesModule = class IndiceCotizacionesModule {
};
exports.IndiceCotizacionesModule = IndiceCotizacionesModule;
exports.IndiceCotizacionesModule = IndiceCotizacionesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([indice_cotizacione_entity_1.CotizacionIndice, indice_entity_1.Indice, cotizacion_entity_1.Cotizacion]),
        ],
        controllers: [indice_cotizaciones_controller_1.CotizacionIndiceController],
        providers: [indice_cotizaciones_service_1.CotizacionIndiceService, indice_service_1.IndiceService],
        exports: [indice_cotizaciones_service_1.CotizacionIndiceService],
    })
], IndiceCotizacionesModule);
//# sourceMappingURL=indice-cotizaciones.module.js.map