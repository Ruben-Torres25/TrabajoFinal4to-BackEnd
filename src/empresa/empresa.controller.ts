import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { EmpresaService } from './empresa.service'; 

@Controller('empresa') 
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get(':codempresa') 
  async obtenerInformacionEmpresa(@Param('codempresa') codempresa: string) {
    const empresa = await this.empresaService.findByCodempresa(codempresa);

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada'); 
    }

    return empresa; 
  }
}