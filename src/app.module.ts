import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpresaModule } from './empresa/empresa.module';
import { CotizacionModule } from './cotizaciones/cotizaciones.module';
import { CotizacionCronService } from './services/cron.service';
import { IndiceModule } from './indice/indice.module';
import { IndiceCotizacionesModule } from './indice-cotizaciones/indice-cotizaciones.module';





@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
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
    EmpresaModule,
    CotizacionModule,
    IndiceModule,
    IndiceCotizacionesModule,
  ],
  controllers: [AppController],
  providers: [AppService, CotizacionCronService],
})
export class AppModule {} 