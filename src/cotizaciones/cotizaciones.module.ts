import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CotizacionController } from './cotizaciones.controller';
import { CotizacionService } from './cotizaciones.service';
import { Empresa } from 'src/empresa/entities/empresa.entity';
import { Cotizacion } from './entitis/cotizacion.entity';
import { CotizacionCronService } from 'src/services/cron.service';
import { EmpresaService } from 'src/empresa/empresa.service';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa, Cotizacion])],
  controllers: [CotizacionController],
  providers: [CotizacionService, CotizacionCronService, EmpresaService],
  exports: [CotizacionService], 
})
export class CotizacionModule {}