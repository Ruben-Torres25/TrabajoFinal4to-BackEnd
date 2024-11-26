import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CotizacionService } from 'src/cotizaciones/cotizaciones.service';

@Injectable()
export class CotizacionCronService {
   constructor(
       private readonly cotizacionService: CotizacionService,
   ) {}

  
   @Cron('0 * * * *') 
   async handleCronObtenerCotizacionesDesdeInicioDelAno() {
       await this.ejecutarObtenerCotizacionesDesdeInicioDelAno();
   }

   
   async ejecutarObtenerCotizacionesDesdeInicioDelAno() {
       try {
           console.log('Ejecutando cron para obtener cotizaciones desde el inicio del año:', new Date().toISOString());
           await this.cotizacionService.obtenerCotizacionesDesdeInicioDelAno();
           console.log('Cotizaciones desde el inicio del año han sido obtenidas correctamente.');
       } catch (error) {
           console.error('Error al obtener cotizaciones desde el inicio del año:', error);
       }
   }

   // ejecutar el cron manualmente para test
   async ejecutarAhora() {
       await this.ejecutarObtenerCotizacionesDesdeInicioDelAno();
   }
}