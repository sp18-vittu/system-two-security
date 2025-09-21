"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("./request"));
const local_1 = __importDefault(require("./utils/local"));
class Base {
    constructor(baseUrl, apiVersion, authToken) {
        // const { APP_URL, URL_PREFIX } = moduleConfg;
        this._authenticatedHeaders = (headers) => {
            return Object.assign(Object.assign({}, headers), { Authorization: `Bearer ${this.bearerToken}` });
        };
        this.baseURL = `${baseUrl}`;
        this.bearerToken = local_1.default.getItem("auth_token");
        console.log(authToken);
        console.log(apiVersion);
    }
    static get(endpoint, overrideHeaders = {}) {
        const { GET } = request_1.default.REQUEST_METHODS;
        return Base._request(GET, endpoint, {}, overrideHeaders);
    }
    static post(endpoint, data, overrideHeaders = {}) {
        const { POST } = request_1.default.REQUEST_METHODS;
        return Base._request(POST, endpoint, data, overrideHeaders);
    }
    static _request(method, endpoint, body, headers) {
        const { GET } = request_1.default.REQUEST_METHODS;
        const requestAttrs = method === GET
            ? { endpoint, method, body, headers }
            : { endpoint, method, body, headers };
        const request = new request_1.default(requestAttrs);
        return request.send();
    }
    _authenticatedRequest(method, endpoint, body, overrideHeaders) {
        const headers = this._authenticatedHeaders(overrideHeaders);
        return Base._request(method, endpoint, body, headers);
    }
    _endpoint(pathname) {
        return this.baseURL + pathname;
    }
}
exports.default = Base;
