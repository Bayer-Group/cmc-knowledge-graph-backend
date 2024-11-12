import { PathConfig } from "../../routes/models/pathconfig.model";
import { D3Result } from "../models/d3Result.model";

export interface IPathService {

    /**
     * Fetches basic Path Data in the raw response format
     * @param pathconfig additional pathconfiguration, that can be passed from the ui
     * @param from starting node (uri)
     * @param to target node (uri)
     */
    getRawPathDataAsync(pathconfig: PathConfig, from: string, to: string): Promise<any>
}