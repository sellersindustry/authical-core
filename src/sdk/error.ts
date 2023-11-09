import { Email } from "../model/primitive";
import { UserID } from "../model/profile";

export class AuthicalError extends Error {

    status: number;
    user: UserID | Email | undefined;
    log: string;

    constructor(message?:string, status?:number, note?:string, user?:UserID|Email) {
        super(message ? message : "Error");
        this.status = status ? status : 500;
        this.user   = user   ? user   : undefined;
        this.log    = note   ? note   : "";
        Object.setPrototypeOf(this, AuthicalError.prototype);
    }

}
