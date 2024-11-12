import { ConfigFile } from "./configfile.model";

export const configp360: ConfigFile = {
    app: {
        port: 8080,
        dbRequestTimeout: 60000
    },
    stardog: {
        host: '10.60.24.213',
        port: 5820,
        path: '/ontorest/query',
        auth: 'Basic ' + Buffer.from('admin:admin').toString('base64')
    },
    tripleStores: {
      KGEFuseki: {
        host: '10.60.24.207',
        protocol: 'http',
        serviceHost: "10.60.24.207",
        port: 3030,
        auth: 'Basic ' + Buffer.from('admin:bayer2000').toString('base64'),
        type: "fuseki",
        paths: [
          { dbpath: "/kgeTest/query", name: "kgeTest" }
        ]
      },      
      ReleasedOntologiesFuseki: {
        host: '10.60.24.207',
        protocol: 'http',
        serviceHost: "10.60.24.207",
        port: 3030,
        auth: 'Basic ' + Buffer.from('admin:bayer2000').toString('base64'),
        type: "fuseki",
        paths: [
          { dbpath: "/eco/query", name: "eco" }
        ]
      },
      RealFinderFuseki: {
        host: '10.60.24.207',
        protocol: 'http',
        serviceHost: "10.60.24.207",
        port: 3030,
        auth: 'Basic ' + Buffer.from('admin:bayer2000').toString('base64'),
        type: "fuseki",
        paths: [
          { dbpath: "/realFinder/query", name: "realFinder" }
        ]
      },
      colidNeptune: {
            protocol: 'https',
            host: 'neptune-pid-ro.prod.daaa.cloud',
            serviceHost: 'neptune-pid-ro.prod.daaa.cloud',
            port: 443,
            user: "",
            password: "",
            auth: '',
            type: "neptune",
            paths: [
              { dbpath: "/sparql", name: "colid" }
            ]
          },
      StardogEU: {
        host: '10.60.24.213',
        protocol: 'http',
        serviceHost: "10.60.24.213",
        port: 5820,
        user: "admin",
        password: "admin",
        auth: 'Basic ' + Buffer.from('admin:admin').toString('base64'),
        type: "stardog",
        paths: [
          { dbpath: "/ontorest/query", name: "ontorest" },
          { dbpath: "/eco/query", name: "eco" },
          { dbpath: "/rdo/query", name: "rdo" },
          { dbpath: "/realFinder/query", name: "realFinder" }
        ]
      }
    },
    redisConfig: {
      host: "localhost",
      port: 6379,
      user: "",
      password: ""
    },
    colidGraph : "https://pid.bayer.com/graph/resource/4.1"
}
