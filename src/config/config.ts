import { ConfigFile } from "./configfile.model";
import { configlocal } from "./config.local"
import { configdocker } from "./config.docker"

export function config(): ConfigFile {
    switch(process.env.NODE_ENV){
        case 'local':
            return configlocal;
        default:
            return configdocker;
    }
};