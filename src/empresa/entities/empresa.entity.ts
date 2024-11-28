import { Cotizacion } from 'src/cotizaciones/entitis/cotizacion.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('empresas') 
export class Empresa {
  @PrimaryGeneratedColumn({
    type: 'int', 
  })
  public id: number;

  @Column({
    name: 'codEmpresa',
    length: 100,
    nullable: false, 
  })
  public codempresa: string;
  

  @Column({
    name: 'empresaNombre', 
    length: 100, 
  })
  public empresaNombre: string;

  @Column({
    name: 'cotizationInicial', 
    type: 'decimal', 
    precision: 7, 
    scale: 2, 
  })
  public cotizationInicial: number;

  @Column({
    name: 'cantidadAcciones', 
    type: 'bigint', 
  })
  public cantidadAcciones: bigint;
  cotizaciones: any;
  
  constructor(partial?: Partial<Empresa>) {
    if (partial) {
      Object.assign(this, partial); 
    }
  }

  
  public getId(): number {
    return this.id;
  }

  public getCodempresa(): string {
    return this.codempresa;
  }

  public setCodempresa(codempresa: string): void {
    this.codempresa = codempresa;
  }

  public getEmpresaNombre(): string {
    return this.empresaNombre;
  }

  public setEmpresaNombre(empresaNombre: string): void {
    this.empresaNombre = empresaNombre;
  }

  public getCotizacionInicial(): number {
    return this.cotizationInicial;
  }

  public setCotizacionInicial(cotizationInicial: number): void {
    this.cotizationInicial = cotizationInicial;
  }

  public getCantidadAcciones(): bigint {
    return this.cantidadAcciones;
  }

  public setCantidadAcciones(cantidadAcciones: bigint): void {
    this.cantidadAcciones = cantidadAcciones;
  }
}
