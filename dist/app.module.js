"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const empresa_module_1 = require("./empresa/empresa.module");
const cotizaciones_module_1 = require("./cotizaciones/cotizaciones.module");
const cron_service_1 = require("./services/cron.service");
const indice_module_1 = require("./indice/indice.module");
const indice_cotizaciones_module_1 = require("./indice-cotizaciones/indice-cotizaciones.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'mysql',
                host: process.env.MYSQL_HOST,
                port: Number(process.env.MYSQL_PORT),
                username: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD,
                database: process.env.MYSQL_DB,
                synchronize: false,
                entities: ['dist/**/*.entity.js'],
                logging: true,
            }),
            empresa_module_1.EmpresaModule,
            cotizaciones_module_1.CotizacionModule,
            indice_module_1.IndiceModule,
            indice_cotizaciones_module_1.IndiceCotizacionesModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, cron_service_1.CotizacionCronService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map