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


  async findAll(): Promise<Empresa[]> {
    try {
      return await this.indiceRepository.find();
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error al obtener las empresas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  async findByCodempresa(codempresa: string) {
    try {
      // Verificar si la empresa ya existe en la base de datos
      const empresaExistente = await this.indiceRepository.findOne({
        where: { codempresa: codempresa }
      });
  
      if (empresaExistente) {
        throw new HttpException('La empresa ya existe en tu base de datos', HttpStatus.CONFLICT);
      }
  
      const response = await clienteAxios.get(
        `${this.apiUrl}empresas/${codempresa}/details`,
      );
      const empresas = response.data;
      
      const guardado = this.indiceRepository.create({
        codempresa: empresas.codempresa, 
        empresaNombre: empresas.empresaNombre,
        cotizationInicial: parseFloat(empresas.cotizationInicial),
        cantidadAcciones: BigInt(empresas.cantidadAcciones),
      });
      
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
