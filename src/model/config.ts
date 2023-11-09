import { JSONSchemaType } from "ajv";
import { InterfaceEmail } from "../interface/email";
import { InterfaceLog } from "../interface/log";
import { DatabaseOTP } from "../database/otp";
import { DatabaseProfile } from "../database/profile";
import { DatabaseSession } from "../database/session";
import { DatabaseSettings } from "../database/settings";
import { DatabaseToken } from "../database/token";
import { Email, Secret, UrlPath } from "./primitive";
import { UserID } from "./profile";

export type Config = {
    admins:Email[];
    applicationHomePage: UrlPath;
    database: {
        otp:DatabaseOTP;
        profile:DatabaseProfile;
        session:DatabaseSession;
        settings:DatabaseSettings;
        token:DatabaseToken;
    };
    interface: {
        log:InterfaceLog;
        email:InterfaceEmail;
    };
    standin?: {
        isValidEmail?:(email:Email) => Promise<boolean>|boolean;
        generateOTP?:() => Promise<Secret>|Secret;
    };
    hooks?: {
        onAccountCreated?:(userID:UserID) => Promise<void>|void;
        onAccountUpdated?:(userID:UserID) => Promise<void>|void;
        onAccountDeleted?:(userID:UserID) => Promise<void>|void;
    };
    metadata?:JSONSchemaType<any>;
}
