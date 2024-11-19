import { insertIntoGraph, insertIntoVirtualGraph } from "./insertintograph.sparql";
import {nodedatalinks} from "../../constants/nodedatalinks";
import { DbConfig } from "../../routes/models/dbconfig.model";
import { imageMapping } from "../../constants/image.mapping";
import constants from "../../constants/constants";
import { joinAsGraphsList, joinAsValuesList, joinDefaultGraphs } from "../../services/helpers.service";
import logger from "../../logger/logger";

/**
 * Sparql to retrieve incoming ressources for a given uri 
 * @param uri The baseUri for what the data should be fetched
 * @param filteredUri Additional filterUri to filter the result
 * @param dbconfig database configuration passed form the ui
 */

export const sparqlIncomingWithFilter = (uri, filteredUri, dbconfig) =>  {
  const optional = `OPTIONAL{<${filteredUri}> ?p2 ?o 
      FILTER (!isLITERAL(?o) || LANG(?o) = "" || LANG(?o) = "en")}
    OPTIONAL{?o2 a <${filteredUri}>} `;
  const queryBody = `
    <${filteredUri}> ?p <${uri}> .
  `;
  return constants.QUERY_PREFIXES+`
  construct {
    <${filteredUri}> ?p <${uri}> .
    <${filteredUri}> ?p2 ?o .
    ?o2 a <${filteredUri}> .
  }
  where {
      ${insertIntoGraph(queryBody, dbconfig, optional)}
      } `
}

/**
 * Sparql to retrieve incoming ressources for a given uri 
 * @param uri The baseUri for what the data should be fetched
 * @param dbconfig database configuration passed form the ui
 */
 export const sparqlIncoming = (uri, dbconfig) => {
  let defaultGraphsList = joinDefaultGraphs(dbconfig);
  if (defaultGraphsList !== "") {
    defaultGraphsList =
    sparqlOutgoingIncomingDefaultGraph(defaultGraphsList, uri, "INCOMING");
  } else {
    defaultGraphsList = `}`;
  }
  return constants.QUERY_PREFIXES+`
  prefix kge:   <https://github.com/Bayer-Group/kge/> 
  construct {
  ?s ?p <${uri}>;
  ?p2 ?o .
  ?o2 a ?s .
}

where {
{  
  values (?triplestore ?namedGraphs) {${joinAsValuesList(dbconfig)}
} 
  
  graph <https://github.com/Bayer-Group/kge/triplestores> {
    ?triplestore a kge:Triplestore ;
		rdfs:label ?label ;
        kge:password    ?password ;
        kge:queryPath   ?queryPath ;
        kge:runsOn      ?triplestroreSystem ;
        kge:updatePath  ?updatePath ;
        kge:user        ?username ;
  }
  graph <https://github.com/Bayer-Group/kge/triplestoreSystems> {
    ?triplestroreSystem 
        kge:host      ?host ;
        kge:port      ?port ;
        kge:protocol  ?protocol .
  }
 
  bind ( coalesce(uri(concat(str(?protocol),"://",?username,":",?password,"@",str(?host),":",str(?port),str(?queryPath))), "") as ?connectionURI )
  #bind ( coalesce(uri(concat(str(?protocol),"://",str(?queryPath))), "") as ?connectionURI )
  Service ?connectionURI{
    SELECT * {
      graph ?namedGraphs{
        ?s ?p <${uri}>   ;
        OPTIONAL{?s ?p2 ?o . 
}  FILTER (!isLITERAL(?o) || LANG(?o) = "" || LANG(?o) = "en")
}
OPTIONAL{?o2 a ?s}    }
} }${defaultGraphsList}
  `
}

/** not used
 * Sparql to retrieve outgoing resources for a given baseNode (uri)
 * @param uri The baseUri for what the data should be fetched
 * @param dbconfig database configuration passed form the ui
 */
 export const sparqlOutgoing = (uri, dbconfig) => {
  let defaultGraphsList = joinDefaultGraphs(dbconfig);
  if (defaultGraphsList !== "") {
    defaultGraphsList =
    sparqlOutgoingIncomingDefaultGraph(defaultGraphsList, uri, "OUTGOING");
  } else {
    defaultGraphsList = `}`;
  }
  return constants.QUERY_PREFIXES+`
  prefix kge:   <https://github.com/Bayer-Group/kge/> 
  construct {
  <${uri}> ?p ?o.
}

where {
{  
  values (?triplestore ?namedGraphs) {${joinAsValuesList(dbconfig)}
} 
  
  graph <https://github.com/Bayer-Group/kge/triplestores> {
    ?triplestore a kge:Triplestore;
		rdfs:label ?label ;
        kge:password    ?password ;
        kge:queryPath   ?queryPath ;
        kge:runsOn      ?triplestroreSystem ;
        kge:updatePath  ?updatePath ;
        kge:user        ?username ;
  }
  graph <https://github.com/Bayer-Group/kge/triplestoreSystems> {
    ?triplestroreSystem 
        kge:host      ?host ;
        kge:port      ?port ;
        kge:protocol  ?protocol .
  }
 
  bind ( coalesce(uri(concat(str(?protocol),"://",?username,":",?password,"@",str(?host),":",str(?port),str(?queryPath))), "") as ?connectionURI )
  #bind ( coalesce(uri(concat(str(?protocol),"://",str(?queryPath))), "") as ?connectionURI )
  Service ?connectionURI{
    SELECT * {
      graph ?namedGraphs{
        <${uri}> ?p ?o   .  
}
} }}${defaultGraphsList} 
  `
}


export const sparqlOutgoingVG = (uris, dbconfig) => {
  const queryBody = (uri) =>  {
    let listOfPictureUri = Object.entries(imageMapping)
    let stringOfPictureUris = "";
    listOfPictureUri.forEach(([key, value]) => {
      stringOfPictureUris += `|| ?p=<${key}> `
    });
    return `
    ?s ?p ?o .
    FILTER ( ?s=<${uri}> )
    FILTER (isLITERAL(?o) ${stringOfPictureUris})
    `
    //
  }

  return constants.QUERY_PREFIXES+`
  construct {
    ?s ?p ?o .
  }
  where {
    ${insertIntoVirtualGraph(queryBody,uris, dbconfig)}
  }
  `
}



  /**
   * takes into account federated query
   * @param uri 
   * @param limit 
   * @param dbconfig 
   */
  export const sparqlOutgoingFilterURI = (uri, childrenURIs, dbconfig) => {
    let nodeDataLinks = Object.keys(nodedatalinks)
    
    const equalsAny = (term, termArray) => termArray.map(x => `${term}=<${x}>`).reduce((f1, f2) => f1 + " || " + f2)
    const sameObjects = equalsAny("?o",childrenURIs)
    
    const queryBody = `
      <${uri}> ?p ?o .
      FILTER (${sameObjects})
      FILTER (!isLITERAL(?o) || LANG(?o) = "" || LANG(?o) = "en")
    `
    const optionalBody= `
      OPTIONAL {?o ?p2 ?o2 .
        FILTER (!isLITERAL(?o2) || LANG(?o2) = "" || LANG(?o2) = "en")
      }
    `
      
    return constants.QUERY_PREFIXES+`
    CONSTRUCT { 
      <${uri}> ?p ?o .
      ?o ?p2 ?o2 .
    }
    WHERE {
      ${insertIntoGraph(queryBody, dbconfig, optionalBody)}
    } # construct where
  `
  }

  export const sparqlAll = (dbconfig) => {
    return constants.QUERY_PREFIXES+`
  prefix kge:   <https://github.com/Bayer-Group/kge/> 
    construct {
    ?s ?p ?o.
  }
  
  where {
    
    values (?triplestore ?namedGraphs) {${joinAsValuesList(dbconfig)}
  } 
    
    graph <https://github.com/Bayer-Group/kge/triplestores> {
      ?triplestore a kge:Triplestore;
      rdfs:label ?label ;
          kge:password    ?password ;
          kge:queryPath   ?queryPath ;
          kge:runsOn      ?triplestroreSystem ;
          kge:updatePath  ?updatePath ;
          kge:user        ?username ;
    }
    graph <https://github.com/Bayer-Group/kge/triplestoreSystems> {
      ?triplestroreSystem 
          kge:host      ?host ;
          kge:port      ?port ;
          kge:protocol  ?protocol .
    }
   
    bind ( coalesce(uri(concat(str(?protocol),"://",?username,":",?password,"@",str(?host),":",str(?port),str(?queryPath))), "") as ?connectionURI )
    #bind ( coalesce(uri(concat(str(?protocol),"://",str(?queryPath))), "") as ?connectionURI )
    Service ?connectionURI{
      SELECT * {
        graph ?namedGraphs{
          ?s ?p ?o   .  
  }}
  } }
  `
  }

  export const sparqlColid = (uri, graph) => {
    return constants.QUERY_PREFIXES+`
    CONSTRUCT {
      <${uri}> ?p ?o  .
    ?o a ?oType .
    ?o <https://github.com/Bayer-Group/kos/19050/distribution> ?oDistribution .
    ?oDistribution a ?oDistributionType .
    ?oDistribution ?pDistribution ?dataDistributionStr .
    ?o ?p2 ?o2string .
    ?iS ?iP <${uri}> .
    ?iS a ?iType .
    ?iS <https://github.com/Bayer-Group/kos/19050/distribution> ?iSdistribution .
    ?iSdistribution a ?iSdistributionType .
      ?iSdistribution ?ipDistribution ?iDataDistributionStr .
    ?iS ?iP2 ?iOstring .
  }
  where {
      {
      graph  <${graph}>  
      {
        <${uri}> ?p ?o .
        OPTIONAL {
          ?o a ?oType .
        }
        OPTIONAL {
          ?iS a ?iType .
        }
        OPTIONAL {
          ?o ?p2 ?o2 .
          FILTER (isLITERAL(?o2) || LANG(?o2) = "" || LANG(?o2) = "en")
        }
        OPTIONAL {
          ?iS ?iP <${uri}> .
          ?iS ?iP2 ?iO .
          FILTER (isLITERAL(?iO) || LANG(?iO) = "" || LANG(?iO) = "en")
        }	
        OPTIONAL {
          ?o <https://github.com/Bayer-Group/kos/19050/distribution> ?oDistribution .
          ?oDistribution a ?oDistributionType .
          ?oDistribution ?pDistribution ?dataDistribution .
          FILTER (isLITERAL(?dataDistribution) || LANG(?dataDistribution) = "" || LANG(?dataDistribution) = "en")
        }
        OPTIONAL {
          ?iS ?iP <${uri}> .
          ?iS <https://github.com/Bayer-Group/kos/19050/distribution> ?iSdistribution .
          ?iSdistribution a ?iSdistributionType .
                  ?iSdistribution ?ipDistribution ?iDataDistribution .
          FILTER (isLITERAL(?iDataDistribution) || LANG(?iDataDistribution) = "" || LANG(?iDataDistribution) = "en")
        }
        FILTER (?p not in (<https://github.com/Bayer-Group/kos/19050/hasDraft>))
      }
    }
      OPTIONAL {
           ?o ?p2 ?o2 .
           FILTER EXISTS { ?sub a ?o }
       FILTER (isLITERAL(?o2) || LANG(?o2) = "" || LANG(?o2) = "en")
      }
    OPTIONAL {
           ?iS ?iP2 ?iO .
       FILTER EXISTS { ?sub a ?iS }
       FILTER (isLITERAL(?iO) || LANG(?iO) = "" || LANG(?iO) = "en") 
      }
      BIND(STR(?o2) as ?o2string)
    BIND(STR(?iO) as ?iOstring)
    BIND(STR(?dataDistribution) as ?dataDistributionStr)
      BIND(STR(?iDataDistribution) as ?iDataDistributionStr)
  }
  
  `
   
  }

/**
 * Sparql to retrieve a random subject based on a given offset number
 * @param number random offset number
 * @param dbconfig database configuration passed form the ui
 */
export const sparqlRandomSubject = (number, dbconfig) => {
  return constants.QUERY_PREFIXES+`
  prefix kge:   <https://github.com/Bayer-Group/kge/> 
  construct {
    ?s ?p ?o.
}

where {
  
  values (?triplestore ?namedGraphs) {${joinAsValuesList(dbconfig)}
} 
  
  graph <https://github.com/Bayer-Group/kge/triplestores> {
    ?triplestore a kge:Triplestore;
		rdfs:label ?label ;
        kge:password    ?password ;
        kge:queryPath   ?queryPath ;
        kge:runsOn      ?triplestroreSystem ;
        kge:updatePath  ?updatePath ;
        kge:user        ?username ;
  }
  graph <https://github.com/Bayer-Group/kge/triplestoreSystems> {
    ?triplestroreSystem 
        kge:host      ?host ;
        kge:port      ?port ;
        kge:protocol  ?protocol .
  }
 
  bind ( coalesce(uri(concat(str(?protocol),"://",?username,":",?password,"@",str(?host),":",str(?port),str(?queryPath))), "") as ?connectionURI )
  #bind ( coalesce(uri(concat(str(?protocol),"://",str(?queryPath))), "") as ?connectionURI )
  Service ?connectionURI{
    SELECT * {
      graph ?namedGraphs{
        ?s ?p ?o   .  
}
} }}
  offset ${number}
  Limit 1`
}

/**
 * Sparql to retrieve a random position in the graph (offset used to query a random subject)
 * @param dbconfig database configuration passed form the ui
 */
export const sparqlRandomPosition = (dbconfig) => {
  return constants.QUERY_PREFIXES+`
  prefix kge:   <https://github.com/Bayer-Group/kge/> 
  construct {
   rdfs:subject rdfs:numberOfIssues ?c .
}

where {
  
  values (?triplestore ?namedGraphs) {${joinAsValuesList(dbconfig)}
} 
  
  graph <https://github.com/Bayer-Group/kge/triplestores> {
    ?triplestore a kge:Triplestore;
		rdfs:label ?label ;
        kge:password    ?password ;
        kge:queryPath   ?queryPath ;
        kge:runsOn      ?triplestroreSystem ;
        kge:updatePath  ?updatePath ;
        kge:user        ?username ;
  }
  graph <https://github.com/Bayer-Group/kge/triplestoreSystems> {
    ?triplestroreSystem 
        kge:host      ?host ;
        kge:port      ?port ;
        kge:protocol  ?protocol .
  }
 
  bind ( coalesce(uri(concat(str(?protocol),"://",?username,":",?password,"@",str(?host),":",str(?port),str(?queryPath))), "") as ?connectionURI )
  #bind ( coalesce(uri(concat(str(?protocol),"://",str(?queryPath))), "") as ?connectionURI )
  Service ?connectionURI{
    SELECT * {
      graph ?namedGraphs{
       SELECT   (count(?s) as ?c) 
      WHERE
        { ?s ?p ?o.
        }
}}
} }
`
}

/**
 * SparQL to get the saved GraphData for a specific uuid
 * @param uuid Identifier of the stored GraphData
 */
export const sparqlGetSavedData = (uuid,host) => {
    return constants.QUERY_PREFIXES+`CONSTRUCT { <${host}/${uuid}> <${host}/hasData> ?o }
      WHERE {
        <${host}/${uuid}> <${host}/hasData> ?o .
      }`;
  }
// export const sparqlGetSavedData = (uuid) => {
//     return `CONSTRUCT { ?s ?p ?o }
//       WHERE {
//         <http://10.122.106.18:3000/graph/${uuid}> <http://10.122.106.18:3000/hasData> ?o .
//         ?s ?p ?o
//       }`;
//   }

/**
 * SparQL to post data to the TripleStore
 * @param uuid Identifier of the stored GraphData
 * @param data Data that should be stored
 */
export const sparqlPostData = (uuid, data, host) => {
    return `INSERT DATA {
          <${host}/${uuid}> <${host}/hasData> "${data}"
        }`;
  }

  /**
   * SparQL to retrieve all virtualGraphs by a given triplestore
   */
export const  sparqlGetVirtualGraphs = (triplestores) => {
    const virtualGraphQuery = Object.keys(triplestores).map((store, index) => {
      const query = `
        service <db://system> {
          graph <tag:stardog:api:mappingsstore:store> {
            <tag:stardog:api:mappingsstore:graphs> <tag:stardog:api:mappingsstore:record> ?vg
            BIND("${store}" as ?db)
          }
        }
      `
      if (index === 0) {
        return `{ ${query} }`
      } else {
        const triplestore = triplestores[store];
        if (triplestore.type=="stardog"){
          return `{
            SERVICE <${triplestore.protocol}://${triplestore.user}:${triplestore.password}@${triplestore.serviceHost}:${triplestore.port}${triplestore.paths[0].dbpath}> { 
              ${query}
            }
          }`
        } else {
          return "{}"
        }
        
      }
    }).join("UNION")
    return constants.QUERY_PREFIXES+`
    CONSTRUCT {
      ?vg rdf:predicate ?db
      }
      WHERE  {
        select * where {
          ${virtualGraphQuery}
        } 
      }`
  }

  export const sparqlGetTripleStores = (user: string) => {
    return constants.QUERY_PREFIXES+`
    PREFIX kge:   <https://github.com/Bayer-Group/kge/> 
    construct {
      ?triplestore  rdfs:label ?triplestoreLabel
     }
     WHERE {{
       graph <https://github.com/Bayer-Group/kge/triplestores>{
         ?triplestore a kge:Triplestore;
           kge:password    ?password ;
             kge:queryPath   ?queryPath ;
             kge:runsOn      ?triplestroreSystem ;
             kge:updatePath  ?updatePath ;
             kge:user        ?username ;
             kge:restrictedAccess  true ;
           rdfs:label ?triplestoreLabel .
       }
       graph <https://github.com/Bayer-Group/kge/users> {
      ?currentUser eco:hasEMailAddress <mailto:${user}>;
        kge:hasAccessTo ?triplestore
        }
     }
     UNION{
      graph <https://github.com/Bayer-Group/kge/triplestores>{
      ?triplestore a kge:Triplestore;
      kge:password    ?password ;
        kge:queryPath   ?queryPath ;
        kge:runsOn      ?triplestroreSystem ;
        kge:updatePath  ?updatePath ;
        kge:user        ?username ;
        kge:restrictedAccess  false ;
        rdfs:label ?triplestoreLabel .
  }
}
}
    `
  }

  /**
   * SparQL to retrieve all named graphes
   */
export const sparqlGetNamedGraphs = (uri) => {
  return constants.QUERY_PREFIXES+`
  prefix kge:   <https://github.com/Bayer-Group/kge/> 
  construct {
    <${uri}> kge:namedGraphs ?g
  } 
  WHERE {
    {
    graph <https://github.com/Bayer-Group/kge/triplestores>{
      <${uri}>	    kge:password    ?password ;
          kge:queryPath   ?queryPath ;
          kge:runsOn      ?triplestroreSystem ;
          kge:updatePath  ?updatePath ;
          kge:user        ?username ;
      rdfs:label ?triplestoreLabel .
    }
    graph <https://github.com/Bayer-Group/kge/triplestoreSystems> {
      ?triplestroreSystem 
          kge:host      ?host ;
          kge:port      ?port ;
          kge:protocol  ?protocol .
  
    }
   
    bind ( coalesce(uri(concat(str(?protocol),"://",?username,":",?password,"@",str(?host),":",str(?port),str(?queryPath))), "") as ?connectionURI )
    #bind ( coalesce(uri(concat(str(?protocol),"://",str(?queryPath))), "") as ?connectionURI )
    Service ?connectionURI{
      Select distinct ?g {
        graph ?g{
          ?s ?p ?o
        }
  }
  }
  }
  UNION {
    graph <https://github.com/Bayer-Group/kge/virtualGraphs> {
     ?vg  kge:belongsToDB <${uri}>;
          kge:vGraphName  ?g
    }
    }
  }

  `
}

export const sparqlOutgoingIncomingDefaultGraph = (defaultGraphsList, uri, flag ) => {
  let triplesCondition;
  if (flag == "INCOMING") {
  triplesCondition =  `?s ?p <${uri}>.`
  } else {
  triplesCondition =  `<${uri}> ?p ?o.`
  }  

  return `
  UNION {
    values (?triplestoreDefault) {${defaultGraphsList}}
    graph <https://github.com/Bayer-Group/kge/triplestores> {
    ?triplestoreDefault a kge:Triplestore;
    rdfs:label ?label ;
    kge:password ?password ;
    kge:queryPath ?queryPath ;
    kge:runsOn ?triplestroreSystem ;
    kge:updatePath ?updatePath ;
    kge:user ?username ;
    }
    graph <https://github.com/Bayer-Group/kge/triplestoreSystems> {
    ?triplestroreSystem
    kge:host ?host ;
    kge:port ?port ;
    kge:protocol ?protocol .
    }
    
    bind ( coalesce(uri(concat(str(?protocol),"://",?username,":",?password,"@",str(?host),":",str(?port),str(?queryPath))), "") as ?connectionURI )
 #bind ( coalesce(uri(concat(str(?protocol),"://",str(?queryPath))), "") as ?connectionURI )  
     Service ?connectionURI {
      SELECT * {
      ${triplesCondition}  
    }}
    }}
  `;
};

/**
 * Sparql to retrieve incoming ressources for a given uri 
 * @param req request with labels body and attributes
 */
 export const classTableSparql = (req) => {
  let subjectFilter = `FILTER (?s in (`;
  req.attributes.forEach((attr, index) => {
    subjectFilter += index === 0 ? `<${attr}>` : `,<${attr}>`;
  });
subjectFilter += `)) `;
let predicateFilter = `FILTER (?p in (rdfs:label`;
req.labels.forEach(label => {
    predicateFilter += `,<${label}>`;
});
predicateFilter += `))`;
  return constants.QUERY_PREFIXES+`
  prefix kge:   <https://github.com/Bayer-Group/kge/> 
  construct {
  ?s ?p ?o.
}

where {
{  
  values (?triplestore ?namedGraphs) {${joinAsValuesList(req.dbConfig)}
} 
  
  graph <https://github.com/Bayer-Group/kge/triplestores> {
    ?triplestore a kge:Triplestore ;
		rdfs:label ?label ;
        kge:password    ?password ;
        kge:queryPath   ?queryPath ;
        kge:runsOn      ?triplestroreSystem ;
        kge:updatePath  ?updatePath ;
        kge:user        ?username ;
  }
  graph <https://github.com/Bayer-Group/kge/triplestoreSystems> {
    ?triplestroreSystem 
        kge:host      ?host ;
        kge:port      ?port ;
        kge:protocol  ?protocol .
  }
 
  bind ( coalesce(uri(concat(str(?protocol),"://",?username,":",?password,"@",str(?host),":",str(?port),str(?queryPath))), "") as ?connectionURI )
  #bind ( coalesce(uri(concat(str(?protocol),"://",str(?queryPath))), "") as ?connectionURI )
  Service ?connectionURI{
    SELECT * {
      graph ?namedGraphs{
        ?s ?p ?o.
        ${subjectFilter} 
        ${predicateFilter}
} } }} }
  `
}

/**
 * Generates sparql to store in redis cache
 * @param req request with labels body and attributes
 */
 export const classTableSparqlFromConfig = (req) => {
  let sparqlSelect = ``;
  let sparqlWhere = `?uri a <${req.classUri}> . `
  let sparqlConstruct = ``

  req.attributes.forEach(attr => {
      if (attr.uri == 'uri' && attr.display != 'uri') {
          sparqlSelect += `(?uri as ?${attr.display}) `;
      } else if (attr.uri == 'uri') {
          sparqlSelect += `?uri `;
          sparqlConstruct += `?uri`
      } else {
          sparqlSelect += `?${attr.display} `;
          sparqlWhere += ` OPTIONAL { ?uri <${attr.uri}> ?${attr.display} . }`
          sparqlConstruct += `?${attr.display}`
      }
  });
  return constants.QUERY_PREFIXES+`
PREFIX kge:   <https://github.com/Bayer-Group/kge/> SELECT DISTINCT ${sparqlSelect} 
where {
{  
  values (?triplestore ?namedGraphs) {${joinAsValuesList(req.dbConfig)}
} 
  
  graph <https://github.com/Bayer-Group/kge/triplestores> {
    ?triplestore a kge:Triplestore ; rdfs:label ?tripleStoreLabel ;
        kge:password    ?password ;
        kge:queryPath   ?queryPath ;
        kge:runsOn      ?triplestroreSystem ;
        kge:updatePath  ?updatePath ;
        kge:user        ?username ;
  }
  graph <https://github.com/Bayer-Group/kge/triplestoreSystems> {
    ?triplestroreSystem 
        kge:host      ?host ;
        kge:port      ?port ;
        kge:protocol  ?protocol .
  }
 
  bind ( coalesce(uri(concat(str(?protocol),'://',?username,':',?password,'@',str(?host),':',str(?port),str(?queryPath))), '') as ?connectionURI )
  #bind ( coalesce(uri(concat(str(?protocol),"://",str(?queryPath))), "") as ?connectionURI )
  Service ?connectionURI{
    SELECT * {
      graph ?namedGraphs{
        ${sparqlWhere}
      }
} } }}
  `
}

/**
 * SparQL to post stored queries to the TripleStore
 * @param host hostname of the rest endpoint
 * @param query Data that should be stored
 * @param uuid Unique identifier
 */
 export const sparqlPostClassTable = (host,query,uuid,user) => {
  let data = `INSERT DATA {
        GRAPH <https://github.com/Bayer-Group/kge/tableViews> {
        <${host}/classTable/${uuid}> <https://github.com/Bayer-Group/kge/creator> "${user}" ;
        <https://github.com/Bayer-Group/kge/creationDate> "${new Date().toISOString()}^^xsd:dateTime"
        }
      }`;
      return data;
}

  /**
   * Fetches the query path for savedgraphs and tableviews
   */
   export const sparqlGetBasicConfiguration = (datasetLabel) => {
    return constants.QUERY_PREFIXES+`
    prefix kge:   <https://github.com/Bayer-Group/kge/> 
    construct {
      ?triplestore kge:path ?triplestorePath .
     }
     WHERE {{
       graph <https://github.com/Bayer-Group/kge/basicConfiguration>{
         ?triplestore rdfs:label "${datasetLabel}" .
         ?triplestore kge:path ?triplestorePath .
       }
     }
}
    `
  }

  export const sparqlFetchTableViewsQuery= (host,uuid) => {
    // host = "https://github.com/Bayer-Group"
    return constants.QUERY_PREFIXES+`
    prefix kge:   <https://github.com/Bayer-Group/kge/> 
    construct {
      <${host}/classTable/${uuid}> <https://github.com/Bayer-Group/kge/hasStoredQuery> ?sparql .
     }
     WHERE { GRAPH <https://github.com/Bayer-Group/kge/tableViews>{
       {
        <${host}/classTable/${uuid}> <https://github.com/Bayer-Group/kge/hasStoredQuery> ?sparql .
       }
     }
}
    `
  }

  /**
 * Sparql to retrieve incoming ressources for a given class 
 * @param uri The baseUri for what the data should be fetched
 * @param dbconfig database configuration passed form the ui
 */
 export const sparqlIncomingClasses = (uri, dbconfig) => {
  let defaultGraphsList = joinDefaultGraphs(dbconfig);
  if (defaultGraphsList !== "") {
    defaultGraphsList =
    sparqlClassesIncomingDefaultGraph(defaultGraphsList, uri);
  } else {
    defaultGraphsList = `}`;
  }
  return constants.QUERY_PREFIXES+`
  prefix kge:   <https://github.com/Bayer-Group/kge/> 
  construct {
  ?s a <${uri}>;
  ?p2 ?o .
}

where {
{  
  values (?triplestore ?namedGraphs) {${joinAsValuesList(dbconfig)}
} 
  
  graph <https://github.com/Bayer-Group/kge/triplestores> {
    ?triplestore a kge:Triplestore ;
		rdfs:label ?label ;
        kge:password    ?password ;
        kge:queryPath   ?queryPath ;
        kge:runsOn      ?triplestroreSystem ;
        kge:updatePath  ?updatePath ;
        kge:user        ?username ;
  }
  graph <https://github.com/Bayer-Group/kge/triplestoreSystems> {
    ?triplestroreSystem 
        kge:host      ?host ;
        kge:port      ?port ;
        kge:protocol  ?protocol .
  }
 
  bind ( coalesce(uri(concat(str(?protocol),"://",?username,":",?password,"@",str(?host),":",str(?port),str(?queryPath))), "") as ?connectionURI )
  #bind ( coalesce(uri(concat(str(?protocol),"://",str(?queryPath))), "") as ?connectionURI )
  Service ?connectionURI{
    SELECT * {
      graph ?namedGraphs{
        ?s a <${uri}>   ;
        OPTIONAL{?s ?p2 ?o . 
}  FILTER (!isLITERAL(?o) || LANG(?o) = "" || LANG(?o) = "en")
}}
} }${defaultGraphsList}
  `
}


export const sparqlClassesIncomingDefaultGraph = (defaultGraphsList, uri) => {
  return `
  UNION {
    values (?triplestoreDefault) {${defaultGraphsList}}
    graph <https://github.com/Bayer-Group/kge/triplestores> {
    ?triplestoreDefault a kge:Triplestore;
    rdfs:label ?label ;
    kge:password ?password ;
    kge:queryPath ?queryPath ;
    kge:runsOn ?triplestroreSystem ;
    kge:updatePath ?updatePath ;
    kge:user ?username ;
    }
    graph <https://github.com/Bayer-Group/kge/triplestoreSystems> {
    ?triplestroreSystem
    kge:host ?host ;
    kge:port ?port ;
    kge:protocol ?protocol .
    }
    
    bind ( coalesce(uri(concat(str(?protocol),"://",?username,":",?password,"@",str(?host),":",str(?port),str(?queryPath))), "") as ?connectionURI )
    #bind ( coalesce(uri(concat(str(?protocol),"://",str(?queryPath))), "") as ?connectionURI )
     Service ?connectionURI {
      SELECT * {
      ?s a <${uri}>;
    }}
    }}
  `;
};

export function sparqlOutgoingVirtualGraphs( uri :string, dbConfig: DbConfig[])
{
    try {
       let virtualGraphs = dbConfig.filter(x=>x.virtualGraphs.length>0).map(x=>x.virtualGraphs[0])
        if(typeof virtualGraphs !== 'undefined' && virtualGraphs.length > 0){

          return  `CONSTRUCT {<${uri}> ?p ?o.}
          ${joinAsGraphsList(virtualGraphs)}
          WHERE { SELECT * 
          WHERE { <${uri}> ?p ?o.  }}`
        }
        else{
         return null
        }

    } catch (error) {
        logger.info("error in checkVirtualGraphsOutgoing", error);
        return null;
    }
}

export function sparqlIncomingVirtualGraphs( uri :string, dbConfig: DbConfig[])
{
    try {
       let virtualGraphs = dbConfig.filter(x=>x.virtualGraphs.length>0).map(x=>x.virtualGraphs[0])
        if(typeof virtualGraphs !== 'undefined' && virtualGraphs.length > 0){

          return  `CONSTRUCT {?s ?p <${uri}>;
               ?p2 ?o .
            ?o2 a ?s .}
          ${joinAsGraphsList(virtualGraphs)}
          WHERE { SELECT * 
          WHERE { ?s ?p <${uri}> .}}`
        }
        else{
         return null
        }

    } catch (error) {
        logger.info("error in checkVirtualGraphsOutgoing", error);
        return null;
    }
}

export const sparqlCheckEligibleUser = (user: string) => {
  return constants.QUERY_PREFIXES+`
  construct {
    ?s ?p ?o.
   }
   WHERE {{
     graph <https://github.com/Bayer-Group/kge/users>{
         ?s ?p ?o.
        ?s <http://github.com/Bayer-Group/kos/19014/hasEMailAddress> <mailto:${user}> .
     }
   }
}
  `
}
export function sparqlIncomingVirtualGraphClasses( uri :string, dbConfig: DbConfig[])
{
    try {
       let virtualGraphs = dbConfig.filter(x=>x.virtualGraphs.length>0).map(x=>x.virtualGraphs[0])
        if(typeof virtualGraphs !== 'undefined' && virtualGraphs.length > 0){

          return  `CONSTRUCT {
            ?s a <${uri}>;
             ?p2 ?o .
              }
          ${joinAsGraphsList(virtualGraphs)}
         # WHERE { SELECT * 
          WHERE {  ?s ?p2 ?o   .
         # OPTIONAL{?s ?p2 ?o . }
         # FILTER (!isLITERAL(?o) || LANG(?o) = "" || LANG(?o) = "en")
        #}
         }`
        }
        else{
         return null
        }

    } catch (error) {
        logger.info("error in checkVirtualGraphsOutgoing", error);
        return null;
    }
}