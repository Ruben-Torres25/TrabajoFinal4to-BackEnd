"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DateUtils {
    static getFechaHoraActual() {
        const now = new Date();
        const fecha = now.toISOString().substring(0, 10);
        const hora = now.toISOString().substring(11, 16);
        return { fecha, hora };
    }
    static isValidParamDate(fecha) {
        return /^\d{4}-[01]\d-[0-3]\dT([01]\d|2[0-3]):[0-5]\d$/.test(fecha);
    }
    static isValidRegistroFecha(rf) {
        return (/^\d{4}-\d{2}-\d{2}$/.test(rf.fecha) &&
            /^([01]\d|2[0-3]):[0-5]\d$/.test(rf.hora));
    }
    static getFechaFromRegistroFecha(fecha) {
        return new Date(`${fecha.fecha}T${fecha.hora}:00.000Z`);
    }
    static getRegistroFechaFromFecha(fecha) {
        const fechaStr = fecha.toISOString();
        return {
            fecha: fechaStr.substring(0, 10),
            hora: fechaStr.substring(11, 16),
        };
    }
    static agregarUnaHora(fecha) {
        const currentMils = fecha.getTime();
        return new Date(currentMils + 1000 * 60 * 60);
    }
    static getRegistrosEntreFechas(fechaDesde, fechaHasta) {
        const registros = [];
        let fechaActual = DateUtils.getFechaFromRegistroFecha(fechaDesde);
        const fechaLimite = DateUtils.getFechaFromRegistroFecha(fechaHasta);
        while (fechaActual <= fechaLimite) {
            registros.push(DateUtils.getRegistroFechaFromFecha(fechaActual));
            fechaActual = DateUtils.agregarUnaHora(fechaActual);
        }
        return registros;
    }
}
exports.default = DateUtils;
//# sourceMappingURL=DateUtils.js.map