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

  @Cron('0 * * * *') // Cada hora en el minuto 0 ANDA BIEN
  async handleCronObtenerCotizacionesEmpresas() {
    await this.cotizacionService.obtenerCotizacionesDesdeInicioDelAno();
    console.log('se jecuto cron, se obtuvieron las cotizaciones de empresas')
  }

  @Cron('59 * * * *') // Cada hora en el minuto 2 ANDA BIEN
  async handleCronObtenerIndices() {
    await this.indiceService.obtenerIndices();
    console.log('se ejecuto cron, se obtuvieron los indices')
  }


  @Cron('52 * * * *') // Cada hora en el minuto 2 
  async handleCronCalcularMiIndiceYGuardarloEnDB() {
    await this.cotizacionIndiceService.calcularYGuardarPromedios();
    console.log('se ejecuto cron, se calcularon y guardaron sus indicesCotizaciones')
  } 

  @Cron('53 * * * *') // Cada hora en el minuto 5
  async handleCronPublicarIndice() {
    await this.cotizacionIndiceService.verificarYPublicarCotizacionesIBOV();
    console.log('se ejecuto cron, se publicaron los nuevos indices cotizaciones de IBOV')
  }

  @Cron('54 * * * *') // Cada hora en el minuto 10
  async handleCronObtenerIndicesDeLosDemas() {
    await this.cotizacionIndiceService.obtenerYGuardarCotizacionesPorIndices();
    console.log('se ejecuto cron, se obtuvieron y guardaron los indices obtuvidos de gempresa')
  }



}


/* 
 @Cron('0 * * * *') 
  async handleCronObtenerCotizacionesDesdeInicioDelAno() {
    await this.executeWithLogging(
      'Ejecutando cron para obtener cotizaciones desde el inicio del año',
      this.cotizacionService.obtenerCotizacionesDesdeInicioDelAno.bind(this.cotizacionService),
      'Cotizaciones desde el inicio del año han sido obtenidas correctamente.'
    );
  }

  @Cron('2 * * * *') 
  async handleCalcularYGuardarPromedios() {
    await this.executeWithLogging(
      'Ejecutando cron para calcular y guardar promedios',
      this.cotizacionIndiceService.calcularYGuardarPromedios.bind(this.cotizacionIndiceService),
      'Promedios han sido calculados y guardados correctamente.'
    );
  }

  async handleCronVerificarYPublicarCotizacionesIBOV() {
    await this.executeWithLogging(
      'Ejecutando cron para verificar y publicar cotizaciones IBOV',
      this.cotizacionIndiceService.verificarYPublicarCotizacionesIBOV.bind(this.cotizacionIndiceService),
      'Cotizaciones IBOV han sido verificadas y publicadas correctamente.'
    );
  }

  @Cron('5 * * * *') // Cada hora
  async handleCron() {
    console.log('Ejecutando cron para obtener y guardar cotizaciones por índices...');
    try {
      await this.cotizacionIndiceService.obtenerYGuardarCotizacionesPorIndices();
      console.log('Cotizaciones obtenidas y guardadas exitosamente.');
    } catch (error) {
      console.error('Error al obtener y guardar cotizaciones:', error);
    }
  }

  private async executeWithLogging(
    startMessage: string,
    action: () => Promise<void>,
    successMessage: string,
  ) {
    console.log(startMessage, new Date().toISOString());
    try {
      await action();
      console.log(successMessage);
    } catch (error) {
      console.error('Error al ejecutar la acción:', error);
    }
  } */