import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import clienteAxios from 'axios';
import { Empresa } from './entities/empresa.entity';

@Injectable()
export class EmpresaService {
  private apiUrl = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/';

  constructor(
    @InjectRepository(Empresa)
    private readonly indiceRepository: Repository<Empresa>,
  ) {}

  async findByCodempresa(codempresa: string) {
    try {
      const response = await clienteAxios.get(
        `${this.apiUrl}empresas/${codempresa}/details`,
      );
      const empresas = response.data;

      console.log(empresas, 'hola 1');
      console.log(empresas.codempresa, 'codigo de empresas');
      // Crear una nueva instancia de la empresa
      const guardado = this.indiceRepository.create({
        codempresa: empresas.codempresa, // Asegúrate de que "codeEmpresa" venga correctamente del servicio externo
        empresaNombre: empresas.empresaNombre,
        cotizationInicial: parseFloat(empresas.cotizationInicial),
        cantidadAcciones: parseInt(empresas.cantidadAcciones),
      });
      
      console.log(guardado)
      // Guardar en la base de datos
      await this.indiceRepository.save(guardado);
      
      return empresas;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error al obtener la empresa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
