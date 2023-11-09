import { Bearer } from "../model/session";

export enum Permission {
    NONE,
    USER_BASIC,
    USER_ADMIN
}

export class API {

    private host:string;
    private isActive: () => Promise<boolean>;
    private getBearer:() => Bearer;
    private isAdmin:  () => Promise<boolean>;


    constructor (
        host:string,
        isActive:() => Promise<boolean>,
        getBearer:() => Bearer,
        isAdmin:() => Promise<boolean>
    ) {
        this.host      = host;
        this.isActive  = isActive;
        this.getBearer = getBearer;
        this.isAdmin   = isAdmin;
    }


    async get(url:string, permission:Permission, body?:object):Promise<any> {
        return await this.process("GET", url, permission, body);
    }


    async post(url:string, permission:Permission, body?:object):Promise<any> {
        return await this.process("POST", url, permission, body);
    }


    async delete(url:string, permission:Permission, body?:object):Promise<any> {
        return await this.process("DELETE", url, permission, body);
    }


    async process(method:string, url:string, permission:Permission, body?:object, disableIsActive?:boolean):Promise<any> {
        if ([Permission.USER_BASIC, Permission.USER_ADMIN].indexOf(permission) != -1) {
            if (disableIsActive != true)
                await this.isActive();
            if (permission == Permission.USER_ADMIN && !(await this.isAdmin()))
                throw new Error("User is not an admin");
        }
        let bearer = this.getBearerSafely();
        let response:Response = await fetch(this.host + url, {
            method: method,
            body: (body) ? JSON.stringify(body) as BodyInit : undefined,
            headers: {
                "Content-Type": "application/json",
                "Authorization": bearer ? `Bearer ${bearer}` : ""
            }
        });
        if (response.status > 199 && response.status < 300) {
            return await this.processBody(response);
        } else {
            throw new Error(await response.text());
        }        
    }


    private async processBody(response:Response):Promise<any> {
        let text:string = await response.text();
        let data:object = {};
        try {
            data = JSON.parse(text);
        } catch {
            data = { "message": text };
        }
        return data;
    }


    private getBearerSafely():Bearer|undefined {
        try {
            return this.getBearer();
        } catch {
            return undefined;
        }
    }

}

