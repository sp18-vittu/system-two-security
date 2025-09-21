import endpoints from "../endpoints";
import Base from "../base";
import { response } from "../interfaces/common";

export default (client: any) => {
  return {
    sendPrompt: (req: { query: string }) => {
      const { PROMT } = endpoints;
      return Base.get(`${client._endpoint(PROMT)}`, req).then(
        (res: response) => res
      );
    },
  };
};
