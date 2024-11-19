import { ITripleStoreConnector } from "./triplestore.connector.interface";
import { NquadsString } from "./models/nquadsString.model";
import { TripleStores, TripleStore } from "../config/configfile.model";
import { DbConfig } from "../routes/models/dbconfig.model";
import {config} from "../config/config";
import axios = require('axios');
import { sparqlAutocompleteIncomingInitial, sparqlAutocompleteIncoming, sparqlAutocompleteIncomingRandom, 
    sparqlAutocompleteOutgoing, sparqlAutocompleteOutgoingAdditional } from "./sparql/autocomplete.sparql";
import cons from "../constants/constants";
import { sparqlCountIncomingLinks, sparqlCountOutgoingLinks } from "./sparql/count.sparql";
import { sparqlIncomingWithFilter, sparqlIncoming, sparqlOutgoing, sparqlRandomPosition, sparqlRandomSubject, 
    sparqlGetSavedData, sparqlPostData, sparqlGetNamedGraphs, sparqlOutgoingVG, sparqlGetVirtualGraphs, sparqlAll, sparqlColid, sparqlGetTripleStores, sparqlPostClassTable, sparqlGetBasicConfiguration, sparqlFetchTableViewsQuery, sparqlIncomingClasses, sparqlOutgoingVirtualGraphs, sparqlIncomingVirtualGraphs, sparqlCheckEligibleUser, sparqlIncomingVirtualGraphClasses } 
    from "./sparql/graphdata.sparql";
import {createLinkObject, isValue, parseNquads} from "../services/helpers.service";
import {PathResult} from "./models/pathResponse.model";
import { sparqlGlobalPathDescribeNode, sparqlGetPath } from "./sparql/path.sparql";
import logger from '../logger/logger';
import {NQuadsToD3ConverterService} from "../services/nquadsToD3Converter.service";
import { PathConfig } from "../routes/models/pathconfig.model";
import https from 'https'
const { getProxyHttpAgent } =  require('proxy-http-agent');

class TripleStoreConnector implements ITripleStoreConnector {
    private dbConfig: DbConfig[];
    private tripleStore: TripleStore;
    private httpClient: axios.AxiosInstance;

    constructor(mTripleStore: TripleStore, mConfig: DbConfig[]){
        this.tripleStore = mTripleStore;
        this.dbConfig = mConfig;
        
        console.log("triplestore.connector dbConfig:")
        console.log(this.dbConfig)
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false, 
          })
        let proxyUrl = "http://CWID:PWD!@10.185.190.100:8080/";
          
        let localProxyAgent = getProxyHttpAgent({
                       proxy: proxyUrl,
                       rejectUnauthorized: false
                      });
          this.httpClient = axios.default.create({
            baseURL: `${this.tripleStore.protocol}://${this.tripleStore.serviceHost}:${this.tripleStore.port}${this.dbConfig[0].dbpath}`,
            timeout: config().app.dbRequestTimeout,
            headers: {
                'Authorization': this.tripleStore.auth ? this.tripleStore.auth : "",
                'Content-Type': cons.CONTENT_TYPE_SPARQL,
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Access-Control-Allow-Headers' : "Origin, X-Requested-With, Content-Type, Accept,Authorization",
                'Access-Control-Allow-Credentials' : "true",
            },
            httpsAgent: process.env.NODE_ENV!= "local"? httpsAgent : localProxyAgent,
        });
    }

    async getAutocompleteIncomingInitialAsync(query: string): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlAutocompleteIncomingInitial(query, this.dbConfig));
    }

    async getAutocompleteIncomingAsync(query: string, str: string): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlAutocompleteIncoming(query, str, this.dbConfig));
    }

    async getAutocompleteIncomingRandomAsync(query: string): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlAutocompleteIncomingRandom(query, this.dbConfig));
    }

    async getAutocompleteOutgoingAsync(query: string, requestBodyConfig): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlAutocompleteOutgoing(query, requestBodyConfig));
    }

    async getAutocompleteOutgoingAdditionalAsync(query, url, filteredChildURIs): Promise<NquadsString>{
        return this.fetchNquadsAsync(sparqlAutocompleteOutgoingAdditional(query, url, filteredChildURIs, this.dbConfig))
    }

    async getCountIncomingAsync(uri: string): Promise<NquadsString> {
        // console.log(sparqlCountIncomingLinks(uri, this.dbConfig))
        return this.fetchNquadsAsync(sparqlCountIncomingLinks(uri, this.dbConfig));
    }

    async getResourcesIncomingWithFilterAsync(uri: string, filterUri: string): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlIncomingWithFilter(uri, filterUri, this.dbConfig));
    }

    async getResourcesIncomingAsync(uri: string, dbconfig: DbConfig[]): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlIncoming(uri, dbconfig));
    }

    async getClassTableIncomingAsync(uri: string, dbconfig: DbConfig[]): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlIncomingClasses(uri, dbconfig));
    }
    async getClassTableIncomingVirtualGraphsAsync(uri: string, dbconfig: DbConfig[]): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlIncomingVirtualGraphClasses(uri, dbconfig));
    }
    async getAllAsync(dbconfig: DbConfig[]): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlAll(dbconfig));
    }

    async getColidAsync(uri: string, graph: string): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlColid(uri,graph));
    }

    async getResourcesOutgoingAsync(uri: string, dbconfig: DbConfig[]): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlOutgoing(uri, dbconfig));
    }
    async getResourcesOutgoingVirtualGraphsAsync(uri: string, dbconfig: DbConfig[]): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlOutgoingVirtualGraphs(uri, dbconfig));
    }

    async getResourcesIncomingVirtualGraphsAsync(uri: string, dbconfig: DbConfig[]): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlIncomingVirtualGraphs(uri, dbconfig));
    }
    
    async getOutgoingAsync(baseNode: string, dbconfig: DbConfig[]): Promise<NquadsString> {       
        
        let res = await this.getResourcesOutgoingAsync(baseNode, dbconfig);
        
        let uriEmptyList = this.getEmptyChildrenUris(res, baseNode) 
    
        const res2 = await this.getResourcesOutgoingVirtualGraphsAsync(baseNode, dbconfig)
        res = res + "" + res2;  
        
        logger.info(res);
        
        if (res) {
            return res;
        } else {
            return null;
        }
        
    }

    async getIncomingAsync(baseNode: string, dbconfig : DbConfig[]): Promise<NquadsString> {
        let res = await this.getResourcesIncomingAsync(baseNode, dbconfig);
        
        let uriEmptyList = this.getEmptyChildrenUris(res, baseNode) 
    
        const res2 = await this.getResourcesIncomingVirtualGraphsAsync(baseNode, dbconfig)
        res = res + "" + res2;  
        
        if (res) {
            return res;
        } else {
            return null;
        }
        
    }


    async getResourcesOutgoingVgAsync(uriList: string[]): Promise<NquadsString>{
        if (this.dbConfig.every(db => !db.virtualGraphs || db.virtualGraphs.length == 0) ) {
            return ""
        } else {
            return this.fetchNquadsAsync(sparqlOutgoingVG(uriList, this.dbConfig) );
        }
    }

    async getCountOutgoingAsync(uri: string): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlCountOutgoingLinks(uri, this.dbConfig))
    }

    async getResourcesOutgoingRandomAsync(dbConfig: DbConfig[]): Promise<NquadsString> {
        const randomOffsetNquads = await this.fetchNquadsAsync(sparqlRandomPosition(dbConfig));
        const num = Math.floor(Math.random() * parseInt(parseNquads(randomOffsetNquads)[0].o));
        const randomSubjectNquads = await this.fetchNquadsAsync(sparqlRandomSubject(num, dbConfig));
        const randomSubject = parseNquads(randomSubjectNquads)[0].s;
        return this.fetchNquadsAsync(sparqlOutgoing(randomSubject, dbConfig));

    }

    async getSavedResourcesAsync(id: string, host: string): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlGetSavedData(id,host));
    }

    async postSavedResourcesAsync(id: string, data: string, host: string): Promise<any> {
        return this.postDataAsync(sparqlPostData(id, data, host));
    }

    async postClassTable(host:string, query:string,uuid:string,user:string):Promise<any>{
        return this.postClassTableAsync(host, query,uuid,user)
    }

    async getVirtualGraphsAsync(): Promise<any>{ 
        return this.fetchStardogData();
    }

    async getNamedGraphsAsync(uri: string): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlGetNamedGraphs(uri));
    }
    
    async getPathBetweenNodesAsync(pathConfig: any, from: string, to: string): Promise<PathResult> {
        return this.fetchDataWithoutAcceptType(sparqlGetPath(pathConfig, from, to));
    }

    async getTripleStores(user:string): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlGetTripleStores(user));
    }

    async getBasicConfiguration(datasetLabel:string): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlGetBasicConfiguration(datasetLabel));
    }

   async checkEligibleUser(user:string) : Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlCheckEligibleUser(user));
   }

    async getPathInNquards(pathconfig: PathConfig, from: string, to: string): Promise<NquadsString> {
        const pathResult = await this.getPathBetweenNodesAsync(pathconfig, from, to);
        if (pathResult) {    
            //  use set to make sure that every node is used only once
            const nodes = new Set<string>();
            let res = pathResult.results.bindings.filter(quad => quad.x && quad.y && quad.p);
            res.map(nquad => {
                nodes.add(nquad.x.value);
                nodes.add(nquad.y.value);
                });
            if (pathconfig.bidirectional) {
                res.forEach(quad => { 
                    if (quad.forward.value === "false") { 
                        let oldX = quad.x;
                        quad.x = quad.y;
                        quad.y = oldX;
                    }
                });
            }
            const links = res.map(nquad => createLinkObject(nquad.p.value, nquad.x.value, nquad.y.value));
            let finalLinks = [];
            // make sure that finalLinks doesnt contain duplicate links
            links.forEach(l => {
                if (!finalLinks.find(foundL => foundL.label === l.label && foundL.source === l.source && foundL.target === l.target)) {
                    if (!isValue(l.source) && !isValue(l.target)) {
                        finalLinks.push(l);
                    }
                }
            })

           const finalNodes = await this.loadNodeData(Array.from(nodes));

           let nquadsResponse = ""
           finalLinks.forEach(l => {
               nquadsResponse += '<' + l.source + '> ' +'<' + l.label + '> ' + '<' + l.target + '> .\n'
           })

           finalNodes.forEach(n => {
            nquadsResponse += n
            })

           return nquadsResponse.toLocaleString();       
        } else return null;
    }
    
    /**
     * Loads additional LoadData for an array of nodes
     * @param nodes array of nodes
     */

    private async loadNodeData(nodes: string[]): Promise<NquadsString[]> {
        let enrichedNodes: NquadsString[] = [];
        const length = nodes.length;
        for (let i=0; i < length; i++) {
            let node = nodes[i];
            let nodeData = await this.describeSingleNodeGlobalPathAsync(node);
            enrichedNodes.push(nodeData);
        }       
        return enrichedNodes;

    }

    async describeSingleNodeGlobalPathAsync(uri: string): Promise<NquadsString> {
        return this.fetchNquadsAsync(sparqlGlobalPathDescribeNode(uri));
    }


    async getClassTableSparql(sparql: string): Promise<NquadsString> {
        try {
            console.log("DB query sent:")
            console.log(sparql)
            const response = await this.httpClient.post('', sparql, {
                baseURL: `${this.tripleStore.protocol}://${this.tripleStore.serviceHost}:${this.tripleStore.port}${this.tripleStore.path}`
            });
            logger.info("Successfully called TripleStore getClassTableSparql");
            return  <NquadsString>response.data;
          } catch (error) {
            logger.error("Error for method getClassTableSparql");
            logger.error(error);
            // console.log(error)
            return null;
        }
    }

    async fetchClassTable(sparql: string, accept: string): Promise<any> {
        try {
            console.log("Class Table Labels Query")
            console.log(sparql)
            const response = await this.httpClient.post('', sparql, {
                headers: {
                  'Accept': accept,
            }});
            logger.info("Successfully called TripleStore fetchClassTable");
            return response.data;
          } catch (error) {
            logger.error("Error for method fetchClassTable");
            logger.error(error);
            return null;
        }
    }

    async getTableViewsSparql(host: string,uuid: string): Promise<any> {
        try {        
            return await this.fetchNquadsAsync(sparqlFetchTableViewsQuery(host,uuid));
          } catch (error) {
            logger.error("Error for method fetchClassTable");
            logger.error(error);
            return null;
        }
    }
   /**
    * Calls a TripleStore via HTTP POST and sets the Accept Header to Nquads to always retrieve nquads
    * @param sparql Input SparQL Query
    * @returns An NquadsString (Any Errors will be catched and null will be returned)
    */
    async fetchNquadsAsync(sparql: string): Promise<NquadsString> {
        try {
            console.log("DB query sent fetchNquadsAsync:")
            console.log(sparql)
            console.log = (sparql) => {
                process.stdout.write(`${sparql}\n`);
              };
            const response = await this.httpClient.post('', sparql, {
                headers: {
                  'Accept': cons.ACCEPT_NQUADS,
                  'Authorization': this.tripleStore.auth ? this.tripleStore.auth : "",
                  'Content-Type': cons.CONTENT_TYPE_SPARQL,
                  'Access-Control-Allow-Origin' : '*',
                  'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                  'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept,Authorization',
                  'Access-Control-Allow-Credentials' : "true",
            }});
            logger.info("Successfully called TripleStore fetchNquadsAsync");
            return <NquadsString>response.data;
          } catch (error) {
            logger.error("Error for method fetchNquadsAsync");
            logger.error(error);
            logger.error(error.response.data);
            // console.log(error)
            return null;
        }
    }

    /**
    * Calls a TripleStore via HTTP POST without an Accept type, to perform update queries
    * Calls the TripleStore with the configured updatePath
    * @param sparql Input SparQL Query
    * @returns true if the data has been pushed successfully
    */
    async postDataAsync(sparql: string): Promise<any> {
        try {

           const baseURL = `${this.tripleStore.protocol}://${this.tripleStore.serviceHost}:${this.tripleStore.port}${this.tripleStore.updatePath}`
           const response = await this.httpClient.post('',  {update: sparql},
            {
                baseURL : baseURL,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': this.tripleStore.auth ? this.tripleStore.auth : "",
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                    'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept,Authorization',
                    'Access-Control-Allow-Credentials' : "true",
                }
            }
            );
            logger.info("Successfully called TripleStore postDataAsync");
            return response.data
        } catch (error) {
            logger.error("Error for method fetchNquadsAsync postDataAsync");
            logger.error(error);
            return false;
        }
    }
    /**
     * 
     * @param data the nquads from the database
     * @param baseNode 
     */
    private getEmptyChildrenUris(data: NquadsString, baseNode: string){
        let nodes = NQuadsToD3ConverterService.getInstance().convertOutgoing(data as string, baseNode).nodes
        return nodes.filter(node => Object.keys(node.data).length == 1).map(node => node.uri)
    }

/**
* Calls a TripleStore via HTTP POST with an Accept type for sparql json
* @param sparql Input SparQL Query
* @returns true if the data has been pushed successfully
*/
private async fetchDataWithoutAcceptType(sparql: string): Promise<any> {
    try {
        const response = await this.httpClient.post('', sparql, {
            headers: {
                'Accept': cons.ACCEPT_SPARQL_JSON,
                'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept',
            }
        });
        logger.info("Successfully called TripleStore fetchDataWithoutAcceptType");
        return response.data;
      } catch (error) {
        logger.error("Error for fetchDataWithoutAcceptType");
        logger.error(error);
        return null;
    }
}
/**
* Calls the stardog via HTTP Get request with an Accept type for sparql json
* @param request
* @returns true if the data has been pushed successfully
*/
private async fetchStardogData(): Promise<any> {
    try {
        const response = await this.httpClient.get(`${this.tripleStore.protocol}://${this.tripleStore.serviceHost}:${this.tripleStore.port}${this.tripleStore.path}/virtual_graphs`);
        logger.info("Successfully called TripleStore fetchStardogData");
        return response.data;
      } catch (error) {
        logger.error("Error for fetchStardogData");
        logger.error(error);
        return null;
    }
}

async postClassTableAsync(host:string, query:string,uuid:string,user:string): Promise<any> {
    try {
        // host = "https://github.com/Bayer-Group"
         let sparql = `INSERT DATA {
            GRAPH <https://github.com/Bayer-Group/kge/tableViews> {
            <${host}/classTable/${uuid}> <https://github.com/Bayer-Group/kge/creator> "${user}" .
            <${host}/classTable/${uuid}> <https://github.com/Bayer-Group/kge/hasStoredQuery> "${query}" .
            }
       }`;
       const baseURL = `${this.tripleStore.protocol}://${this.tripleStore.serviceHost}:${this.tripleStore.port}${this.tripleStore.updatePath}`
       const response = await this.httpClient.post('',  sparql,
        {
            baseURL : baseURL,
            headers: {
                'Content-Type': 'application/sparql-update',
                'Authorization': this.tripleStore.auth ? this.tripleStore.auth : "",
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' : 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
                'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept,Authorization',
                'Access-Control-Allow-Credentials' : "true",
            }
        }
        );
        logger.info("Successfully called TripleStore postDataAsync");
        return response.data
    } catch (error) {
        logger.error("Error for method fetchNquadsAsync postDataAsync");
        logger.error(error);
        return false;
    }
}
}

export default TripleStoreConnector;