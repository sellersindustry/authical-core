import { Secret, Timestamp } from "./primitive";
import { UserID } from "./profile";

export type SessionID = string;
export type Bearer    = string;
export type Device = {
    ip:string;
    location?:string;
    os:string;
    browser:string;
}

export type Session = {
    id?:SessionID;
    user:UserID;
    secret?:Secret;
    device:Device;
    updated:Timestamp;
    created:Timestamp;
}
export type SessionStrictID = Session & {
    id:SessionID;
}
