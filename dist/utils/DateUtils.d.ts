import { RegistroCotizacion } from 'src/model/registro.cotizacion';
import { RegistroFecha } from 'src/model/registro.fecha';
declare class DateUtils {
    static getFechaHoraActual(): RegistroFecha;
    static isValidParamDate(fecha: string): boolean;
    static isValidRegistroFecha(rf: RegistroFecha): boolean;
    static getFechaFromRegistroFecha(fecha: RegistroFecha): Date;
    static getRegistroFechaFromFecha(fecha: Date): RegistroFecha;
    static agregarUnaHora(fecha: Date): Date;
    static getRegistrosEntreFechas(fechaDesde: RegistroFecha, fechaHasta: RegistroFecha): RegistroCotizacion[];
}
export default DateUtils;
