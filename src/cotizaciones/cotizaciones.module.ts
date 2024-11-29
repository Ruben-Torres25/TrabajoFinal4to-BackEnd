import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CotizacionController } from './cotizaciones.controller';
import { CotizacionService } from './cotizaciones.service';
import { Empresa } from 'src/empresa/entities/empresa.entity';
import { Cotizacion } from './entitis/cotizacion.entity';
import { CotizacionCronService } from 'src/services/cron.service';
import { EmpresaService } from 'src/empresa/empresa.service';
import { CotizacionIndiceService } from 'src/indice-cotizaciones/indice-cotizaciones.service';
import { CotizacionIndice } from 'src/indice-cotizaciones/entities/indice-cotizacione.entity';
import { Indice } from 'src/indice/entities/indice.entity';
 
@Module({
  imports: [TypeOrmModule.forFeature([Empresa, Cotizacion, CotizacionIndice, Indice])],
  controllers: [CotizacionController],
  providers: [CotizacionService, CotizacionCronService, EmpresaService, CotizacionIndiceService],
  exports: [CotizacionService], 
})
export class CotizacionModule {}