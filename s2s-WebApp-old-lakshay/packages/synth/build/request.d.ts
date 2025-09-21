import { request } from "./interfaces/common";
declare class Request {
    static REQUEST_METHODS: {
        GET: string;
        POST: string;
        DELETE: string;
    };
    endpoint: string;
    body: string;
    headers: {};
    method: string;
    constructor(options: request);
    get config(): {
        method: string;
        baseURL: string;
        headers: {};
        params: string;
    };
    static handleResponse(response: {
        status: number;
        data: any;
        error: any | null;
        message: any;
    }): any;
    send(): Promise<any>;
}
export default Request;
