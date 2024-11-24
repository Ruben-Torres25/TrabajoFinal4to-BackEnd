import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpresaModule } from './empresa/empresa.module';
import { CotizacionModule } from './cotizaciones/cotizaciones.module';


@Module({
  imports: [
    
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
      synchronize: true, 
      entities: ['dist/**/*.entity.js'],
      logging: true,
    }),
    EmpresaModule,
    CotizacionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
