import { Email } from "../model/primitive";
import { Profile, ProfileStrictID, UserID } from "../model/profile";

export abstract class DatabaseProfile {
    abstract connect():Promise<void>|void;
    abstract set(userID:UserID, profile:Profile):Promise<void>|void;
    abstract del(userID:UserID):Promise<void>|void;
    abstract get(userID:UserID):Promise<ProfileStrictID|undefined>;
    abstract getByEmail(email:Email):Promise<ProfileStrictID|undefined>;
    abstract getByEmailPending(email:Email):Promise<ProfileStrictID|undefined>;
}
