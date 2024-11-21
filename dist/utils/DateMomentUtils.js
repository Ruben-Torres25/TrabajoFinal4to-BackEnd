"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentTZ = require("moment-timezone");
class DateMomentUtils {
    static getFechaHoraActual() {
        return '';
    }
    static getFechaFromRegistroFecha(fecha) {
        const horaTz = momentTZ.tz(`${fecha.fecha}T${fecha.hora}:00`, DateMomentUtils.TIMEZONE);
        return horaTz.toDate();
    }
    static getRegistroFechaFromFecha(fecha) {
        const fechaStr = momentTZ(fecha).tz(DateMomentUtils.TIMEZONE).format();
        console.log(fecha);
        console.log(fechaStr);
        return {
            fecha: fechaStr.substring(0, 10),
            hora: fechaStr.substring(11, 16),
        };
    }
    static agregarUnaHora(fecha) {
        const currentMils = fecha.getTime();
        return new Date(currentMils + 1000 * 60 * 60);
    }
    static estaEntreLasHoras(registro, horaDesde, horaHasta) {
        let horasCinta = DateMomentUtils.rotateArrayToFirstIndex(DateMomentUtils.HORAS_DIA, DateMomentUtils.HORAS_DIA.findIndex((hora) => hora == horaDesde));
        const indiceHasta = horasCinta.findIndex((hora) => hora == horaHasta);
        horasCinta = horasCinta.slice(0, indiceHasta + 1);
        return horasCinta.findIndex((horac) => horac == registro.hora) >= 0;
    }
    static getRegistrosEntreFechas(fechaDesde, fechaHasta, horarios) {
        const registros = [];
        let fechaActual = DateMomentUtils.getFechaFromRegistroFecha(fechaDesde);
        const fechaLimite = DateMomentUtils.getFechaFromRegistroFecha(fechaHasta);
        while (fechaActual <= fechaLimite) {
            registros.push(DateMomentUtils.getRegistroFechaFromFecha(fechaActual));
            fechaActual = DateMomentUtils.agregarUnaHora(fechaActual);
        }
        if (horarios) {
            return registros.filter((registro) => DateMomentUtils.estaEntreLasHoras(registro, horarios.horaDesde, horarios.horaHasta));
        }
        return registros;
    }
}
DateMomentUtils.TIMEZONE = 'Asia/Tokyo';
DateMomentUtils.HORAS_DIA = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
];
DateMomentUtils.rotateArrayToFirstIndex = (arr, indexToPlaceFirst) => {
    if (indexToPlaceFirst < 0 || indexToPlaceFirst >= arr.length) {
        console.log('Invalid index.');
        return arr;
    }
    const rotatedArray = [];
    const { length } = arr;
    for (let i = indexToPlaceFirst; i < length + indexToPlaceFirst; i += 1) {
        const originalIndex = i % length;
        rotatedArray.push(arr[originalIndex]);
    }
    return rotatedArray;
};
exports.default = DateMomentUtils;
//# sourceMappingURL=DateMomentUtils.js.map