import { Settings } from "../model/settings";
import { title as SignupTitle, body as SignupBody } from "./assets/signup";
import { title as SigninTitle, body as SigninBody } from "./assets/signin";
import { title as PrimaryTitle, body as PrimaryBody } from "./assets/primary";
import { title as RemoveTitle, body as RemoveBody } from "./assets/remove";
import { title as ApproveTitle, body as ApproveBody } from "./assets/approve";
import { avatar } from "./assets/avatar";


export const DefaultSettings:Settings = {
    branding: {
        product: "Authical",
        company: "Sellers LLC",
        logo: "https://dummyimage.com/128x128/0475FF/FFFFFF/?text=%20%20Authical%20",
        theme: {
            light: {
                primaryBackground: "#148FF5",
                primaryForeground: "#FFFFFF",
                secondaryBackground: "#000000",
                secondaryForeground: "#FFFFFF"
            },
            dark: {
                primaryBackground: "#148FF5",
                primaryForeground: "#FFFFFF",
                secondaryBackground: "#FFFFFF",
                secondaryForeground: "#000000"
            }
        },
        authicalBranding: true,
    },
    admins: [],
    account: {
        whitelist: {
            enable: false,
            emails: []
        },
        blacklist: {
            enable: false,
            emails: []
        },
        ttl: {
            otp: 60*10,            // 10 minutes
            session: 60*60*24*24,  // 24 days
            pendingEmail: 60*60*24 // 24 hours
        },
        maxLoginAttempts: 3,
        defaultAvatar: avatar
    },
    emailTemplates: {
        signup: {
            title: SignupTitle,
            body: SignupBody
        },
        signin: {
            title: SigninTitle,
            body: SigninBody
        },
        approveNewEmail: {
            title: ApproveTitle,
            body: ApproveBody
        },
        removeEmail: {
            title: RemoveTitle,
            body: RemoveBody
        },
        changePrimaryEmail: {
            title: PrimaryTitle,
            body: PrimaryBody
        }
    }
};

