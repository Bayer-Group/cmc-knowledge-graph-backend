import { CountResult } from "../../routes/models/count.model";

export interface ICountService {
    
    /**
     * Fetches the Count of all incoming Links of a baseNode
     * @param baseNode BaseNode (uri) for what the count should be fetched
     */
    getIncomingAsync(baseNode: string): Promise<CountResult>
}