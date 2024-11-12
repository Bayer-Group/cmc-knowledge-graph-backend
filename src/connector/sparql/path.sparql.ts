import { PathConfig } from "../../routes/models/pathconfig.model";
import constants from "../../constants/constants";
/**
 * Sparql to retrieve path data based on two given nodes
 * @param pathConfig PathConfiguration object
 * @param from starting node (uri)
 * @param to target node (uri)
 */

export const sparqlGetPath = (pathConfig: PathConfig, from, to) => {
    let limitation = "";
    if (pathConfig.numPaths !== 0 && pathConfig.numPaths) {
      limitation = `LIMIT ${pathConfig.numPaths}`;
    } else if (pathConfig.maxPathLength !== 0 && pathConfig.maxPathLength) {
      limitation = `MAX LENGTH ${pathConfig.maxPathLength}`;
    } else if (pathConfig.showRange) {
      if (pathConfig.pathRange) {
        limitation = `OFFSET ${pathConfig.pathRange[0]} LIMIT ${pathConfig.pathRange[1]}`;
      }
    }
    return `
    PATHS ${pathConfig.shortestPath ? "SHORTEST" : "ALL"} START ?x = <${from}>
    END ?y = <${to}>
    VIA {
      ${pathConfig.bidirectional ? "{?x ?p ?y BIND(true as ?forward)} UNION {?y ?p ?x BIND(false as ?forward)}" : "?x ?p ?y"}
      FILTER (${pathConfig.disableTBox ? "(?p != rdf:type) &&" : ""} (!isLITERAL(?x)) && (!isLITERAL(?y)) )
    } ${limitation}`;
  }

export const sparqlGlobalPathDescribeNode = (uri: string) => {
    return constants.QUERY_PREFIXES+`
      construct {
        <${uri}>  ?p ?o .
      }
      where {
        { 
        <${uri}>  ?p ?o . 
        FILTER (isLITERAL(?o) || LANG(?o) = "" || LANG(?o) = "en")
       }    
      }    
    `
}