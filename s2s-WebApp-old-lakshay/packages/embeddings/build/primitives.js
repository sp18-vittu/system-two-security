"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.embedText = embedText;
exports.handleQuery = handleQuery;
const elasticsearch = __importStar(require("elasticsearch"));
const tfhub = __importStar(require("@tensorflow-models/universal-sentence-encoder"));
const client = new elasticsearch.Client({
    hosts: ["http://localhost:9200"],
    ssl: { rejectUnauthorized: false },
});
const INDEX_NAME = "posts";
const SEARCH_SIZE = 5;
function embedText(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const model = yield tfhub.load();
        const vectors = yield model.embed(text);
        return vectors.arraySync();
    });
}
function handleQuery(queryString) {
    return __awaiter(this, void 0, void 0, function* () {
        const embeddingStart = Date.now();
        const queryVector = yield embedText(queryString);
        const embeddingTime = Date.now() - embeddingStart;
        const scriptQuery = {
            script_score: {
                query: { match_all: {} },
                script: {
                    source: "cosineSimilarity(params.query_vector, doc['title_vector']) + 1.0",
                    params: { query_vector: queryVector },
                },
            },
        };
        const searchStart = Date.now();
        const response = yield client.search({
            index: INDEX_NAME,
            body: {
                size: SEARCH_SIZE,
                query: scriptQuery,
                _source: { includes: ["title", "body"] },
            },
        });
        const searchTime = Date.now() - searchStart;
        console.log();
        console.log(`${response.hits.total} total hits.`);
        console.log(`embedding time: ${embeddingTime} ms`);
        console.log(`search time: ${searchTime} ms`);
        response.hits.hits.forEach((hit) => {
            console.log(`id: ${hit._id}, score: ${hit._score}`);
            console.log(hit._source);
            console.log();
        });
    });
}
