import Request from "./request";
import local from "./utils/local";

class Base {
  baseURL: string;
  bearerToken: string | null;

  constructor(baseUrl: string, apiVersion: string, authToken: string) {
    // const { APP_URL, URL_PREFIX } = moduleConfg;

    this.baseURL = `${baseUrl}`;
    this.bearerToken = local.getItem("auth_token");
    console.log(authToken);
    console.log(apiVersion);
  }

  static get(endpoint: string, overrideHeaders = {}) {
    const { GET } = Request.REQUEST_METHODS;
    return Base._request(GET, endpoint, {}, overrideHeaders);
  }

  static post(endpoint: string, data: any, overrideHeaders = {}) {
    const { POST } = Request.REQUEST_METHODS;
    return Base._request(POST, endpoint, data, overrideHeaders);
  }

  static _request(method: string, endpoint: string, body: any, headers: any) {
    const { GET } = Request.REQUEST_METHODS;
    const requestAttrs =
      method === GET
        ? { endpoint, method, body, headers }
        : { endpoint, method, body, headers };
    const request = new Request(requestAttrs);

    return request.send();
  }

  _authenticatedHeaders = (headers: any) => {
    return {
      ...headers,
      Authorization: `Bearer ${this.bearerToken}`,
    };
  };

  _authenticatedRequest(
    method: any,
    endpoint: any,
    body: any,
    overrideHeaders: any
  ) {
    const headers = this._authenticatedHeaders(overrideHeaders);
    return Base._request(method, endpoint, body, headers);
  }

  _endpoint(pathname: string) {
    return this.baseURL + pathname;
  }
}

export default Base;
