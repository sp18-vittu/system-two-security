import endpoints from "../endpoints";

export default (client: any) => {
  return {
    load: (req: { id: string }) => {
      const { MESSAGES } = endpoints;
      return client
        .authenticatedGet(`${client._endpoint(MESSAGES)}/${req.id}`)
        .then((response: any) => response);
    },
    loadAll: (req: { search: string }) => {
      const { MESSAGES } = endpoints;
      return client
        .authenticatedGet(client._endpoint(MESSAGES), req)
        .then((response: any) => response);
    },
  };
};
