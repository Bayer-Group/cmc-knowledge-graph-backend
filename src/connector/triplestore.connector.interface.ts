import { NquadsString } from "./models/nquadsString.model";
import { TripleStores } from "../config/configfile.model";
import { PathResult } from "./models/pathResponse.model";
import { DbConfig } from "../routes/models/dbconfig.model";

export interface ITripleStoreConnector {

    /**********************************************/
    /**************** AUTOCOMPLETE ****************/
    /**********************************************/
    
    /**
     * Fetches inital Autocomplete Values for Incoming Nodes
     * @param query Input query (uri) for what autocomplete data should be fetched
     * @returns String in Nquads format
     */
    getAutocompleteIncomingInitialAsync(query: string): Promise<NquadsString>;

    /**
     * Fetches autocomplete values for a given query (uri) and string
     * @param query Input query (uri) for what autocomplete data should be fetched
     * @param str Input string to filter the autocomplete
     * @returns String in Nquads format
     */
    getAutocompleteIncomingAsync(query: string, str: string): Promise<NquadsString>;

    /**
     * Fetches random Autocomplete Values for a given base node (query)
     * @param query Input query (uri) for what autocomplete data should be fetched
     * @returns String in Nquads format
     */
    getAutocompleteIncomingRandomAsync(query: string): Promise<NquadsString>;

    /**
     * Fetches Autocomplete Values based on a given query string
     * The Result contains also the type for a further grouping
     * @param query Autocomplete input string
     * @param requestBodyConfig target databse name and graphs from frontend request
     */
    getAutocompleteOutgoingAsync(query: string, requestBodyConfig:DbConfig[]): Promise<NquadsString>;

    /**
     * Fetches Autocomplete Values that are children of url, based on a given query string
     * @param query the query string
     * @param url the node's uri for which children are searched
     */
    getAutocompleteOutgoingAdditionalAsync(query, url, filteredChildURIs): Promise<NquadsString>; 

    /**********************************************/
    /******************* COUNT ********************/
    /**********************************************/

    /**
     * Fetches the count of all incoming links
     * @param uri BaseNode (uri) for what the count should be fetched
     * @returns String in Nquads format containing the count as object
     */
    getCountIncomingAsync(uri: string): Promise<NquadsString> //TODO what response should be used from the triplestores? (json and xml atm)

    /**********************************************/
    /******************* RESOURCES ****************/
    /**********************************************/

    /**
     * Fetches Incoming Ressources for a given uri filtered by a second uri
     * @param uri BaseUri for what the data should be retrieved
     * @param filterUri Additional Filter Uri
     * @returns String in Nquads format
     */
    getResourcesIncomingWithFilterAsync(uri: string, filterUri: string): Promise<NquadsString>;

    /**
     * Fetches Incoming Ressources for a given uri 
     * @param uri BaseUri for what the data should be retrieved
     * @returns String in Nquads format
     */
    getResourcesIncomingAsync(uri: string, dbconfig: DbConfig[]): Promise<NquadsString>;

    /**
     * Fetches all outgoing resources by a given base node (uri)
     * @param uri Uri for what all outgoing ressources should be fetched
     * @returns String in Nquads format
     */
    getResourcesOutgoingAsync(uri: string, dbconfig: DbConfig[]): Promise<NquadsString>;

    /**
     * 
     * @param uriList 
     */
    getResourcesOutgoingVgAsync(uriList: string[]): Promise<NquadsString>;

    /**
     * 
     * @param uri 
     */
    getCountOutgoingAsync(uri: string): Promise<NquadsString>;


    /**
     * Fetches and random outgoing resource
     * @returns String in Nquads format
     */
    getResourcesOutgoingRandomAsync(dbconfig: DbConfig[]): Promise<NquadsString>;

    /**
     * Fetches stored Graphdata from the TripleStore based on a given id (uuid)
     * @param id Unique uuid to identify stored graph data
     * @returns String in Nquads format
     */
    getSavedResourcesAsync(id: string,host: string): Promise<NquadsString> 
    
    /**
     * Posts Data to the TripleStore 
     * @param id unique identifier of the data set
     * @param data the data base64 encoded
     * @returns true if the data was saved successfully
     */
    postSavedResourcesAsync(id: string, data: any, host: string): Promise<any>; 

    /**
     * Gets all virtual Graphs for a triplestore configuration
     * @param tripleStores tripleStore configuration
     * @returns String in Nquads format
     */
    getVirtualGraphsAsync(): Promise<any>;

    /**
     * Gets all Named Graphs in the TripleStore
     * @returns String in Nquads format
     */
    getNamedGraphsAsync(uri: string): Promise<NquadsString>

    /**********************************************/
    /******************* PATH *********************/
    /**********************************************/

    /**
     * Fetchs the path for a to given nodes (NODE: ONLY WORKS WITH STARDOG)
     * @param pathConfig pathconfiguration object
     * @param from source uri
     * @param to target uri
     */
    getPathBetweenNodesAsync(pathConfig: any, from: string, to: string): Promise<PathResult> 

    /**
     * Simple Describe Query of a given uri subject
     * @param uri Input Uri
     */
    describeSingleNodeGlobalPathAsync(uri: string): Promise<NquadsString>

    /**
     * Fetch all triplestores from Configuration Databse
     */
     getTripleStores(user:string): Promise<NquadsString>
    /**
     * Fetch all classtables for given request
     */
     fetchClassTable(sparql: string, accept: string): Promise<any>

     postClassTable(host:string, query:string, uuid:string,user:string): Promise<any>

    /**
     * Fetches the query path for savedgraphs and tableviews
     */
     getBasicConfiguration(datasetLabel:string): Promise<NquadsString>

     getTableViewsSparql(host:string,uuid:string): Promise<any>

     getClassTableIncomingAsync(baseNode: string, dbconfig: DbConfig[]): Promise<NquadsString>;
     
     getClassTableIncomingVirtualGraphsAsync(baseNode: string, dbconfig: DbConfig[]): Promise<NquadsString>;

     checkEligibleUser(user:string): Promise<NquadsString>
}