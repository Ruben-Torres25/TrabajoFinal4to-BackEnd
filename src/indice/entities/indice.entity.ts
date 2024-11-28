import { CotizacionIndice } from 'src/indice-cotizaciones/entities/indice-cotizacione.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('indices')
export class Indice {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ name: 'codIndice', unique: true, nullable: false })
  public codIndice: string; 

  @Column({ name: 'nombreIndice', type: 'varchar' })
  public nombreIndice: string;

  @Column({ name: 'valor', type: 'decimal', precision: 10, scale: 2 })
  public valor: number;

  @OneToMany(() => CotizacionIndice, (cotizacionIndice) => cotizacionIndice.codigoIndice)
  cotizaciones: CotizacionIndice[];
}