"use strict";
/**
 *
 *
model
  schema 1.1
type user
type document
  relations
    define reader: [user]
    define writer: [user]
    define owner: [user]
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SYNTH_GATE_AUTH_MODEL = void 0;
exports.SYNTH_GATE_AUTH_MODEL = {
    schema_version: "1.1",
    type_definitions: [
        {
            type: "user",
        },
        {
            type: "document",
            relations: {
                reader: {
                    this: {},
                },
                writer: {
                    this: {},
                },
                owner: {
                    this: {},
                },
            },
            metadata: {
                relations: {
                    reader: {
                        directly_related_user_types: [
                            {
                                type: "user",
                            },
                        ],
                    },
                    writer: {
                        directly_related_user_types: [
                            {
                                type: "user",
                            },
                        ],
                    },
                    owner: {
                        directly_related_user_types: [
                            {
                                type: "user",
                            },
                        ],
                    },
                },
            },
        },
    ],
};
