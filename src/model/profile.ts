import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";
import { Base64Image, Email, Secret, Timestamp } from "./primitive";

export type UserID  = string;
export type Profile = {
    id?:UserID;
    avatar:Base64Image;
    isAdmin?:boolean;
    name: {
        first:string;
        last:string;
    };
    email: {
        primary:Email;
        active:Email[];
        pending?:{
            email:Email;
            secret?:Secret;
            updated:Timestamp;
        }[];
        previous?:{
            email:Email;
            updated:Timestamp;
        }[];
    };
    metadata:any;
}
export type ProfileStrictID = Profile & {
    id:UserID;
}


// @ts-ignore
const schema:JSONSchemaType<Profile> = {
    type: "object",
    properties: {
        name: {
            type: "object",
            properties: {
                first: { type: "string" },
                last: { type: "string" },
            },
            required: [ "first", "last" ]
        },
        avatar: { type: "string" },
        email: {
            type: "object",
            properties: {
                primary: { type: "string", format: "email" },
                active: {
                    type: "array",
                    items: {
                        type: "string",
                        format: "email"
                    },
                    minItems: 1,
                    maxItems: 5
                },
                pending: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            email: { type: "string", format: "email" },
                            secret: { type: "string" },
                            updated: { type: "string" }
                        },
                        required: [ "email", "updated" ]
                    }
                },
                previous: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            email: { type: "string", format: "email" },
                            updated: { type: "string" }
                        },
                        required: [ "email", "updated" ]
                    }
                },
            },
            required: [ "primary", "active" ]
        },
        metadata: {
            type: "object",
            additionalProperties: true
        }
    },
    required: [ "name", "avatar", "email" ],
    additionalProperties: false
};


export const ProfileValidator = addFormats(new Ajv({ allErrors:true })).compile(schema);

