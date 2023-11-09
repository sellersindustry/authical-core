import { Settings } from "../model/settings";

export abstract class DatabaseSettings {
    abstract connect():Promise<void>;
    abstract get():Promise<Settings|undefined>;
    abstract set(settings:Settings):Promise<void>;
}
