import { ClassTableRequest, ClassTableLabelRequest, ClassTableLabelResponse } from "../routes/models/classtable.model";
import { v4 as uuidv4 } from 'uuid';
import TripleStoreConnector from "../connector/triplestore.connector";
import { config } from "../config/config";
import redis from 'redis';
import { promisify } from "util";
import { parseNquads, removeUrlFromString } from "./helpers.service";
import { DbConfig } from "../routes/models/dbconfig.model";
import cons from "../constants/constants";
import { ITripleStoreConnector } from "../connector/triplestore.connector.interface";
import { TripleStore } from "../config/configfile.model";
import { classTableSparql, classTableSparqlFromConfig } from "../connector/sparql/graphdata.sparql";
import logger from "../logger/logger";
import { NquadsString } from "../connector/models/nquadsString.model";

export class ClassTableResponse {
    endpoint: string;
}

export class ClassTableStore {
    sparql: string;
    targetDB: DbConfig;
}

export class ClassTableService {

    private tripleStore: ITripleStoreConnector;
    private requestBodyConfig: DbConfig[];
    private tripleStoreConfig :TripleStore;
    constructor(mTripleStore: TripleStore, mConfig: DbConfig[]) {
        let kgeConfig = [
            {
              dbpath: config().tripleStores.KGEConfigDB.path,
              selectedNamedGraphs: [],
              instance: "KGEConfigDB",
              virtualGraphs: [],
            },]
        this.tripleStore = new TripleStoreConnector(mTripleStore, kgeConfig);
        this.requestBodyConfig = mConfig;
        this.tripleStoreConfig = mTripleStore;

    }

    async getStoredSparqlQuery(uuid: string,host: string, accept: string, page?: string, limit?: string): Promise<any> {
        try {

            let tripleStore = new TripleStoreConnector(this.tripleStoreConfig, this.requestBodyConfig);

            var sparql =  await tripleStore.getTableViewsSparql(host,uuid);
            const parsed = parseNquads(sparql);
            const decodedSelectQry = Buffer.from(parsed[0].o, 'base64').toString('utf8')  
            
            // var selectStr = sparql.substr(sparql.indexOf('PREFIX'));
            // var selectQry= selectStr.substr(0, selectStr.lastIndexOf("\""));
            console.log("sparql", decodedSelectQry);
    
            // if (limit) {
            //     let nLimit: number = +limit; 
            //     sparql += ` LIMIT ${nLimit}`;
            //     console.log(nLimit)
            //     if (page) {
            //         let nPage: number = +page; 
            //         if (nPage > 1) {
            //             sparql += ` OFFSET ${(nPage-1)*nLimit}`
            //         }
            //     }
            // }
            this.requestBodyConfig[0].dbpath= "/kgeConfiguration/query";
            tripleStore = new TripleStoreConnector(this.tripleStoreConfig, this.requestBodyConfig);
            let execRes = await tripleStore.fetchClassTable(decodedSelectQry,"text/csv");
            return execRes;
        } catch (error) {
            logger.error("Error for method getStoredSparqlQuery");
            logger.error(error);
            return null;
        }
    }

    storeSparqlQuery(tableConfig: ClassTableRequest, host: string): Promise<ClassTableResponse> {
        return this.generateSparqlFromConfig(tableConfig, host);
    }

    private async generateSparqlFromConfig(tableConfig: ClassTableRequest, host: string): Promise<ClassTableResponse> {
        try {
            const query = classTableSparqlFromConfig(tableConfig)
            let id = uuidv4();
            const encoded = Buffer.from(query, 'utf8').toString('base64')  
            this.tripleStore.postClassTable(host,encoded,id,tableConfig.user)
            return { endpoint: `${host}/classTable/${id}` }
        } catch (error) {
            console.log("error while posting classtable query")
            return error
        }


        // let client;
        // if (config().redisConfig.password) {
        //     client = redis.createClient({ host: config().redisConfig.host, port: config().redisConfig.port, auth_pass: config().redisConfig.password});
        // } else {
        //     client = redis.createClient({ host: config().redisConfig.host, port: config().redisConfig.port});
        // }
        // client.set(id, JSON.stringify({
        //     sparql: sparql,
        //     targetDB: tableConfig.dbConfig[0]
        // }));
    
    }

    private async getBasicConfiguration(datasetLabel:string): Promise<string>{
        
        const nquads = await this.tripleStore.getBasicConfiguration(datasetLabel);
        const parsed = parseNquads(nquads);
        return parsed[0].o;
    }

    async fetchLabels(req: ClassTableLabelRequest): Promise<ClassTableLabelResponse> {
        try {
        let result = {};
        const sparql = classTableSparql(req)
        const execRes = await this.tripleStore.fetchClassTable(sparql, cons.ACCEPT_NQUADS);
        let nquads = parseNquads(execRes);
        
        nquads.forEach(n => {
            if (result[n.s]) {
                result[n.s].push(n.o);
            } else {
                result[n.s] = [n.o];
            }
        });


        req.attributes.forEach((attr) => { 
            if (!result[attr]) {
                result[attr] = [removeUrlFromString(attr)];
            }
        });    
        return result;
            
        } catch (error) {
            logger.error("Error for method fetchLabels");
            logger.error(error);
            return null;
        }
    }
    async getClassTableIncomingAsync(baseNode: string, dbconfig : DbConfig[]): Promise<NquadsString> {
        try {
        let res = await this.tripleStore.getClassTableIncomingAsync(baseNode,dbconfig);
        let res2 = await this.tripleStore.getClassTableIncomingVirtualGraphsAsync(baseNode, dbconfig)
        res = res + "" + res2;  
            return res;
        } catch (error) {
            logger.error("Error for method getClassTableIncomingAsync");
            logger.error(error);
            return null;
        }

    }    

    getCSVQuery(tableConfig: ClassTableRequest): Promise<string> {
        return this.generateCSVFromConfig(tableConfig);
    }

    private async generateCSVFromConfig(tableConfig: ClassTableRequest): Promise<string> {
        try {
            const query = classTableSparqlFromConfig(tableConfig)
            let execRes = await this.tripleStore.fetchClassTable(query,"text/csv");
            return execRes
        } catch (error) {
            console.log("error while posting classtable query")
            return error
        }
    }
}