import Base from "./base";
import sanitizerMethods from "./prompt/entities/sanitizer";
import prompterMethods from "./prompt/entities/prompter";
import Request from "./request";
// import axios, { AxiosError, AxiosResponse } from "axios";

class Prompt extends Base {
  sanitizer: any;
  prompter: any;

  constructor() {
    // TODO: refactor this to load service url from config
    // axios.get('https://synthgate-s3-artifactory.s3.us-west-1.amazonaws.com/webapp-service/config/frontend-config.json')
    // .then(res => {
    //   this.baseURL = res.data.prompt_url;
    // });
    super("https://poc.synthgate.ai/prompt", "", "");
    this.sanitizer = sanitizerMethods(this);
    this.prompter = prompterMethods(this);
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

export default new Prompt();
