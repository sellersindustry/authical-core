import { Email } from "../model/primitive";

export abstract class InterfaceEmail {
    abstract connect():Promise<void>|void;
    abstract send(email:Email, title:string, body:string):Promise<void>|void;
}
