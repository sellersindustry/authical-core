import { API, Permission } from "../api";
import { MachineSDKConfig } from "./model";
import { Settings } from "../../model/settings";
import { Email } from "../../model/primitive";
import { Profile, UserID } from "../../model/profile";
import { Utility } from "../utility";
import { Log } from "../../model/log";
import { Bearer, SessionID } from "../../model/session";


export class MachineSDK {

    api:API;
    bearer:string;
    config:MachineSDKConfig;

    constructor (config:MachineSDKConfig) {
        this.config = config;
        this.bearer = Utility.generateMachineBearer(config.tokenID, config.secret);
        this.api = new API(
            config.authicalServerURL,
            async () => { return await true; },
            () => { return this.bearer; },
            async () => { return await true; },
        );
    }


    Settings = {
        get:async():Promise<Settings> => {
            return await this.api.get("/admin/settings", Permission.USER_ADMIN);
        },
        set:async(settings:Settings):Promise<void> => {
            await this.api.post("/admin/settings", Permission.USER_ADMIN, settings);
        }
    };


    User = {
        get:async(user:UserID|Email):Promise<Profile> => {
            return await this.api.get(`/admin/user/${user}`, Permission.USER_ADMIN);
        },
        set:async(user:UserID|Email, profile:Profile):Promise<void> => {
            await this.api.post(`/admin/user/${user}`, Permission.USER_ADMIN, profile);
        },
        delete:async(user:UserID|Email):Promise<void> => {
            await this.api.delete(`/admin/user/${user}`, Permission.USER_ADMIN);
        }
    };


    Session = {
        verify:async(bearer:Bearer|null):Promise<undefined|{ user:UserID, session:SessionID }> => {
            if (!bearer) return undefined;
            return await this.api.post("/admin/session/verify", Permission.USER_ADMIN, { "bearer": bearer });
        }
    };


    Log = {
        get:async(page:number):Promise<Log[]> => {
            return await this.api.get(`/admin/log?page=${page}`, Permission.USER_ADMIN);
        }
    };


}

