"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const endpoints_1 = __importDefault(require("../endpoints"));
const base_1 = __importDefault(require("../base"));
exports.default = (client) => {
    return {
        signIn: (credentials) => {
            const { SIGIN } = endpoints_1.default;
            return base_1.default.post(`${client._endpoint(SIGIN)}`, credentials).then((response) => response);
        },
        signUp: (userData) => {
            const { SIGNUP } = endpoints_1.default;
            return base_1.default.post(client._endpoint(SIGNUP), userData).then((response) => response);
        },
        passwordReset: (email) => {
            const { PASSWORDRESET } = endpoints_1.default;
            return base_1.default.post(client._endpoint(PASSWORDRESET), email).then((response) => response);
        },
    };
};
