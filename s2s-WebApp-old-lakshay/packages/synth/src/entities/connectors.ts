import endpoints from "../endpoints";

export default (client: any) => {
  return {
    load: (req: { id: string }) => {
      const { CONNECTORS } = endpoints;
      return client
        .authenticatedGet(`${client._endpoint(CONNECTORS)}/${req.id}`)
        .then((response: any) => response);
    },
    loadAll: (req: { search: string }) => {
      const { CONNECTORS } = endpoints;
      return client
        .authenticatedGet(client._endpoint(CONNECTORS), req)
        .then((response: any) => response);
    },
    createConnector: (req: { search: string }) => {
      const { CREATE_CONNECTOR } = endpoints;
      return client
        .authenticatedPost(client._endpoint(CREATE_CONNECTOR), req)
        .then((response: any) => response);
    },
    getModules: (req: { search: string }) => {
      const { CONNECTOR_MODULES } = endpoints;
      return client
        .authenticatedPost(client._endpoint(CONNECTOR_MODULES), req)
        .then((response: any) => response);
    },
    importModule: (req: any) => {
      const { IMPORT_CONNECTOR_MODULE } = endpoints;
      return client
        .authenticatedPost(client._endpoint(IMPORT_CONNECTOR_MODULE), req)
        .then((response: any) => response);
    },
    executeFlow: (req: any) => {
      const { EXECUTE_CONNECTOR } = endpoints;
      return client
        .authenticatedPost(client._endpoint(EXECUTE_CONNECTOR), req)
        .then((response: any) => response);
    },
    getDocuments: (req: any) => {
      const { LOAD_DOCUMENTS } = endpoints;
      return client
        .authenticatedGet(
          `${client._endpoint(LOAD_DOCUMENTS)}/${req}/documents`,
          req
        )
        .then((response: any) => response);
    },
  };
};
