"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const endpoints_1 = __importDefault(require("../endpoints"));
exports.default = (client) => {
    return {
        sanitize: (req) => {
            const { SANITIZE } = endpoints_1.default;
            return client
                .authenticatedPost(`${client._endpoint(SANITIZE)}`, req)
                .then((response) => response);
        },
    };
};
