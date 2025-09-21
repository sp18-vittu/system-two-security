import { response } from "../interfaces/common";
declare const _default: (client: any) => {
    signIn: (credentials: any) => Promise<response>;
    signUp: (userData: any) => Promise<response>;
    passwordReset: (email: any) => Promise<response>;
};
export default _default;
