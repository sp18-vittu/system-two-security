declare const _default: (client: any) => {
    load: (req: {
        id: string;
    }) => any;
    loadAll: (req: {
        search: string;
    }) => any;
    createConnector: (req: {
        search: string;
    }) => any;
    getModules: (req: {
        search: string;
    }) => any;
    importModule: (req: any) => any;
    executeFlow: (req: any) => any;
    getDocuments: (req: any) => any;
};
export default _default;
