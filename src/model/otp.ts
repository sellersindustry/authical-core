import { Email, Secret, Timestamp } from "./primitive";

export type OTPID = string;
export type OTP = {
    id:OTPID;
    email:Email;
    secret:Secret;
    attempts:number;
    created:Timestamp;
}
