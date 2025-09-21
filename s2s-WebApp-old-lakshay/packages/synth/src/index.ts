import Base from "./base";
import Request from "./request";
import authmethods from "./entities/auth";
import messageMethods from "./entities/messages";
import appMethods from "./entities/app";
import connectorsMethods from "./entities/connectors";
import Prompt from "./prompt";

class Synth extends Base {
  auth: any;
  messages: any;
  app: any;
  connectors: any;

  constructor() {
    super("https://poc.synthgate.ai", "", "");
    this.auth = authmethods(this);
    this.messages = messageMethods(this);
    this.app = appMethods(this);
    this.connectors = connectorsMethods(this);
  }

  // authenticated get request
  authenticatedGet(endpoint: string, body: any | null, overritedHeaders: any) {
    const { GET } = Request.REQUEST_METHODS;
    return this._authenticatedRequest(GET, endpoint, body, overritedHeaders);
  }

  // authenticated post request
  authenticatedPost(endpoint: string, body: any, overritedHeaders: any) {
    const { POST } = Request.REQUEST_METHODS;
    return this._authenticatedRequest(POST, endpoint, body, overritedHeaders);
  }
}

export default new Synth();

export { Prompt };
