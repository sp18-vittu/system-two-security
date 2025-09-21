declare const _default: (client: any) => {
    prompt: (req: {
        user: string;
        query: string;
        summarize: boolean;
    }) => any;
    uploadPdf: (req: {
        metadata: any;
        file: any;
    }) => any;
};
export default _default;
