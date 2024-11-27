import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { EmpresaService } from './empresa.service'; 
import { Empresa } from './entities/empresa.entity';

@Controller('empresa') 
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}
  
  @Get()
  async obtenerTodasLasEmpresas(): Promise<Empresa[]> {
    return this.empresaService.findAll();
  }

  @Get(':codempresa') 
  async obtenerInformacionEmpresa(@Param('codempresa') codempresa: string) {
    const empresa = await this.empresaService.findByCodempresa(codempresa);

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada'); 
    }

    return empresa; 
  }
}