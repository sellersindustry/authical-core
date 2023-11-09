import { Timestamp } from "./primitive";

export type Log = {
    event:string;
    message:string;
    timestamp:Timestamp;
}