import { response } from "../interfaces/common";
declare const _default: (client: any) => {
    sendPrompt: (req: {
        query: string;
    }) => Promise<response>;
};
export default _default;
