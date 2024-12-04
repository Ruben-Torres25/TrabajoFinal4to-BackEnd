import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CotizacionIndiceController } from './indice-cotizaciones.controller';
import { CotizacionIndiceService } from './indice-cotizaciones.service';
import { CotizacionIndice } from './entities/indice-cotizacione.entity';
import { Indice } from 'src/indice/entities/indice.entity';
import { Cotizacion } from 'src/cotizaciones/entitis/cotizacion.entity';
import { IndiceService } from 'src/indice/indice.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CotizacionIndice, Indice, Cotizacion]),
  ],
  controllers: [CotizacionIndiceController],
  providers: [CotizacionIndiceService, IndiceService],
  exports: [CotizacionIndiceService],
})
export class IndiceCotizacionesModule {}