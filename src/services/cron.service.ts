import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CotizacionService } from 'src/cotizaciones/cotizaciones.service';
import { CotizacionIndiceService } from 'src/indice-cotizaciones/indice-cotizaciones.service';
import { IndiceService } from 'src/indice/indice.service';

@Injectable()
export class CotizacionCronService {
  constructor(
    private readonly cotizacionService: CotizacionService,
    private readonly cotizacionIndiceService: CotizacionIndiceService,
    private readonly indiceService: IndiceService
  ) {}

  @Cron('0 * * * *') 
  async handleCronObtenerCotizacionesEmpresas() {
    await this.cotizacionService.obtenerCotizacionesDesdeInicioDelAno();
    console.log('se jecuto cron, se obtuvieron las cotizaciones de empresas')
  }

  @Cron('5 * * * *') 
  async handleCronObtenerIndices() {
    await this.indiceService.obtenerIndices();
    console.log('se ejecuto cron, se obtuvieron los indices')
  }


  @Cron('10 * * * *') 
  async handleCronCalcularMiIndiceYGuardarloEnDB() {
    await this.cotizacionIndiceService.calcularYGuardarPromedios();
    console.log('se ejecuto cron, se calcularon y guardaron sus indicesCotizaciones')
  } 

  @Cron('15 * * * *') 
  async handleCronPublicarIndice() {
    await this.cotizacionIndiceService.verificarYPublicarCotizacionesIBOV();
    console.log('se ejecuto cron, se publicaron los nuevos indices cotizaciones de IBOV')
  }

  @Cron('20 * * * *') 
  async handleCronObtenerIndicesDeLosDemas() {
    await this.cotizacionIndiceService.obtenerYGuardarCotizacionesPorIndices();
    console.log('se ejecuto cron, se obtuvieron y guardaron los indices obtuvidos de gempresa')
  }



}
