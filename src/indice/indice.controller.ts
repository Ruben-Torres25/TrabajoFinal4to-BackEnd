import { Controller, Get, Post } from '@nestjs/common';
import { IndiceService } from './indice.service';

@Controller('indices')
export class IndiceController {
  constructor(private readonly indiceService: IndiceService) { }

  
  @Post('obtenerYGuardarIndices')
  async obtenerIndices() {
    return await this.indiceService.obtenerIndices();
  }

  
  @Get('obtenerIndices')
  async getAllIndices() {
    const indices = await this.indiceService.findAll();
    return indices.map((indice) => ({
      _id: indice.id,
      codIndice: indice.codIndice,
      nombreIndice: indice.nombreIndice, 
      __v: indice.valor,
    }));
  }
}