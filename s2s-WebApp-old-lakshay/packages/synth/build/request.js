"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class Request {
    constructor(options) {
        // endpoint
        this.endpoint = "";
        // body
        this.body = "";
        // headers
        this.headers = {};
        // method
        this.method = "";
        this.endpoint = options.endpoint;
        (this.body = options.body),
            (this.headers = Object.assign({ Accept: "application/json", "Content-Type": "application/json" }, options.headers));
        this.method = options.method;
    }
    get config() {
        const config = {
            method: this.method,
            baseURL: this.endpoint,
            headers: this.headers,
            params: this.body,
        };
        return config; // omitBy(config, isUndefined);
    }
    static handleResponse(response) {
        if (response.status === 200) {
            return response.data;
        }
        const error = new Error("Error code:" + response.status);
        error.name = response.error;
        error.message = response.message;
        throw error;
    }
    send() {
        const { config } = this;
        return (0, axios_1.default)({
            method: config.method,
            url: config.baseURL,
            data: config.params,
            headers: config.headers,
        })
            .then((response) => {
            return Request.handleResponse(response);
        })
            .catch((error) => {
            return Request.handleResponse(error);
        });
    }
}
Request.REQUEST_METHODS = {
    GET: "get",
    POST: "post",
    DELETE: "delete",
};
exports.default = Request;
