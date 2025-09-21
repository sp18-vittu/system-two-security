"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const endpoints_1 = __importDefault(require("../endpoints"));
exports.default = (client) => {
    return {
        prompt: (req) => {
            const { PROMPT } = endpoints_1.default;
            return client
                .authenticatedPost(`${client._endpoint(PROMPT)}`, req)
                .then((response) => response);
        },
        uploadPdf: (req) => {
            const { UPLOAD_PDF } = endpoints_1.default;
            return client
                .authenticatedPost(`${client._endpoint(UPLOAD_PDF)}`, req, {
                "Content-Type": "multipart/form-data",
            })
                .then((response) => response);
        },
    };
};
