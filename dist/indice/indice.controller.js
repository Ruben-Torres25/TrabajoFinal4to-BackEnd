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
exports.IndiceController = void 0;
const common_1 = require("@nestjs/common");
const indice_service_1 = require("./indice.service");
let IndiceController = class IndiceController {
    constructor(indiceService) {
        this.indiceService = indiceService;
    }
    async obtenerIndices() {
        return await this.indiceService.obtenerIndices();
    }
    async getAllIndices() {
        const indices = await this.indiceService.findAll();
        return indices.map((indice) => ({
            _id: indice.id,
            codIndice: indice.codIndice,
            nombreIndice: indice.nombreIndice,
            __v: indice.valor,
        }));
    }
};
exports.IndiceController = IndiceController;
__decorate([
    (0, common_1.Post)('obtenerIndices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IndiceController.prototype, "obtenerIndices", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IndiceController.prototype, "getAllIndices", null);
exports.IndiceController = IndiceController = __decorate([
    (0, common_1.Controller)('indices'),
    __metadata("design:paramtypes", [indice_service_1.IndiceService])
], IndiceController);
//# sourceMappingURL=indice.controller.js.map