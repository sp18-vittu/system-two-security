import axios, { AxiosError, AxiosResponse } from "axios";
import { request } from "./interfaces/common";

class Request {
  static REQUEST_METHODS = {
    GET: "get",
    POST: "post",
    DELETE: "delete",
  };

  // endpoint
  endpoint = "";

  // body
  body = "";

  // headers
  headers = {};

  // method
  method = "";

  constructor(options: request) {
    this.endpoint = options.endpoint;
    (this.body = options.body),
      (this.headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      });
    this.method = options.method;
  }

  get config() {
    const config = {
      method: this.method,
      baseURL: this.endpoint,
      headers: this.headers,
      params: this.body,
    };

    return config; // omitBy(config, isUndefined);
  }

  static handleResponse(response: {
    status: number;
    data: any;
    error: any | null;
    message: any;
  }) {
    if (response.status === 200) {
      return response.data;
    }

    const error = new Error("Error code:" + response.status);
    error.name = response.error;
    error.message = response.message;

    throw error;
  }

  send() {
    const { config } = this;

    return axios({
      method: config.method,
      url: config.baseURL,
      data: config.params,
      headers: config.headers,
    })
      .then((response: AxiosResponse) => {
        return Request.handleResponse(response as any);
      })
      .catch((error: AxiosError) => {
        return Request.handleResponse(error as any);
      });
  }
}

export default Request;
