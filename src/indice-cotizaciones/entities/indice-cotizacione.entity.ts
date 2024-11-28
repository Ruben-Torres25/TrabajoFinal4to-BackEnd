import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Indice } from "src/indice/entities/indice.entity";

@Entity('cotizacionesIndices')
export class CotizacionIndice {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  public id: number;

  @Column({
    name: 'fecha',
    type: 'varchar',
    precision: 10,
  })
  public fecha: string;

  @Column({
    name: 'hora',
    type: 'varchar',
    precision: 10,
  })
  public hora: string;

  @Column({
    name: 'valorCotizacionIndice',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  public valorCotizacionIndice: number;

  @Column({
    name: 'codIndice', 
    type: 'varchar',
  })
  public codIndice: string; 

  @ManyToOne(() => Indice, (indice) => indice.cotizaciones)
  @JoinColumn({
    name: 'codIndice', 
    referencedColumnName: 'codIndice', 
  })
  public codigoIndice: Indice;

  constructor(fecha: string, hora: string, valorCotizacionIndice: number, codigoIndice?: Indice) {
    this.fecha = fecha;
    this.hora = hora;
    this.valorCotizacionIndice = valorCotizacionIndice;
    this.codigoIndice = codigoIndice || null; 
    this.codIndice = codigoIndice ? codigoIndice.codIndice : null; 
  }
}