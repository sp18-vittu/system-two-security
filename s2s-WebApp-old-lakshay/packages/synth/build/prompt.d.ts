import Base from "./base";
declare class Prompt extends Base {
    sanitizer: any;
    prompter: any;
    constructor();
    authenticatedGet(endpoint: string, body: any | null, overritedHeaders: any): Promise<any>;
    authenticatedPost(endpoint: string, body: any, overritedHeaders: any): Promise<any>;
}
declare const _default: Prompt;
export default _default;
