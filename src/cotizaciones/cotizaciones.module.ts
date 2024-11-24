import { Module } from '@nestjs/common';
import { CotizacionController } from './cotizaciones.controller';
import { CotizacionService } from './cotizaciones.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from 'src/empresa/entities/empresa.entity';
import { Cotizacion } from './entitis/cotizacion.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Empresa, Cotizacion])],
  controllers: [CotizacionController],
  providers: [CotizacionService],
})
export class CotizacionModule {}