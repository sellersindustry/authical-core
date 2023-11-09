import { LocalStorage } from "ttl-localstorage";
import { API, Permission } from "../api";
import { ClientSDKConfig } from "./model";
import { Branding, Settings } from "../../model/settings";
import { Email, Secret, UrlPath } from "../../model/primitive";
import { Bearer, Session, SessionID } from "../../model/session";
import { Profile, UserID } from "../../model/profile";
import { Utility } from "../utility";
import { OTPID } from "../../model/otp";
import { Log } from "../../model/log";
import { Token, TokenID, TokenStrictID, TokenStrictSecretAndID } from "../../model/token";


export class ClientSDK {

    api:API;
    config:ClientSDKConfig;
    branding:Branding|undefined;

    constructor (config:ClientSDKConfig) {
        this.config = config;
        this.api = new API(
            config.authicalServerURL,
            this.Auth.active,
            this.Cache.getBearer,
            this.Profile.isAdmin
        );
        this.branding = config.organization;
    }


    Auth = {
        requestSignIn: async (email:Email):Promise<void> => {
            if (await this.Auth.active(true))
                throw new Error("User is already signed in");
            let otpID = (await this.api.post("/auth/request", Permission.NONE, { email: email })).otpID;
            this.Cache.setAuthReqEmail(email);
            this.Cache.setAuthReqOTPID(otpID);
        },
        verifySignIn: async (secret:Secret):Promise<void> => {
            let email = this.Cache.getAuthReqEmail();
            let otpID = this.Cache.getAuthReqOTPID();
            if (email == undefined || otpID == undefined)
                throw new Error("Authical - No Pending Auth Request");
            this.Cache.setBearer((await this.api.post("/auth/verify", Permission.NONE, {
                otpID: otpID,
                email: email,
                secret: secret
            })).bearer);
            this.Cache.setAuthReqEmail(undefined);
            this.Cache.setAuthReqOTPID(undefined);
        },
        logout: async () => {
            await this.Session.revolk();
        },
        active: async (doNothingOnNotActive?:true):Promise<boolean> => {
            if (this.Cache.isActive())
                return true;
            try {
                if (!this.Cache.hasBearer())
                    throw new Error("No Bearer");
                await this.api.process("POST", "/session", Permission.USER_BASIC, undefined, true);
                this.Cache.setActive();
                return true;
            } catch {
                if (!doNothingOnNotActive) {
                    this.Cache.clear();
                    this.redirect(this.config.paths?.signIn);
                }
            }
            return false;
        },
        getBearer: ():Bearer|undefined => {
            try {
                return this.Cache.getBearer();
            } catch {
                return undefined;
            }
        }
    };


    Session = {
        get:async (sessionID?:SessionID):Promise<Session> => {
            let id = sessionID ? sessionID : this.Cache.getSessionID();
            return (await this.api.get(`/session/${id}`, Permission.USER_BASIC)) as Session;
        },
        revolk:async (sessionID?:SessionID):Promise<void> => {
            let id = sessionID ? sessionID : this.Cache.getSessionID();
            try {
                await this.api.delete(`/session/${id}`, Permission.USER_BASIC);
            } catch { /* empty */ }
            if (id == this.Cache.getSessionID()) {
                this.Cache.logout();
            }
        },
        refresh:async ():Promise<void> => {
            if (this.Cache.hasBearer())
                await this.api.post("/session", Permission.USER_BASIC);
        },
        getAll:async ():Promise<Session[]> => {
            return (await this.api.get("/session/all", Permission.USER_BASIC)) as Session[];
        },
        revolkAll:async ():Promise<void> => {
            await this.api.delete("/session/all", Permission.USER_BASIC);
            this.Cache.logout();
        },
        getCurrentID:():SessionID => {
            return this.Cache.getSessionID();
        }
    };


    Profile = {
        get:async ():Promise<Profile> => {
            let profile = this.Cache.getProfile();
            if (!profile) {
                profile = await this.api.get("/profile", Permission.USER_BASIC);
                this.Cache.setProfile(profile);
            }
            return profile as Profile;
        },
        set:async (profile:Profile):Promise<void> => {
            this.Cache.setProfile(undefined);
            await this.api.post("/profile", Permission.USER_BASIC, profile);
        },
        delete:async ():Promise<void> => {
            await this.api.delete("/profile", Permission.USER_BASIC);
            this.Cache.logout();
        },
        setPrimaryEmail:async (email:Email):Promise<void> => {
            this.Cache.setProfile(undefined);
            await this.api.post(`/profile/email/${email}/primary`, Permission.USER_BASIC);
        },
        addEmail:async (email:Email):Promise<void> => {
            this.Cache.setProfile(undefined);
            await this.api.post(`/profile/email/${email}`, Permission.USER_BASIC);
        },
        removeEmail:async (email:Email):Promise<void> => {
            this.Cache.setProfile(undefined);
            await this.api.delete(`/profile/email/${email}`, Permission.USER_BASIC);
        },
        verifyEmail: async (userID:UserID, secret:Secret):Promise<void> => {
            this.Cache.setProfile(undefined);
            await this.api.post(`/profile/email/${userID}/verify`, Permission.NONE, {
                userID: userID,
                secret: secret
            });
        },
        isAdmin: async ():Promise<boolean> => {
            return (await this.Profile.get()).isAdmin ? true : false;
        }
    };


    User = {
        get:async (user:UserID|Email):Promise<Profile> => {
            return await this.api.get(`/user/${user}`, Permission.USER_BASIC);
        }
    };


    Admin = {
        Settings: {
            get:async():Promise<Settings> => {
                return await this.api.get("/admin/settings", Permission.USER_ADMIN);
            },
            set:async(settings:Settings):Promise<void> => {
                await this.api.post("/admin/settings", Permission.USER_ADMIN, settings);
            }
        },
        User: {
            get:async(user:UserID|Email):Promise<Profile> => {
                return await this.api.get(`/admin/user/${user}`, Permission.USER_ADMIN);
            },
            set:async(user:UserID|Email, profile:Profile):Promise<void> => {
                await this.api.post(`/admin/user/${user}`, Permission.USER_ADMIN, profile);
            },
            delete:async(user:UserID|Email):Promise<void> => {
                await this.api.delete(`/admin/user/${user}`, Permission.USER_ADMIN);
            }
        },
        Log: {
            get:async(page:number):Promise<Log[]> => {
                return await this.api.get(`/admin/log?page=${page}`, Permission.USER_ADMIN);
            }
        },
        Token: {
            get:async(tokenID:TokenID):Promise<TokenStrictID> => {
                return await this.api.get(`/admin/token/${tokenID}`, Permission.USER_ADMIN);
            },
            delete:async(tokenID:TokenID):Promise<void> => {
                await this.api.delete(`/admin/token/${tokenID}`, Permission.USER_ADMIN);
            },
            add:async(token:Token):Promise<TokenStrictSecretAndID> => {
                return await this.api.post("/admin/token", Permission.USER_ADMIN, token);
            },
            getAll:async():Promise<TokenStrictID[]> => {
                return await this.api.get("/admin/token", Permission.USER_ADMIN);
            }
        },
        Session: {
            verify:async(bearer:Bearer):Promise<undefined|[UserID, SessionID]> => {
                return await this.api.post("/admin/session/verify", Permission.USER_ADMIN, { "bearer": bearer });
            }
        }
    };



    private Cache = {
        KEY: {
            BEARER:         "authical:bearer",
            USER_ID:        "authical:user",
            SESSION_ID:     "authical:session",
            PROFILE:        "authical:profile",
            IS_ACTIVE:      "authical:active",
            AUTH_REQ_EMAIL: "authical:auth-request-email",
            AUTH_REQ_OTPID: "authical:auth-request-otp",
            BRANDING:       "authical:branding"
        },
        TTL: {
            PROFILE:    180, // 3 minute(s)
            IS_ACTIVE:  60   // 1 minute(s)
        },
        setBranding:(branding:Branding) => {
            LocalStorage.put(this.Cache.KEY.BRANDING, branding);
        },
        hasBranding:():boolean => {
            return LocalStorage.keyExists(this.Cache.KEY.BRANDING);
        },
        getBranding:():Branding => {
            return LocalStorage.get(this.Cache.KEY.BRANDING);
        },
        setBearer:(token:Bearer) => {
            let [, userID, sessionID] = Utility.parseBearer(`Bearer ${token}`);
            LocalStorage.put(this.Cache.KEY.BEARER, token);
            LocalStorage.put(this.Cache.KEY.USER_ID, userID);
            LocalStorage.put(this.Cache.KEY.SESSION_ID, sessionID);
        },
        hasBearer:():boolean => {
            return LocalStorage.keyExists(this.Cache.KEY.BEARER);
        },
        getBearer:():Bearer => {
            let bearer = LocalStorage.get(this.Cache.KEY.BEARER);
            if (bearer == null)
                throw new Error("Authical - Not authenicated"); 
            return bearer;
        },
        getSessionID:():SessionID => {
            let sessionID = LocalStorage.get(this.Cache.KEY.SESSION_ID);
            if (sessionID == null)
                throw new Error("Authical - Not authenicated"); 
            return sessionID;
        },
        getUserID:():UserID => {
            let userID = LocalStorage.get(this.Cache.KEY.USER_ID);
            if (userID == null)
                throw new Error("Authical - Not authenicated");
            return userID;
        },
        setProfile:(profile:Profile|undefined) => {
            if (profile == undefined) {
                LocalStorage.removeKey(this.Cache.KEY.PROFILE);
            } else {
                LocalStorage.put(
                    this.Cache.KEY.PROFILE,
                    profile,
                    this.Cache.TTL.PROFILE
                );
            }
        },
        getProfile:():Profile|undefined => {
            if (!LocalStorage.keyExists(this.Cache.KEY.PROFILE))
                return undefined;
            return LocalStorage.get(this.Cache.KEY.PROFILE);
        },
        setActive:() => {
            LocalStorage.put(
                this.Cache.KEY.IS_ACTIVE,
                new Date(),
                this.Cache.TTL.IS_ACTIVE
            );
        },
        isActive:():boolean => {
            return LocalStorage.keyExists(this.Cache.KEY.IS_ACTIVE);
        },
        getAuthReqEmail:():Email|undefined => {
            if (!LocalStorage.keyExists(this.Cache.KEY.AUTH_REQ_EMAIL))
                return undefined;
            return LocalStorage.get(this.Cache.KEY.AUTH_REQ_EMAIL);
        },
        setAuthReqEmail:(email:Email|undefined) => {
            if (email == undefined) {
                LocalStorage.removeKey(this.Cache.KEY.AUTH_REQ_EMAIL);
            } else {
                LocalStorage.put(this.Cache.KEY.AUTH_REQ_EMAIL, email);
            }
        },
        getAuthReqOTPID:():OTPID|undefined => {
            if (!LocalStorage.keyExists(this.Cache.KEY.AUTH_REQ_OTPID))
                return undefined;
            return LocalStorage.get(this.Cache.KEY.AUTH_REQ_OTPID);
        },
        setAuthReqOTPID:(optID:OTPID|undefined) => {
            if (optID == undefined) {
                LocalStorage.removeKey(this.Cache.KEY.AUTH_REQ_OTPID);
            } else {
                LocalStorage.put(this.Cache.KEY.AUTH_REQ_OTPID, optID);
            }
        },
        clear:() => {
            LocalStorage.removeKey(this.Cache.KEY.BEARER);
            LocalStorage.removeKey(this.Cache.KEY.SESSION_ID);
            LocalStorage.removeKey(this.Cache.KEY.USER_ID);
            LocalStorage.removeKey(this.Cache.KEY.PROFILE);
            LocalStorage.removeKey(this.Cache.KEY.IS_ACTIVE);
            LocalStorage.removeKey(this.Cache.KEY.AUTH_REQ_EMAIL);
            LocalStorage.removeKey(this.Cache.KEY.AUTH_REQ_OTPID);
        },
        logout:() => {
            this.Cache.clear();
            this.redirect(this.config.paths?.onSignOut);
        }
    };


    private redirect(path:UrlPath|undefined) {
        if (path) {
            try {
                if (window && window.location)
                    window.location.href = path;
            } catch {
                return;
            }
        }
    }

}

