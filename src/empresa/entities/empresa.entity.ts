import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('empresas') // Nombre de la tabla en la base de datos
export class Empresa {
  @PrimaryGeneratedColumn({
    type: 'int', // El tipo de dato en la base de datos
  })
  public id: number;

  @Column({
    name: 'codEmpresa',
    length: 100,
    nullable: false, // Asegúrate de que no sea nulo
  })
  public codempresa: string;
  

  @Column({
    name: 'empresaNombre', // Nombre de la columna
    length: 100, // Longitud máxima de la cadena
  })
  public empresaNombre: string;

  @Column({
    name: 'cotizationInicial', // Nombre de la columna
    type: 'decimal', // Tipo de dato en la base de datos
    precision: 7, // Número total de dígitos (entero + decimal)
    scale: 2, // Número de dígitos decimales
  })
  public cotizationInicial: number;

  @Column({
    name: 'cantidadAcciones', // Nombre de la columna
    type: 'bigint', // Tipo de dato para valores grandes
  })
  public cantidadAcciones: number;

  // Constructor para inicializar una instancia con datos opcionales
  constructor(partial?: Partial<Empresa>) {
    if (partial) {
      Object.assign(this, partial); // Asigna las propiedades proporcionadas
    }
  }

  // Métodos adicionales opcionales para la entidad
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

  public getCantidadAcciones(): number {
    return this.cantidadAcciones;
  }

  public setCantidadAcciones(cantidadAcciones: number): void {
    this.cantidadAcciones = cantidadAcciones;
  }
}
