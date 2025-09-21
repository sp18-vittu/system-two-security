"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const endpoints_1 = __importDefault(require("../endpoints"));
exports.default = (client) => {
    return {
        load: (req) => {
            const { CONNECTORS } = endpoints_1.default;
            return client
                .authenticatedGet(`${client._endpoint(CONNECTORS)}/${req.id}`)
                .then((response) => response);
        },
        loadAll: (req) => {
            const { CONNECTORS } = endpoints_1.default;
            return client
                .authenticatedGet(client._endpoint(CONNECTORS), req)
                .then((response) => response);
        },
        createConnector: (req) => {
            const { CREATE_CONNECTOR } = endpoints_1.default;
            return client
                .authenticatedPost(client._endpoint(CREATE_CONNECTOR), req)
                .then((response) => response);
        },
        getModules: (req) => {
            const { CONNECTOR_MODULES } = endpoints_1.default;
            return client
                .authenticatedPost(client._endpoint(CONNECTOR_MODULES), req)
                .then((response) => response);
        },
        importModule: (req) => {
            const { IMPORT_CONNECTOR_MODULE } = endpoints_1.default;
            return client
                .authenticatedPost(client._endpoint(IMPORT_CONNECTOR_MODULE), req)
                .then((response) => response);
        },
        executeFlow: (req) => {
            const { EXECUTE_CONNECTOR } = endpoints_1.default;
            return client
                .authenticatedPost(client._endpoint(EXECUTE_CONNECTOR), req)
                .then((response) => response);
        },
        getDocuments: (req) => {
            const { LOAD_DOCUMENTS } = endpoints_1.default;
            return client
                .authenticatedGet(`${client._endpoint(LOAD_DOCUMENTS)}/${req}/documents`, req)
                .then((response) => response);
        },
    };
};
