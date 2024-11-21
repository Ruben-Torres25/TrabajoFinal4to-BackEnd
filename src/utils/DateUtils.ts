import { RegistroCotizacion } from 'src/model/registro.cotizacion';
import { RegistroFecha } from 'src/model/registro.fecha';

class DateUtils {
  /**
   * Toma la Fecha de Hoy y genera un objeto bajo los formatos definidos
   * @returns  Objeto con la fecha y la hora en el formato standar
   * fecha: yyyy-mm-dd
   * hora: hh:mm
   */
  static getFechaHoraActual(): string {
    return '';
  }

  static isValidParamDate(fecha: string): boolean {
    return /^\d{4}-[01]\d-[0-3]\dT([01]\d|2[0-3]):[0-5]\d$/.test(fecha);
  }

  static isValidRegistroFecha(rf: RegistroFecha): boolean {
    return (
      /^\d{4}-\d{2}-\d{2}$/.test(rf.fecha) &&
      /^([01]\d|2[0-3]):[0-5]\d$/.test(rf.hora)
    );
  }

  static getFechaFromRegistroFecha(fecha: RegistroFecha): Date {
    return new Date(`${fecha.fecha}T${fecha.hora}:00.000Z`);
  }

  // 2024-10-07T19:00:00.000Z
  static getRegistroFechaFromFecha(fecha: Date): RegistroFecha {
    const fechaStr = fecha.toISOString();
    return {
      fecha: fechaStr.substring(0, 10),
      hora: fechaStr.substring(11, 16),
    };
  }

  static agregarUnaHora(fecha: Date): Date {
    const currentMils = fecha.getTime();
    return new Date(currentMils + 1000 * 60 * 60);
  }

  static getRegistrosEntreFechas(
    fechaDesde: RegistroFecha,
    fechaHasta: RegistroFecha,
  ): RegistroCotizacion[] {
    const registros = [];
    let fechaActual = DateUtils.getFechaFromRegistroFecha(fechaDesde);
    const fechaLimite = DateUtils.getFechaFromRegistroFecha(fechaHasta);

    while (fechaActual <= fechaLimite) {
      registros.push(DateUtils.getRegistroFechaFromFecha(fechaActual));
      fechaActual = DateUtils.agregarUnaHora(fechaActual);
    }
    return registros;
  }

  // static getRegistrosFaltantes(
  //   registrosTotales,
  //   resgistrosExistentes,
  // ): RegistroCotizacion[] {
  //   return [];
  // }
}

// crear una interface para representar
// fecha: yyyy-mm-dd
// hora: hh:mm

export default DateUtils;
