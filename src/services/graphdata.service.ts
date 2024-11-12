import { IGraphDataService } from "./interfaces/graphdata.service.interface";
import { D3Result } from "./models/d3Result.model";
import { ITripleStoreConnector } from "../connector/triplestore.connector.interface";
import { TripleStore, TripleStores,Path } from "../config/configfile.model";
import TripleStoreConnector from "../connector/triplestore.connector";
import { DbConfig } from "../routes/models/dbconfig.model";
import { VirtualGraphResult } from "../routes/models/virtualGraph.model";
import {isValue, parseNquads} from "./helpers.service";
import {NQuadsToD3ConverterService} from "./nquadsToD3Converter.service";
import { NquadsString } from "../connector/models/nquadsString.model";
import { D3Node } from "./models/d3Node.model";
import { config } from "../config/config";

export class GraphDataService implements IGraphDataService {

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
    

    async getIncomingWithFilterAsync(baseNode: string, filterUri: string): Promise<D3Result> {
        const res = await this.tripleStore.getResourcesIncomingWithFilterAsync(baseNode, filterUri);
        if (res) {
            return NQuadsToD3ConverterService.getInstance().convertIncoming(res as string, baseNode );
        } else {
            return null;
        }
    }
    async getIncomingAsync(baseNode: string): Promise<D3Result> {
        const res = await this.tripleStore.getResourcesIncomingAsync(baseNode,null);
        if (res) {
            return NQuadsToD3ConverterService.getInstance().convertIncoming(res as string, baseNode );
        } else {
            return null;
        }
    }

    async getOutgoingAsync(baseNode: string): Promise<D3Result> {
        const res = await this.tripleStore.getResourcesOutgoingAsync(baseNode,null);
        
        let uriEmptyList = this.getEmptyChildrenUris(res, baseNode) 
        const res2 = await this.tripleStore.getResourcesOutgoingVgAsync(uriEmptyList)
        let combinedRes = res + "\n" + res2;
        
        if (combinedRes) {
            return NQuadsToD3ConverterService.getInstance().convertOutgoing(combinedRes as string, baseNode);
        } else {
            return null;
        }
    }

    async getOutgoingRandomAsync(): Promise<D3Result> {
        const res = await this.tripleStore.getResourcesOutgoingRandomAsync(null);
        if (res) {
            return NQuadsToD3ConverterService.getInstance().convertOutgoing(res as string);
        } else {
            return null;
        }
    }

    async getSavedGraphData(uuid: string, host: string): Promise<D3Result> {
        this.tripleStoreConfig.path = "/kgeStoredGraphs/query";
        let tripleStore = new TripleStoreConnector(this.tripleStoreConfig, this.requestBodyConfig);
        let res = await tripleStore.getSavedResourcesAsync(uuid,host);
        this.tripleStoreConfig.path = "/colid-dataset/query";
        if (res) {
            return NQuadsToD3ConverterService.getInstance().convertOutgoing(res as string);
        } else {
            return null;
        }
    }

    async postSaveGraphData(uuid: string, data: string, host: string): Promise<any> {
        this.tripleStoreConfig.updatePath = "/kgeStoredGraphs/update";
        let tripleStore = new TripleStoreConnector(this.tripleStoreConfig, this.requestBodyConfig);
        return tripleStore.postSavedResourcesAsync(uuid, data, host);
    }

    async getNamedGraphs(uri:string): Promise<String[]> {
        const nquads = await this.tripleStore.getNamedGraphsAsync(uri);
        const parsed = parseNquads(nquads);
        return parsed.map(nquad => {return nquad.o});
    }

    async getVirtualGraphs(triplestores: TripleStores): Promise<any> {
        const nquads = await this.tripleStore.getVirtualGraphsAsync();
        if (nquads) {
            try {
                return nquads.virtual_graphs.map(x=>{return{path:x,db:x}})
                
            } catch (error) {
                console.log(error.message)
            }
        } else return null;
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

    async getTripleStores(user:string): Promise<any[]> {
        const nquads = await this.tripleStore.getTripleStores(user);
        const parsed = parseNquads(nquads);
        var dbPaths = [];
        for (let index = 0; index < parsed.length; index++) {
        let dbPath = new Path();
        dbPath.dbpath =parsed[index].s;
        dbPath.name= parsed[index].o;
        dbPaths.push({
            instance: parsed[index].o,
            ...dbPath
        });
        };
        return dbPaths;
    }

    async checkEligibleUser(user: string): Promise<boolean>{
        const nquads = await this.tripleStore.checkEligibleUser(user);
        const parsed = parseNquads(nquads);
        if (typeof parsed !== 'undefined' && parsed.length > 0) {
            return true
        }
        return false;
    }
}