import { ConfigFile } from "./configfile.model";

export const configdev: ConfigFile = {
    app: {
        port: 8080,
        dbRequestTimeout: 60000
    },
    stardog: {
        host: '10.122.106.22',
        port: 5820,
        path: '/ontorest/query',
        auth: 'Basic ' + Buffer.from('admin:admin').toString('base64')
    },
    tripleStores: {
          colidNeptune: {
            protocol: 'https',
            host: 'shared-dev.cluster-ro-clkxocnefgsi.eu-central-1.neptune.amazonaws.com',
            serviceHost: 'shared-dev.cluster-ro-clkxocnefgsi.eu-central-1.neptune.amazonaws.com',
            port: 8182,
            user: "",
            password: "",
            auth: '',
            type: "neptune",
            paths: [
              { dbpath: "/sparql", name: "colid" }
            ]
          },
          KGEConfigDB: {
            host: 'backbone-alb-240639479.eu-central-1.elb.amazonaws.com',
            protocol: 'https',
            serviceHost: 'backbone-alb-240639479.eu-central-1.elb.amazonaws.com',
            port: 5821,
            auth: 'Basic ' + Buffer.from('admin:379c130ab7aee6ec').toString('base64'),
            type: "stardog",
            paths: [
              { dbpath: "/kgeConfiguration/query", name: "kgeConfiguration" }
            ],
            path: "/kgeConfiguration/query",
            updatePath: "/kgeConfiguration/update"
          },
          StardogAdminDB:{
            host: 'backbone-alb-240639479.eu-central-1.elb.amazonaws.com',
            protocol: 'https',
            serviceHost: 'backbone-alb-240639479.eu-central-1.elb.amazonaws.com',
            port: 5821,
            auth: 'Basic ' + Buffer.from('admin:379c130ab7aee6ec').toString('base64'),
            type: "stardog",
            paths: [
              { dbpath: "/admin", name: "stardogAdmin" }
            ],
            path: "/admin",
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
