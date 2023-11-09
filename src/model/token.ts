import { Secret } from "./primitive";

export type TokenID = string;
export type Token = {
    id?:TokenID;
    secret?:Secret;
    description:string;
}
export type TokenStrictID = Token & {
    id:TokenID;
}
export type TokenStrictSecret = Token & {
    secret:Secret;
}
export type TokenStrictSecretAndID = Token & {
    id:TokenID;
    secret:Secret;
}