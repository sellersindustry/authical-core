import { Log } from "../model/log";

export abstract class InterfaceLog {
    abstract connect():Promise<void>|void;
    abstract log(event:string, message:string):Promise<void>|void;
    abstract get(pageNum:number, pageSize:number):Promise<Log[]>
}
