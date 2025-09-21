import Base from "./base";
import Prompt from "./prompt";
declare class Synth extends Base {
    auth: any;
    messages: any;
    app: any;
    connectors: any;
    constructor();
    authenticatedGet(endpoint: string, body: any | null, overritedHeaders: any): Promise<any>;
    authenticatedPost(endpoint: string, body: any, overritedHeaders: any): Promise<any>;
}
declare const _default: Synth;
export default _default;
export { Prompt };
