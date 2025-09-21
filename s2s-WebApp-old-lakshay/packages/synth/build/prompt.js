"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = __importDefault(require("./base"));
const sanitizer_1 = __importDefault(require("./prompt/entities/sanitizer"));
const prompter_1 = __importDefault(require("./prompt/entities/prompter"));
const request_1 = __importDefault(require("./request"));
// import axios, { AxiosError, AxiosResponse } from "axios";
class Prompt extends base_1.default {
    constructor() {
        // TODO: refactor this to load service url from config
        // axios.get('https://synthgate-s3-artifactory.s3.us-west-1.amazonaws.com/webapp-service/config/frontend-config.json')
        // .then(res => {
        //   this.baseURL = res.data.prompt_url;
        // });
        super("https://poc.synthgate.ai/prompt", "", "");
        this.sanitizer = (0, sanitizer_1.default)(this);
        this.prompter = (0, prompter_1.default)(this);
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
exports.default = new Prompt();
