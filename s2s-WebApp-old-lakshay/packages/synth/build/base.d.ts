declare class Base {
    baseURL: string;
    bearerToken: string | null;
    constructor(baseUrl: string, apiVersion: string, authToken: string);
    static get(endpoint: string, overrideHeaders?: {}): Promise<any>;
    static post(endpoint: string, data: any, overrideHeaders?: {}): Promise<any>;
    static _request(method: string, endpoint: string, body: any, headers: any): Promise<any>;
    _authenticatedHeaders: (headers: any) => any;
    _authenticatedRequest(method: any, endpoint: any, body: any, overrideHeaders: any): Promise<any>;
    _endpoint(pathname: string): string;
}
export default Base;
