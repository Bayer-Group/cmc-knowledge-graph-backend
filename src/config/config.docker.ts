import { ConfigFile } from "./configfile.model";

export const configdocker: ConfigFile = {
  app: {
    port: 9090,
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
    host: 'fuseki',
    protocol: 'http',
    serviceHost: "fuseki",
    port: 3030,
    auth: 'Basic ' + Buffer.from('admin:admin').toString('base64'),
    type: "fuseki",
    paths: [
      { dbpath: "/cmc-dataset/query", name: "cmc-dataset" }
    ],
    path: "/cmc-dataset/query",
    updatePath: "/cmc-dataset/update"
  },
  StardogAdminDB:{
    host: 'fuseki',
    protocol: 'http',
    serviceHost: "fuseki",
    port: 3030,
    auth: 'Basic ' + Buffer.from('admin:admin').toString('base64'),
    type: "fuseki",
    paths: [
      { dbpath: "/cmc-dataset/query", name: "cmc-dataset" }
    ],
    path: "/cmc-dataset/query",
    updatePath: "/cmc-dataset/update"
  }
},
redisConfig: {
  host: "localhost",
  port: 6379,
  user: "",
  password: ""
},
colidGraph : "https://github.com/Bayer-Group/resource/4.1"
}