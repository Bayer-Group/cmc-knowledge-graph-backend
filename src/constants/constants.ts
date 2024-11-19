// all constants used accross the project
const constants = {
    RDF_TYPE: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
    RDF_CLASS: "http://www.w3.org/2000/01/rdf-schema#Class",
    RDF_INTEGER_SURFIX: "^^http://www.w3.org/2001/XMLSchema#integer",
    OWL_CLASS: "http://www.w3.org/2002/07/owl#Class",
    CONTENT_TYPE_SPARQL: "application/sparql-query; charset=UTF-8",
    CONTENT_TYPE_SPARQL_UPDATE: "application/sparql-update",
    ACCEPT_SPARQL_JSON: "application/sparql-results+json",
    ACCEPT_NQUADS: "application/n-triples",
    QUERY_PREFIXES: `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> PREFIX eco: <http://github.com/Bayer-Group/kos/19014/>`,
    TABLE_VIEWS: "TableViews",
    SAVED_GRAPHS: "SavedGraphs"
}

export default constants;