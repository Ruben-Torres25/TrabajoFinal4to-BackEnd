import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import clienteAxios from 'axios';
import { Indice } from './entities/indice.entity';

@Injectable()
export class IndiceService {
  private apiUrl = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/'; 

  constructor(
    @InjectRepository(Indice)
    private readonly indiceRepository: Repository<Indice>,
  ) {}

  
  async obtenerIndices() {
    try {
      const response = await clienteAxios.get(`${this.apiUrl}indices`); 
      const indicesData = response.data; 
     
      for (const indice of indicesData) {
        
        const existingIndice = await this.indiceRepository.findOne({
          where: { codIndice: indice.code }, 
        });
  
        if (!existingIndice) {
          const newIndice = this.indiceRepository.create({
            codIndice: indice.code, 
            nombreIndice: indice.name, 
            valor: 0, 
          });
          await this.indiceRepository.save(newIndice);
        } else {
          console.log(`El índice con código ${indice.code} ya existe en la base de datos.`);
        }
      }
  
      return { message: 'Índices guardados exitosamente' };
    } catch (error) {
      console.error(error);
      throw new HttpException('Error al obtener y guardar índices', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  
  async findAll(): Promise<Indice[]> {
    return this.indiceRepository.find();
  }
}