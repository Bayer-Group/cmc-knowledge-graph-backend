import { ICountService } from "./interfaces/count.service.interface";
import { CountResult } from "../routes/models/count.model";
import { ITripleStoreConnector } from "../connector/triplestore.connector.interface";
import { TripleStore } from "../config/configfile.model";
import TripleStoreConnector from "../connector/triplestore.connector";
import { DbConfig } from "../routes/models/dbconfig.model";
import {parseNquads} from "./helpers.service";
import cons from "../constants/constants";

export class CountService implements ICountService {

    private tripleStore: ITripleStoreConnector;

    constructor(mTripleStore: TripleStore, mConfig: DbConfig[]) {
        this.tripleStore = new TripleStoreConnector(mTripleStore, mConfig);
    }
    
    
    async getIncomingAsync(baseNode: string): Promise<CountResult> {
        const res = await this.tripleStore.getCountIncomingAsync(baseNode);
        if (res) {
            const nquad = parseNquads(res);
            return { count: nquad[0].o.replace(cons.RDF_INTEGER_SURFIX, "")}
        } else {
            return { count: "0" }
        }
    }

    async getCountOutgoingAsync(baseNode: string): Promise<CountResult> {
        const res = await this.tripleStore.getCountOutgoingAsync(baseNode);
        if (res) {
            const nquad = parseNquads(res);
            return { count: nquad[0].o.replace(cons.RDF_INTEGER_SURFIX, "")}
        } else {
            // console.log("countService: !res")
            return { count: "0" }
        }
    }
}