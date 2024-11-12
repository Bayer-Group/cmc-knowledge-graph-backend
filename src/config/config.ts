import { ConfigFile } from "./configfile.model";
import { configlocal } from "./config.local"
import { configdev } from "./config.development"
import { configqa } from "./config.release"
import { configprod } from "./config.production"
import { configcos } from "./config.coskun"
import { configp360 } from "./config.p360"

export function config(): ConfigFile {
    switch(process.env.NODE_ENV){
        case 'development':
            return configdev;
        case 'release':
            return configqa;
        case 'production':
            return configprod;
        case 'coskun':
            return configcos;
        case 'p360':
            return configp360;
        default:
            return configlocal;
    }
};