import { Secret, UrlPath } from "../../model/primitive";
import { TokenID } from "../../model/token";

export type MachineSDKConfig = {
    authicalServerURL:UrlPath;
    tokenID:TokenID;
    secret:Secret;
};
