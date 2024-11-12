
import { D3Result } from "../models/d3Result.model";
import { TripleStores } from "../../config/configfile.model";
import { VirtualGraphResult } from "../../routes/models/virtualGraph.model";

export interface IGraphDataService {
    
    /**
     * Gets all Incoming Resources for a given baseNode in the D3 Format
     * @param baseNode Uri of the BaseNode
     * @param filterUri Additional FilterUri to filter the result
     * @returns D3Result containing Nodes and Links
     */
    getIncomingWithFilterAsync(baseNode: string, filterUri: string): Promise<D3Result>

    /**
     * Gets all Incoming Resources for a given baseNode in the D3 Format
     * @param baseNode Uri of the BaseNode
     * @returns D3Result containing Nodes and Links
     */
    getIncomingAsync(baseNode: string): Promise<D3Result>

    /**
     * Gets all Outgoing Ressources for a given baseNode in D3 Format
     * @param baseNode Uri of the BaseNode
     * @returns D3Result containing Nodes and Links
     */
    getOutgoingAsync(baseNode: string): Promise<D3Result>

    /**
     * Gets an random Outgoing Ressources for in D3 Format
     * @returns D3Result containing Nodes and Links
     */
    getOutgoingRandomAsync(): Promise<D3Result>

    /**
     * Gets saved graphData based on a given UUID in the D3 Format
     * @param uuid unique identifier of the stored data
     * @returns D3Result containing Nodes and Links
     */
    getSavedGraphData(uuid: string, host: string): Promise<D3Result>

    /**
     * Posts Data to the TripleStore with a unique identifier
     * @param uuid identifier
     * @param data data in base64 
     */
    postSaveGraphData(uuid: string, data: string, host: string): Promise<Boolean>

    /**
     * Gets all Named Graphs in the TripleStore
     * @returns an string array containing the uris of the named graphs
     */
    getNamedGraphs(uri: string): Promise<String[]>

    /**
     * Gets all Virtual Graphs by a given triplestore configuration
     * @param triplestores triplestore configurations
     * @returns all virutalGraphs in a specific Response format
     */
    getVirtualGraphs(triplestores: TripleStores): Promise<VirtualGraphResult[]>

    /**
     * Fetch all triplestores from Configuration Databse
    */
     getTripleStores(user :string): Promise<any[]>

     checkEligibleUser(user:string): Promise<boolean>
}