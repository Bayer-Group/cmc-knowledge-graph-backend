import { D3Result } from "../models/d3Result.model";

export interface INQuadsToD3ConverterService{

    /**
     * gets the outgoing lists of nodes and links
     * @param nquads raw data triplets
     * @param startNode node which is expanded 1 level
     * @param startNodeIndex initially set to 0
     * @param nextNodeIndex 
     */
    convertOutgoing(nquads: string, startNode: string, startNodeIndex: number, nextNodeIndex: number): D3Result

    /**
     *  gets the incoming lists of nodes and links
     * @param nquads raw data triplets
     * @param baseNodeUri the uri of the node in which incoming nodes go
     */
    convertIncoming(nquads: string, baseNodeUri: string): D3Result
    
}