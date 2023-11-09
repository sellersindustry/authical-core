import { TokenID, TokenStrictSecret, TokenStrictSecretAndID } from "../model/token";

export abstract class DatabaseToken {
    abstract connect():Promise<void>;
    abstract get(id:TokenID):Promise<TokenStrictSecretAndID|undefined>;
    abstract add(id:TokenID, token:TokenStrictSecret):Promise<void>;
    abstract del(id:TokenID):Promise<void>;
    abstract getAll():Promise<TokenStrictSecretAndID[]>;
}
