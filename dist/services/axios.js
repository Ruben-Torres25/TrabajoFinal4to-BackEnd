"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseURL = void 0;
const axios_1 = require("axios");
exports.baseURL = 'http://ec2-54-145-211-254.compute-1.amazonaws.com:3000/';
const axiosInstance = axios_1.default.create({
    baseURL: exports.baseURL,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
exports.default = axiosInstance;
//# sourceMappingURL=axios.js.map