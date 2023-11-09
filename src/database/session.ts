import { UserID } from "../model/profile";
import { Session, SessionID, SessionStrictID } from "../model/session";

export abstract class DatabaseSession {
    abstract connect():Promise<void>|void;
    abstract set(sessionID:SessionID, data:Session, ttl:number):Promise<void>|void;
    abstract patch(sessionID:SessionID, data:Session, ttl:number):Promise<void>|void;
    abstract get(sessionID:SessionID):Promise<SessionStrictID|undefined>;
    abstract del(sessionID:SessionID):Promise<void>|void;
    abstract getAllByUserID(userID:UserID):Promise<SessionStrictID[]>;
}
