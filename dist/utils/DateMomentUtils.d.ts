import { RegistroCotizacion } from 'src/model/registro.cotizacion';
import { RegistroFecha } from 'src/model/registro.fecha';
declare class DateMomentUtils {
    static TIMEZONE: string;
    static HORAS_DIA: string[];
    static getFechaHoraActual(): string;
    static rotateArrayToFirstIndex: (arr: any[], indexToPlaceFirst: number) => any[];
    static getFechaFromRegistroFecha(fecha: RegistroFecha): Date;
    static getRegistroFechaFromFecha(fecha: Date): RegistroFecha;
    static agregarUnaHora(fecha: Date): Date;
    static estaEntreLasHoras(registro: RegistroCotizacion, horaDesde: string, horaHasta: string): boolean;
    static getRegistrosEntreFechas(fechaDesde: RegistroFecha, fechaHasta: RegistroFecha, horarios?: {
        horaDesde: string;
        horaHasta: string;
    }): RegistroCotizacion[];
}
export default DateMomentUtils;
