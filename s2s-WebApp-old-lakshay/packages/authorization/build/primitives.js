"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultFGAStore = createDefaultFGAStore;
exports.createAuthorizationStoreModel = createAuthorizationStoreModel;
exports.addDocument = addDocument;
exports.getDocuments = getDocuments;
exports.addUserToDocumentAsViewer = addUserToDocumentAsViewer;
exports.removeUserFromDocumentAsViewer = removeUserFromDocumentAsViewer;
exports.checkUserOnDocumentAsViewer = checkUserOnDocumentAsViewer;
const sdk_1 = require("@openfga/sdk");
const model_1 = require("./model");
const OPEN_FGA_STORE_NAME = "SYNTHGATE_AUTH_STORE";
const OPEN_FGA_HOST = "poc.synthgate.ai";
const OPEN_FGA_SCHEME = "http";
/**
 * List of primitives to interact with FGA authorization backend.
 * @returns
 */
function createDefaultFGAStore() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const openFga = new sdk_1.OpenFgaApi({
                apiScheme: OPEN_FGA_SCHEME, // optional, defaults to "https"
                apiHost: OPEN_FGA_HOST, // required, define without the scheme (e.g. api.openfga.example instead of https://api.openfga.example)
            });
            //list all stores
            const resultListStores = yield openFga.listStores();
            if (((_a = resultListStores.stores) === null || _a === void 0 ? void 0 : _a.length) && resultListStores.stores[0].id) {
                return resultListStores.stores[0].id;
            }
            const result = yield openFga.createStore({
                name: OPEN_FGA_STORE_NAME,
            });
            console.log(`successfully created store ${result.id}`);
            return result.id;
        }
        catch (error) {
            console.error("Failed to interact with FGA");
        }
        return "";
    });
}
function createAuthorizationStoreModel(argStoreId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const openFga = new sdk_1.OpenFgaApi({
                apiScheme: OPEN_FGA_SCHEME, // optional, defaults to "https"
                apiHost: OPEN_FGA_HOST, // required, define without the scheme (e.g. api.openfga.example instead of https://api.openfga.example)
                storeId: argStoreId,
            });
            const resultAuthorizationId = yield openFga.readAuthorizationModels();
            if (((_a = resultAuthorizationId.authorization_models) === null || _a === void 0 ? void 0 : _a.length) &&
                resultAuthorizationId.authorization_models[0].id) {
                return resultAuthorizationId.authorization_models[0].id;
            }
            const result = yield openFga.writeAuthorizationModel(model_1.SYNTH_GATE_AUTH_MODEL);
            console.log(`successfully created model ${result.authorization_model_id}`);
            return result.authorization_model_id;
        }
        catch (error) {
            console.error(error);
        }
        return "";
    });
}
/**
 * Documents - CRUD
 * @param docId
 * @param argStoreId
 * @param argAuthorizationModelId
 */
function addDocument(docId, argStoreId, argAuthorizationModelId) {
    return __awaiter(this, void 0, void 0, function* () {
        const tupleWrite = {
            writes: {
                tuple_keys: [
                    { user: `user:admin`, relation: "owner", object: `document:${docId}` },
                ],
            },
            authorization_model_id: argAuthorizationModelId,
        };
        try {
            const openFga = new sdk_1.OpenFgaApi({
                apiScheme: OPEN_FGA_SCHEME, // optional, defaults to "https"
                apiHost: OPEN_FGA_HOST, // required, define without the scheme (e.g. api.openfga.example instead of https://api.openfga.example)
                storeId: argStoreId,
            });
            const result = yield openFga.write(tupleWrite);
            console.log(`successfully added document ${result}`);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function getDocuments(userId, relationType, argStoreId, argAuthorizationModelId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const openFga = new sdk_1.OpenFgaApi({
                apiScheme: OPEN_FGA_SCHEME, // optional, defaults to "https"
                apiHost: OPEN_FGA_HOST, // required, define without the scheme (e.g. api.openfga.example instead of https://api.openfga.example)
                storeId: argStoreId,
            });
            const request = {
                authorization_model_id: argAuthorizationModelId,
                user: `user:${userId}`,
                relation: relationType,
                type: "document",
                contextual_tuples: {
                    tuple_keys: [],
                },
            };
            const result = yield openFga.listObjects(request);
            if ((result === null || result === void 0 ? void 0 : result.objects) && ((_a = result.objects) === null || _a === void 0 ? void 0 : _a.length)) {
                return result.objects;
            }
        }
        catch (error) {
            console.error(error);
        }
        return [];
    });
}
/**
 * User CRUD
 * @param userId
 * @param docId
 * @param argStoreId
 * @param argAuthorizationModelId
 */
function addUserToDocumentAsViewer(userId, docId, role, argStoreId, argAuthorizationModelId) {
    return __awaiter(this, void 0, void 0, function* () {
        const tupleWrite = {
            writes: {
                tuple_keys: [
                    {
                        user: `user:${userId}`,
                        relation: role,
                        object: `document:${docId}`,
                    },
                ],
            },
            authorization_model_id: argAuthorizationModelId,
        };
        try {
            const openFga = new sdk_1.OpenFgaApi({
                apiScheme: OPEN_FGA_SCHEME, // optional, defaults to "https"
                apiHost: OPEN_FGA_HOST, // required, define without the scheme (e.g. api.openfga.example instead of https://api.openfga.example)
                storeId: argStoreId,
            });
            const result = yield openFga.write(tupleWrite);
            console.log(`successfully added user ${result}`);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function removeUserFromDocumentAsViewer(userId, docId, role, argStoreId, argAuthorizationModelId) {
    return __awaiter(this, void 0, void 0, function* () {
        const tupleWrite = {
            deletes: {
                tuple_keys: [
                    {
                        user: `user:${userId}`,
                        relation: role,
                        object: `document:${docId}`,
                    },
                ],
            },
            authorization_model_id: argAuthorizationModelId,
        };
        try {
            const openFga = new sdk_1.OpenFgaApi({
                apiScheme: OPEN_FGA_SCHEME, // optional, defaults to "https"
                apiHost: OPEN_FGA_HOST, // required, define without the scheme (e.g. api.openfga.example instead of https://api.openfga.example)
                storeId: argStoreId,
            });
            const result = yield openFga.write(tupleWrite);
            console.log(`successfully deleted user ${result}`);
        }
        catch (error) {
            console.error(error);
        }
    });
}
function checkUserOnDocumentAsViewer(userId, docId, role, argStoreId, argAuthorizationModelId) {
    return __awaiter(this, void 0, void 0, function* () {
        const tupleCheck = {
            authorization_model_id: argAuthorizationModelId,
            tuple_key: {
                user: `user:${userId}`,
                relation: role,
                object: `document:${docId}`,
            },
        };
        try {
            const openFga = new sdk_1.OpenFgaApi({
                apiScheme: OPEN_FGA_SCHEME, // optional, defaults to "https"
                apiHost: OPEN_FGA_HOST, // required, define without the scheme (e.g. api.openfga.example instead of https://api.openfga.example)
                storeId: argStoreId,
            });
            const result = yield openFga.check(tupleCheck);
            console.log(`successfully checked user ${result}`);
            if (result.allowed) {
                return result.allowed;
            }
        }
        catch (error) {
            console.error(error);
        }
        return false;
    });
}
