import { insertIntoGraph } from "./insertintograph.sparql";
import {nodedatalinks} from "../../constants/nodedatalinks";
import constants from "../../constants/constants";

/**
 * Sparql to retrieve the count of all incoming links for a given ressource
 * @param uri Input uri of the to be counted ressource
 * @param dbconfig DBconfig object
 */
export const sparqlCountIncomingLinks = (uri, dbconfig) => {
    const queryBody = `
      ?s ?p <${uri}>
    `;
    return constants.QUERY_PREFIXES+`
    CONSTRUCT 
        { 
            <${uri}> rdfs:numberOfIssues ?n .
        }
    WHERE
        {  
            SELECT  (COUNT(?s) AS ?n)
            WHERE
            { 
                ${insertIntoGraph(queryBody, dbconfig)}
            }
        } 
  `
  }

export const sparqlCountOutgoingLinks = (uri, dbconfig) => {
    const queryFilter = Object.keys(nodedatalinks).map(x => `FILTER NOT EXISTS { ?s <${x}> ?o }`).reduce((f1, f2) => f1 + "\n" + f2, "")
    const queryBody = `
        SELECT  (COUNT(?o) AS ?n)
        WHERE
        { 
            ?s ?p ?o 
            FILTER sameTerm(lcase(str(?s)), '${uri}')
            FILTER(!isLiteral(?o) )
            ${queryFilter}
        }
    `;
    
    return constants.QUERY_PREFIXES+`
    CONSTRUCT 
    { 
        <${uri}> rdfs:numberOfIssues ?n .
    }
    WHERE
    {  
        ${insertIntoGraph(queryBody, dbconfig)}
    } #count construct
  `
}