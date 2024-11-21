"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockGenerator = void 0;
class StockGenerator {
    constructor({ history, estabilidad, }) {
        this.stabilityFactor = estabilidad;
        this.history = history;
        this.currentPrice = Number(this.history[0].cotization);
    }
    generateNextStockPrice() {
        let variation = Math.random() * 2 - 1;
        if (Math.random() * this.stabilityFactor < 0.02) {
            variation *= 10;
        }
        if (this.history.length < 10) {
            return Math.abs(this.currentPrice + variation);
        }
        else {
            variation = Math.abs(variation);
            if (Math.random() < 0.1) {
                return Math.abs(this.currentPrice + variation * this.tendency());
            }
            else {
                return Math.abs(this.currentPrice);
            }
        }
    }
    tendency() {
        let cantUp = 0;
        let cantDown = 0;
        for (let index = 0; index < this.history.length - 1; index++) {
            const element1 = this.history[index];
            const element2 = this.history[index + 1];
            if (element2 <= element1) {
                cantDown++;
            }
            else {
                cantUp++;
            }
        }
        return cantDown > cantUp ? -1 : 1;
    }
}
exports.StockGenerator = StockGenerator;
//# sourceMappingURL=StockGenerator.js.map