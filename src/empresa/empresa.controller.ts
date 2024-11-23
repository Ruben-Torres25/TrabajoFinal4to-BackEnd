import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { EmpresaService } from './empresa.service'; // Asegúrate de tener un servicio para manejar la lógica

@Controller('empresa') 
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get(':codempresa') // Define la ruta para obtener una empresa por su código
  async obtenerInformacionEmpresa(@Param('codempresa') codempresa: string) {
    const empresa = await this.empresaService.findByCodempresa(codempresa);

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada'); // Lanza una excepción si no se encuentra la empresa
    }

    return empresa; // Retorna la información de la empresa
  }
}