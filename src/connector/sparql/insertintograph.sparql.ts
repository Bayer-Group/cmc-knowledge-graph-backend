const TRIPLESTORES = require("../../config/config"); // /config

export const insertIntoGraph = (query, dbconfig, optionalQuery?) => {

    let queryWithOptional = query;
    if (optionalQuery) {
      queryWithOptional += `\n${optionalQuery}`;
    }

    if (!dbconfig) {
      return `{ ${queryWithOptional} }`;
    }

    let queryString = "";
    dbconfig.forEach((db, i) => {
      let namedGraphString = "";
      if (!db.selectedNamedGraphs) {
        namedGraphString += `{ ${queryWithOptional} }`
      } else {
        db.selectedNamedGraphs.forEach((ngraph, nindex) => {
          if (ngraph === "") {
            namedGraphString += `{ ${queryWithOptional} } \n`;
          } else {
            namedGraphString += `{ GRAPH <${ngraph}> { ${queryWithOptional} } } \n`;
          }
          if (nindex !== db.selectedNamedGraphs.length - 1) namedGraphString += " UNION ";
        })
      }
      if (db.searchInDb!=undefined && db.searchInDb==false){
          namedGraphString="";
      }
      

      let virtualGraphString = "";
      if (db.virtualGraphs) {
        db.virtualGraphs.forEach((vgraph, vindex) => {
          if (vgraph) {
            // stardog throws an error if there are optional statements in a virtual graph query
            // let optionalPart = optionalQuery ? optionalQuery : ""
            virtualGraphString += `{ GRAPH <${vgraph}> { ${query} } }`;
            if (vindex !== db.virtualGraphs.length - 1) virtualGraphString += " UNION ";
          }
        })
      }
      if (i === 0) {
        queryString += `${namedGraphString} 
              ${namedGraphString !== "" && virtualGraphString !== "" ? "UNION" : ""}
              ${virtualGraphString}
        `;
      } else {
        const triplestore = TRIPLESTORES.config().tripleStores[db.instance];
        if (triplestore) {
          let endPoint = `${triplestore.protocol}://${triplestore.user}:${triplestore.password}@${triplestore.serviceHost}:${triplestore.port}${db.dbpath}`             
           // TODO refactor
          if (process.env.NODE_ENV=='local' || process.env.NODE_ENV=='' || !process.env.NODE_ENV){
            endPoint = `db:/${(db.dbpath as string).substr(0, db.dbpath.length-6)}` // TODO make it clean;
          }

          queryString += `
            { 
              SERVICE <${endPoint}>{ 
                ${namedGraphString}
                ${namedGraphString !== "" && virtualGraphString !== "" ? "UNION" : ""}
                ${virtualGraphString}
              } 
            }
          `
        }
      }
      if (i !== dbconfig.length - 1) queryString += " UNION ";
    })
    return queryString;
  }



  export const insertIntoVirtualGraph = (query, uriList, dbconfig) => {
    let queryString = ""

    dbconfig.forEach((db, i) => {
      
      const triplestore = TRIPLESTORES.config().tripleStores[db.instance];
      if (triplestore) {
        let endPoint = `${triplestore.protocol}://${triplestore.user}:${triplestore.password}@${triplestore.serviceHost}:${triplestore.port}${db.dbpath}`
        
        let virtualGraphString = "";
        if (db.virtualGraphs) {
          db.virtualGraphs.forEach((vgraph, vindex) => {
            if (vgraph) {
              uriList.forEach((uri, uIndex) => {
                virtualGraphString += `{ GRAPH <${vgraph}> { ${query(uri)} } }`;
                if (vindex !== db.virtualGraphs.length - 1 || uIndex != uriList.length-1) 
                  virtualGraphString += " UNION ";
              });
            }
          })
        }

        if (virtualGraphString.length > 0){
          queryString += `
            { 
              SERVICE <${endPoint}>{ 
                ${virtualGraphString}
              } 
            }
          `
          if (i !== dbconfig.length - 1) queryString += " UNION ";
        }
      }
    })

    return queryString
  }


  export const insertIntoGraphClassSelect = (query, dbconfig, optionalQuery?) => {

    let queryWithOptional = query;
    if (optionalQuery) {
      queryWithOptional += `\n${optionalQuery}`;
    }

    if (!dbconfig) {
      return `{ ${queryWithOptional} }`;
    }

    let queryString = "";
    dbconfig.forEach((db, i) => {
      let namedGraphString = "";
      if (!db.selectedNamedGraphs) {
        namedGraphString += `{ ${queryWithOptional} }`
      } else {
        db.selectedNamedGraphs.forEach((ngraph, nindex) => {
          if (ngraph === "") {
            namedGraphString += `{ ${queryWithOptional} } \n`;
          } else {
            namedGraphString += `{ GRAPH <${ngraph}> { ${queryWithOptional} } } \n`;
          }
          if (nindex !== db.selectedNamedGraphs.length - 1) namedGraphString += " OPTIONAL ";
        })
      }
      if (db.searchInDb!=undefined && db.searchInDb==false){
          namedGraphString="";
      }
      

      let virtualGraphString = "";
      if (db.virtualGraphs) {
        db.virtualGraphs.forEach((vgraph, vindex) => {
          if (vgraph) {
            // stardog throws an error if there are optional statements in a virtual graph query
            // let optionalPart = optionalQuery ? optionalQuery : ""
            virtualGraphString += `{ GRAPH <${vgraph}> { ${query} } }`;
            if (vindex !== db.virtualGraphs.length - 1) virtualGraphString += " OPTIONAL ";
          }
        })
      }
      if (i === 0) {
        queryString += `${namedGraphString} 
              ${namedGraphString !== "" && virtualGraphString !== "" ? "OPTIONAL" : ""}
              ${virtualGraphString}
        `;
      } else {
        const triplestore = TRIPLESTORES.config().tripleStores[db.instance];
        if (triplestore) {
          let endPoint = `${triplestore.protocol}://${triplestore.user}:${triplestore.password}@${triplestore.serviceHost}:${triplestore.port}${db.dbpath}`             
           // TODO refactor
          if (process.env.NODE_ENV=='local' || process.env.NODE_ENV=='' || !process.env.NODE_ENV){
            endPoint = `db:/${(db.dbpath as string).substr(0, db.dbpath.length-6)}` // TODO make it clean;
          }

          queryString += `
            { 
              SERVICE <${endPoint}>{ 
                ${namedGraphString}
                ${namedGraphString !== "" && virtualGraphString !== "" ? "OPTIONAL" : ""}
                ${virtualGraphString}
              } 
            }
          `
        }
      }
      if (i !== dbconfig.length - 1) queryString += " OPTIONAL ";
    })
    return queryString;
  }