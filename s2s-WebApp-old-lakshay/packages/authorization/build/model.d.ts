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
export declare const SYNTH_GATE_AUTH_MODEL: {
    schema_version: string;
    type_definitions: ({
        type: string;
        relations?: undefined;
        metadata?: undefined;
    } | {
        type: string;
        relations: {
            reader: {
                this: {};
            };
            writer: {
                this: {};
            };
            owner: {
                this: {};
            };
        };
        metadata: {
            relations: {
                reader: {
                    directly_related_user_types: {
                        type: string;
                    }[];
                };
                writer: {
                    directly_related_user_types: {
                        type: string;
                    }[];
                };
                owner: {
                    directly_related_user_types: {
                        type: string;
                    }[];
                };
            };
        };
    })[];
};
