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
exports.EmpresaController = void 0;
const common_1 = require("@nestjs/common");
const empresa_service_1 = require("./empresa.service");
const DateUtils_1 = require("../utils/DateUtils");
let EmpresaController = class EmpresaController {
    constructor(empresaService) {
        this.empresaService = empresaService;
    }
    async getDetalleEmpresa(codigoEmpresa) {
        return await this.empresaService.getDetalleEmpresa(codigoEmpresa);
    }
    async getCotizacionesEmpresa(codigoEmpresa, fechaDesde, fechaHasta) {
        if (DateUtils_1.default.isValidParamDate(fechaDesde) &&
            DateUtils_1.default.isValidParamDate(fechaHasta)) {
            return await this.empresaService.getCotizationesbyFechas(codigoEmpresa, fechaDesde, fechaHasta);
        }
        throw new common_1.HttpException({
            status: common_1.HttpStatus.NOT_FOUND,
            error: 'Error en las fechas ' + fechaDesde + ' to ' + fechaHasta,
        }, common_1.HttpStatus.NOT_FOUND);
    }
    async getCotizacionEmpresa(codigoEmpresa, fecha, hora) {
        if (DateUtils_1.default.isValidRegistroFecha({ fecha, hora })) {
            return await this.empresaService.getCotizationFecha(codigoEmpresa, {
                fecha,
                hora,
            });
        }
        else {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: 'Error ',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.EmpresaController = EmpresaController;
__decorate([
    (0, common_1.Get)('/:codigoEmpresa/details'),
    __param(0, (0, common_1.Param)('codigoEmpresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getDetalleEmpresa", null);
__decorate([
    (0, common_1.Get)('/:codigoEmpresa/cotizaciones'),
    __param(0, (0, common_1.Param)('codigoEmpresa')),
    __param(1, (0, common_1.Query)('fechaDesde')),
    __param(2, (0, common_1.Query)('fechaHasta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getCotizacionesEmpresa", null);
__decorate([
    (0, common_1.Get)('/:codigoEmpresa/cotizacion'),
    __param(0, (0, common_1.Param)('codigoEmpresa')),
    __param(1, (0, common_1.Query)('fecha')),
    __param(2, (0, common_1.Query)('hora')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getCotizacionEmpresa", null);
exports.EmpresaController = EmpresaController = __decorate([
    (0, common_1.Controller)('empresas'),
    __metadata("design:paramtypes", [empresa_service_1.EmpresaService])
], EmpresaController);
//# sourceMappingURL=empresa.controller.js.map