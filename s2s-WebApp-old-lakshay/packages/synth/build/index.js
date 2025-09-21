"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prompt = void 0;
const base_1 = __importDefault(require("./base"));
const request_1 = __importDefault(require("./request"));
const auth_1 = __importDefault(require("./entities/auth"));
const messages_1 = __importDefault(require("./entities/messages"));
const app_1 = __importDefault(require("./entities/app"));
const connectors_1 = __importDefault(require("./entities/connectors"));
const prompt_1 = __importDefault(require("./prompt"));
exports.Prompt = prompt_1.default;
class Synth extends base_1.default {
    constructor() {
        super("https://poc.synthgate.ai", "", "");
        this.auth = (0, auth_1.default)(this);
        this.messages = (0, messages_1.default)(this);
        this.app = (0, app_1.default)(this);
        this.connectors = (0, connectors_1.default)(this);
    }
    // authenticated get request
    authenticatedGet(endpoint, body, overritedHeaders) {
        const { GET } = request_1.default.REQUEST_METHODS;
        return this._authenticatedRequest(GET, endpoint, body, overritedHeaders);
    }
    // authenticated post request
    authenticatedPost(endpoint, body, overritedHeaders) {
        const { POST } = request_1.default.REQUEST_METHODS;
        return this._authenticatedRequest(POST, endpoint, body, overritedHeaders);
    }
}
exports.default = new Synth();
