import endpoints from "../endpoints";
import Base from "../base";
import { response } from "../interfaces/common";

export default (client: any) => {
  return {
    signIn: (credentials: any) => {
      const { SIGIN } = endpoints;
      return Base.post(`${client._endpoint(SIGIN)}`, credentials).then(
        (response: response) => response
      );
    },
    signUp: (userData: any) => {
      const { SIGNUP } = endpoints;
      return Base.post(client._endpoint(SIGNUP), userData).then(
        (response: response) => response
      );
    },
    passwordReset: (email: any) => {
      const { PASSWORDRESET } = endpoints;
      return Base.post(client._endpoint(PASSWORDRESET), email).then(
        (response: response) => response
      );
    },
  };
};
