"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const endpoints_1 = __importDefault(require("../endpoints"));
const base_1 = __importDefault(require("../base"));
exports.default = (client) => {
    return {
        sendPrompt: (req) => {
            const { PROMT } = endpoints_1.default;
            return base_1.default.get(`${client._endpoint(PROMT)}`, req).then((res) => res);
        },
    };
};
