// src/empresa/entities/cotizacion.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cotizaciones') 
export class Cotizacion {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  public id: number;

  @Column({
    name: 'fecha',
    type: 'date', 
  })
  public fecha: string;

  @Column({
    name: 'hora',
    length: 5,
  })
  public hora: string;

  @Column({
    name: 'dateUTC',
    type: 'date',
  })
  public dateUTC: string;

  @Column({
    name: 'cotization',
    type: 'decimal',
    precision: 7,
    scale: 2,
  })
  public cotization: number;

  @Column({
    name: 'codempresa',
    length: 100,
  })
  public codempresa: string;
}