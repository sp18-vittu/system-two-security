import endpoints from "../endpoints";

export default (client: any) => {
  return {
    prompt: (req: { user: string; query: string; summarize: boolean }) => {
      const { PROMPT } = endpoints;
      return client
        .authenticatedPost(`${client._endpoint(PROMPT)}`, req)
        .then((response: any) => response);
    },
    uploadPdf: (req: { metadata: any; file: any }) => {
      const { UPLOAD_PDF } = endpoints;
      return client
        .authenticatedPost(`${client._endpoint(UPLOAD_PDF)}`, req, {
          "Content-Type": "multipart/form-data",
        })
        .then((response: any) => response);
    },
  };
};
