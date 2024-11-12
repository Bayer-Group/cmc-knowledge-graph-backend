import TripleStoreConnector from "../connector/triplestore.connector";
import { TripleStore } from "../config/configfile.model";
import { DbConfig } from "../routes/models/dbconfig.model";
import { ITripleStoreConnector } from "../connector/triplestore.connector.interface";
import { GroupAutocompleteResult } from "./models/autocomplete.model";
import { IAutocompleteService } from "./interfaces/autocomplete.service.interface";
import {parseNquads} from "./helpers.service";
import cons from "../constants/constants";
import { TripleModel } from "./models/triples.model";
import { removeUrlFromString, parseAutocomplete } from "./helpers.service";
import { AutocompleteResult } from "../services/models/autocomplete.model";
import { NquadsString } from "../connector/models/nquadsString.model";
import { config } from "../config/config";

export class AutocompleteService implements IAutocompleteService{

    private tripleStore: ITripleStoreConnector;
    private requestBodyConfig: DbConfig[];

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
    }
    
    async getIncomingInitialAsync(query: string): Promise<AutocompleteResult[]> {
        const res = await this.tripleStore.getAutocompleteIncomingInitialAsync(query);
        if (res) {
            return parseAutocomplete(res);
        } else {
            return []
        }
    }
    
    async getIncomingAsync(query: string, str: string): Promise<AutocompleteResult[]> {
        const res = await this.tripleStore.getAutocompleteIncomingAsync(query, str);
        if (res) {
            return parseAutocomplete(res);
        } else {
            return []
        }
    }

    async getIncomingRandomAsync(query: string): Promise<AutocompleteResult[]> {
        const res = await this.tripleStore.getAutocompleteIncomingRandomAsync(query);
        if (res) {
            return parseAutocomplete(res);
        } else {
            return []
        }
    }

    async getOutgoingAsync(query: string): Promise<GroupAutocompleteResult[]> {
        const res = await this.tripleStore.getAutocompleteOutgoingAsync(query, this.requestBodyConfig);
        return this.parseGroupAutocompleteOutgoing(res)
    }

    // set autocomplete service
    async getOutgoingAdditionalAsync(query: string, url: string, filteredChildURIs: string): Promise<AutocompleteResult[]> {
        const res = await this.tripleStore.getAutocompleteOutgoingAdditionalAsync(query, url, filteredChildURIs)
        if (res) {
            return parseAutocomplete(res);
        } else {
            return []
        }
    }

    /**
     * 
     * @param res 
     */
    private parseGroupAutocompleteOutgoing(res: NquadsString): GroupAutocompleteResult[]{
        if (!res)  return []

        const nquads = parseNquads(res);
        let result: GroupAutocompleteResult[] = [];
        let groupMap = this.getMapOfTypes(nquads);
        
        nquads.forEach(nquads => {
            // ignore RDF_TYPE in the result
            if (nquads.p != cons.RDF_TYPE) {
                let acResult: AutocompleteResult = {
                    uri: nquads.s,
                    link: removeUrlFromString(nquads.p),
                    value: nquads.o
                }

                let myGroup = groupMap.get(nquads.s) ? groupMap.get(nquads.s) : "Default";
                const groupIndex = result.findIndex(r => r.group === myGroup);
                if (groupIndex == -1) {
                    result.push({ group: myGroup, data: [acResult]});
                } else {
                    result[groupIndex].data.push(acResult);
                }

            }
        });

        return result;
        
    }

    /**
     * Creates a Map containing the uri as Key and the type/class as value
     * @param nquads Nquads data
     * @returns a new string map
     */
    private getMapOfTypes(nquads: TripleModel[]): Map<string, string> {
        let map = new Map();
        // fetch groups (types from result)
        nquads.forEach(nquad => {
            if (nquad.p == cons.RDF_TYPE) {
            map.set(nquad.s, removeUrlFromString(nquad.o));
            }
        });
        return map;
    }

     parseAutocomplete(val: NquadsString): AutocompleteResult[] {
        const nQuads = parseNquads(val);
    
        let result = [];
    
        nQuads.forEach(triple => {
            if (this.isValue(triple.o)){
                result.push({
                    uri: triple.s,
                    value: triple.o,
                    link: removeUrlFromString(triple.p)
                })
            }
        })
    
        return result;
    }
    

    
    // checks if string is a value or link
     isValue(str){
        return !str.includes("http://")
    }
}