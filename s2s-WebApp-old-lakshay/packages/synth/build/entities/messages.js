"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const endpoints_1 = __importDefault(require("../endpoints"));
exports.default = (client) => {
    return {
        load: (req) => {
            const { MESSAGES } = endpoints_1.default;
            return client
                .authenticatedGet(`${client._endpoint(MESSAGES)}/${req.id}`)
                .then((response) => response);
        },
        loadAll: (req) => {
            const { MESSAGES } = endpoints_1.default;
            return client
                .authenticatedGet(client._endpoint(MESSAGES), req)
                .then((response) => response);
        },
    };
};
