import { ConfigFile } from "./configfile.model";

export const configcos: ConfigFile = {
    app: {
        port: 8081,
        dbRequestTimeout: 60000
    },
    stardog: {
        host: '10.122.106.22',
        port: 5820,
        path: '/ontorest/query',
        auth: 'Basic ' + Buffer.from('admin:admin').toString('base64')
    },
    tripleStores: {
      KGEConfigDB: {
        host: 'backbone-alb-770778818.eu-central-1.elb.amazonaws.com',
        protocol: 'http',
        serviceHost: "backbone-alb-770778818.eu-central-1.elb.amazonaws.com",
        port: 5820,
        auth: 'Basic ' + Buffer.from('kge:kge2000').toString('base64'),
        type: "stardog",
        paths: [
          { dbpath: "/kgeConfiguration/query", name: "kgeConfiguration" }
        ],
        path: "/kgeConfiguration/query",
      }
    },
    redisConfig: {
      host: "kge-redis-dev-master.pid.svc.cluster.local",
      port: 6379,
      user: "",
      password: ""
    },
    colidGraph : "https://pid.bayer.com/graph/resource/1.5"
}
