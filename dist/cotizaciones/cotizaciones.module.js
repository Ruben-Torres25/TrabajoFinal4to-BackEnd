"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CotizacionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cotizaciones_controller_1 = require("./cotizaciones.controller");
const cotizaciones_service_1 = require("./cotizaciones.service");
const empresa_entity_1 = require("../empresa/entities/empresa.entity");
const cotizacion_entity_1 = require("./entitis/cotizacion.entity");
const cron_service_1 = require("../services/cron.service");
const empresa_service_1 = require("../empresa/empresa.service");
const indice_cotizaciones_service_1 = require("../indice-cotizaciones/indice-cotizaciones.service");
const indice_cotizacione_entity_1 = require("../indice-cotizaciones/entities/indice-cotizacione.entity");
const indice_entity_1 = require("../indice/entities/indice.entity");
const indice_module_1 = require("../indice/indice.module");
let CotizacionModule = class CotizacionModule {
};
exports.CotizacionModule = CotizacionModule;
exports.CotizacionModule = CotizacionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([empresa_entity_1.Empresa, cotizacion_entity_1.Cotizacion, indice_cotizacione_entity_1.CotizacionIndice, indice_entity_1.Indice]),
            indice_module_1.IndiceModule],
        controllers: [cotizaciones_controller_1.CotizacionController],
        providers: [cotizaciones_service_1.CotizacionService, cron_service_1.CotizacionCronService, empresa_service_1.EmpresaService, indice_cotizaciones_service_1.CotizacionIndiceService],
        exports: [cotizaciones_service_1.CotizacionService],
    })
], CotizacionModule);
//# sourceMappingURL=cotizaciones.module.js.map