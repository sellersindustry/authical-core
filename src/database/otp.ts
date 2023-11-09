import { OTP } from "../model/otp";
import { UserID } from "../model/profile";

export abstract class DatabaseOTP {
    abstract connect():Promise<void>|void;
    abstract set(userID:UserID, otp:OTP, ttl:number):Promise<void>|void;
    abstract patch(userID:UserID, otp:OTP):Promise<void>|void;
    abstract get(userID:UserID):Promise<OTP|undefined>;
    abstract del(userID:UserID):Promise<void>|void;
}
