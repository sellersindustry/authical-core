import { Secret, Timestamp } from "../model/primitive";
import { UserID } from "../model/profile";
import { Bearer, SessionID } from "../model/session";
import { TokenID } from "../model/token";
import { AuthicalError } from "./error";
import { relativeTimeEn } from "time-ago-lite";


const INVALID_BEARER_MSG = "Invalid Authenication - Malformed bearer";


export class Utility {


    static timeago(timestamp:Timestamp):string {
        return relativeTimeEn(new Date(timestamp));
    }


    static generateUserBearer(userID:UserID, sessionID:SessionID, secret:Secret):string {
        return btoa(`USER:${userID}:${sessionID}:${secret}`);
    }


    static generateMachineBearer(tokenID:TokenID, secret:Secret):string {
        return btoa(`MACHINE:${tokenID}:${secret}`);
    }


    static parseBearer(bearer:Bearer|null|undefined):["USER", UserID, SessionID, Secret]|["MACHINE", TokenID, Secret] {
        if (!bearer || !bearer.startsWith("Bearer "))
            throw new AuthicalError(INVALID_BEARER_MSG, 401, "Missing Prepended \"Bearer \"");
        let sections = atob(bearer.split(" ")[1] as string).split(":");
        if (sections[0] == "USER") {
            if (sections.length != 4)
                throw new AuthicalError(INVALID_BEARER_MSG, 401, "Sections");
            return [
                "USER",
                sections[1] as UserID,
                sections[2] as SessionID,
                sections[3] as Secret,
            ];
        }
        if (sections[0] == "MACHINE") {
            if (sections.length != 3)
                throw new AuthicalError(INVALID_BEARER_MSG, 401, "Sections");
            return [
                "MACHINE",
                sections[1] as TokenID,
                sections[2] as Secret,
            ];
        }
        throw new AuthicalError(INVALID_BEARER_MSG, 401, "Not User or Machine");
    }


    static copyObject(json:any):any {
        return JSON.parse(JSON.stringify(json));
    }


}

