import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";
import { Base64Image, Email, HexColor, UrlPath } from "./primitive";


const REGEX_HEX_COLOR = "^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$";


export type Branding = {
    product: string;
    company: string;
    logo: UrlPath;
    theme: {
        light: {
            primaryBackground: HexColor;
            primaryForeground: HexColor;
            secondaryBackground: HexColor;
            secondaryForeground: HexColor;
        };
        dark: {
            primaryBackground: HexColor;
            primaryForeground: HexColor;
            secondaryBackground: HexColor;
            secondaryForeground: HexColor;
        };
    };
    authicalBranding: boolean;
};


export type Settings = {
    branding: Branding;
    admins: Email[];
    account: {
        whitelist: {
            enable: boolean;
            emails: Email[];
        };
        blacklist: {
            enable: boolean;
            emails: Email[];
        };
        ttl: {
            otp: number;
            session: number;
            pendingEmail: number;
        };
        maxLoginAttempts: number;
        defaultAvatar: Base64Image;
    };
    emailTemplates: {
        signup: {
            title:string;
            body:string;
        };
        signin: {
            title:string;
            body:string;
        };
        approveNewEmail: {
            title:string;
            body:string;
        };
        removeEmail: {
            title:string;
            body:string;
        };
        changePrimaryEmail: {
            title:string;
            body:string;
        };
    };
}


// @ts-ignore
const schema:JSONSchemaType<Settings> = {
    type: "object",
    properties: {
        branding: {
            type: "object",
            properties: {
                product: { type: "string" },
                company: { type: "string" },
                logo: { type: "string" },
                authicalBranding: { type: "boolean" },
                theme: {
                    type: "object",
                    properties: {
                        light: {
                            type: "object",
                            properties: {
                                primaryBackground: { type: "string", pattern: REGEX_HEX_COLOR },
                                primaryForeground: { type: "string", pattern: REGEX_HEX_COLOR },
                                secondaryBackground: { type: "string", pattern: REGEX_HEX_COLOR },
                                secondaryForeground: { type: "string", pattern: REGEX_HEX_COLOR },
                            },
                            required: [ "primaryBackground", "primaryForeground", "secondaryBackground", "secondaryForeground" ]
                        },
                        dark: {
                            type: "object",
                            properties: {
                                primaryBackground: { type: "string", pattern: REGEX_HEX_COLOR },
                                primaryForeground: { type: "string", pattern: REGEX_HEX_COLOR },
                                secondaryBackground: { type: "string", pattern: REGEX_HEX_COLOR },
                                secondaryForeground: { type: "string", pattern: REGEX_HEX_COLOR },
                            },
                            required: [ "primaryBackground", "primaryForeground", "secondaryBackground", "secondaryForeground" ]
                        }
                    }
                }
            },
            required: [ "product", "company", "logo", "authicalBranding", "theme" ]
        },
        admins: {
            type: "array",
            items: {
                type: "string",
                format: "email"
            }
        },
        account: {
            type: "object",
            properties: {
                whitelist: {
                    type: "object",
                    properties: {
                        enable: { type: "boolean" },
                        emails: {
                            type: "array",
                            items: {
                                type: "string",
                                format: "email"
                            }
                        }
                    },
                    required: [ "emails", "enable" ]
                },
                blacklist: {
                    type: "object",
                    properties: {
                        enable: { type: "boolean" },
                        emails: {
                            type: "array",
                            items: {
                                type: "string",
                                format: "email"
                            }
                        }
                    },
                    required: [ "emails", "enable" ]
                },
                ttl: {
                    type: "object",
                    properties: {
                        otp: { type: "number", minimum: 60 },
                        session: { type: "number", minimum: 60 },
                        pendingEmail: { type: "number", minimum: 60 }
                    },
                    required: [ "otp", "session", "pendingEmail" ]
                },
                maxLoginAttempts: { type: "number", minimum: 1 },
                defaultAvatar: { type: "string" }
            },
            required: [ "whitelist", "blacklist", "ttl", "maxLoginAttempts", "defaultAvatar" ]
        },
        emailTemplates: {
            type: "object",
            properties: {
                signup: {
                    type: "object",
                    properties: {
                        title: { type: "string", maxLength: 70 },
                        body: { type: "string" }
                    },
                    required: [ "title", "body" ]
                },
                signin: {
                    type: "object",
                    properties: {
                        title: { type: "string", maxLength: 70 },
                        body: { type: "string" }
                    },
                    required: [ "title", "body" ]
                },
                approveNewEmail: {
                    type: "object",
                    properties: {
                        title: { type: "string", maxLength: 70 },
                        body: { type: "string" }
                    },
                    required: [ "title", "body" ]
                },
                removeEmail: {
                    type: "object",
                    properties: {
                        title: { type: "string", maxLength: 70 },
                        body: { type: "string" }
                    },
                    required: [ "title", "body" ]
                },
                changePrimaryEmail: {
                    type: "object",
                    properties: {
                        title: { type: "string", maxLength: 70 },
                        body: { type: "string" }
                    },
                    required: [ "title", "body" ]
                }
            },
            required: [ "signup", "signin", "approveNewEmail", "removeEmail", "changePrimaryEmail" ]
        }
    },
    required: [ "branding", "admins", "account", "emailTemplates" ],
    additionalProperties: false
};


export const SettingsValidator = addFormats(new Ajv({ allErrors:true })).compile(schema);
