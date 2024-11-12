import { DbConfig } from "./dbconfig.model";

export class PathConfig {
    bidirectional: boolean;
    disableTBox: boolean;
    shortestPath: boolean;
    numPaths: number;
    maxPathLength: number;
    showRange: boolean;
    pathRange: number[];
    dbconfig: DbConfig[];
}