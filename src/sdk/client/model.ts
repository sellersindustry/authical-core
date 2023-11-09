import { UrlPath } from "../../model/primitive";
import { Branding } from "../../model/settings";

export type ClientSDKConfig = {
    authicalServerURL:UrlPath;
    paths?:{
        onSignIn:UrlPath;
        onSignOut:UrlPath;
        signIn:UrlPath;
    };
    organization?:Branding;
};
