import { IsNumber } from 'class-validator';
import { Empresa } from 'src/empresa/entities/empresa.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';

@Entity('cotizaciones')
@Index(['empresa', 'fecha', 'hora'], { unique: true })
export class Cotizacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora: string;

  @IsNumber()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cotization: number;

  @ManyToOne(() => Empresa, (empresa) => empresa.cotizaciones)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

}