import { AutocompleteResult, GroupAutocompleteResult } from "../models/autocomplete.model";

export interface IAutocompleteService {

    /**
     * Gets Incoming Inital Autocomplete Values in AutocompleteResult format
     * @param query Input query (uri) for what autocomplete data should be fetched
     * @returns AutocompleteResult Array
     */
    getIncomingInitialAsync(query: string): Promise<AutocompleteResult[]>;

    /**
     * Gets Incoming Autocomplete Values in AutocompleteResult format
     * @param query Input query (uri) for what autocomplete data should be fetched
     * @param str Input string to filter the Autocomplete Values
     * @returns AutocompleteResult Array
     */
    getIncomingAsync(query: string, str: string): Promise<AutocompleteResult[]>;

    /**
     * Gets Random Incoming Inital Autocomplete Values in AutocompleteResult format
     * @param query Input query (uri) for what autocomplete data should be fetched
     * @returns AutocompleteResult Array
     */
    getIncomingRandomAsync(query: string): Promise<AutocompleteResult[]>;

    /**
     * Gets Outgoing Autocomplete Values in GroupAutocompleteResult format
     * @param query Input query (uri) for what autocomplete data should be fetched
     * @returns GroupAutocompleteResult Array
     */
    getOutgoingAsync(query: string): Promise<GroupAutocompleteResult[]>;

}