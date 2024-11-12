

export class ConfigFile {
    app: AppConfig;
    stardog: Stardog;
    tripleStores: TripleStores;
   // stardogSavedGraph: TripleStore;
    redisConfig: RedisConf;
    colidGraph : string;
}

export class AppConfig {
    port: number;
    dbRequestTimeout: number;
}

export class Stardog {
    host: string;
    port: number;
    path: string;
    auth: string;
}

export class TripleStores {
    [key: string]: TripleStore;
}

export class TripleStore {
    host: string;
    port: number;
    protocol: string;
    serviceHost: string;
    auth?: string;
    user?: string;
    password?: string;
    type: string;
    paths: Path[];
    path?: string;
    updatePath?: string;
}

export class Path {
    dbpath: string;
    name: string;
}

export class RedisConf {
    host: string;
    port: number;
    user: string;
    password: string;
}