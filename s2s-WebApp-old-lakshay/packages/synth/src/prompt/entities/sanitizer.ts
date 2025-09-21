import endpoints from "../endpoints";

export default (client: any) => {
  return {
    sanitize: (req: { prompt: string }) => {
      const { SANITIZE } = endpoints;
      return client
        .authenticatedPost(`${client._endpoint(SANITIZE)}`, req)
        .then((response: any) => response);
    },
  };
};
