import express = require('express');
const router = express.Router();

const https = require('https');
const axios = require('axios');
// const hostName1 ='http://backbone-alb-770778818.eu-central-1.elb.amazonaws.com' // DEV
const hostName1 = 'http://backbone-alb-423691152.eu-central-1.elb.amazonaws.com'   // QA
const path1 = "/test/query"
const port1 = 5820
// const authCode1 = "YWRtaW46OWZkMGQ3MDc0ZDUwYzMzZA=="
const authCode1 = "Z2d2Y206RWI4M0dvODA="

/////////////////// Codes  /////////////////// 

router.get('/codes', (req, res) => {
    console.log("GET aufgerufen mit /api/codes " + req.query.medical_definition_id);
    if (req.query.medical_definition_id) {
        console.log("using query: codesViaMedicalDefinitionID")
        let data = codesViaMedicalDefinitionID(req.query.medical_definition_id)

        console.log(data)
        let completePath = hostName1 + ":" + port1 + path1

        let options = {
            hostname: hostName1,
            port: port1,
            path: path1,
            method: 'POST',
            headers: {
                'Content-Type': 'application/sparql-query',
                'Authorization': `Basic ${authCode1}`,
                'Accept': 'text/csv',
                'Content-Length': data.length + 3
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        }

        axios.post(completePath, data, options)
            .then(res2 => {
                console.log(`statusCode: ${res2.status}`)
                console.log(res2.data)
                res.status(200).send(res2.data);
            })
            .catch(error => {
                console.error(error)
                res.status(500).send(`query could not be executed successfully. Following query was send to stardog \n${data}`)
            })
    }
    else { res.status(400).send("no url parameter medical_definition_id specified") }
})


// # Query fails on Stardog. I don't know why. It works on CONEDG.

// # restapi_codes_via_medical-definition-id.rq
// # REST_API_URI/codes?medical-definition-id=https://pid.bayer.com/5c982019-c57b-4391-9e63-28d44429ef17/4b762e61-8269-9739-9acd-0b1c490315bb
// # Query: Get all vocabulary codes and respective labels for a specific Medical Definition based on its ID.
// # Note: It may be that no codes are assigned to the specified Medical Definition.
// # Input: medical_definition_id
// # Output: code_system | code | code_label
// # Error handling: When querying a medical_definition_id, which is not present in the data, an empty result is returned.
function codesViaMedicalDefinitionID(id) {
    return `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rwdso: <https://pid.bayer.com/a30b1825-d421-46d0-b25e-a7e36d44a866/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT
?code_system
?code
?code_label
WHERE {
    SERVICE <http://vpce-08241da16023adfbc-ilgj17zi.vpce-svc-0c680ea76f33130a4.eu-central-1.vpce.amazonaws.com/edg/tbl/sparql> {
        BIND(<${id}> AS ?medical_definition_uri) # Insert input variable
        GRAPH <urn:x-evn-master:medical_definition_library> {
            ?medical_definition_uri rdf:type rwdso:MedicalDefinition .
        }
        {
            BIND("ATC" AS ?code_system)
            ?medical_definition_uri rwdso:relatedToConceptInATC ?concept_uri .
            GRAPH <urn:x-evn-master:atc__umls2019ab__classes_as_instances> {
                ?concept_uri skos:notation ?code ; skos:prefLabel ?label_lang . FILTER langMatches(lang(?label_lang), "EN")
            }
        }
        UNION
        {
            BIND("ICD-9-CM" AS ?code_system)
            ?medical_definition_uri rwdso:relatedToConceptInICD9CM ?concept_uri .
            GRAPH <urn:x-evn-master:icd9cm__umls2019ab__classes_as_instances> {
                ?concept_uri skos:notation ?code ; skos:prefLabel ?label_lang . FILTER langMatches(lang(?label_lang), "EN")
            }
        }
        UNION
        {
            BIND("ICD-10-CM" AS ?code_system)
            ?medical_definition_uri rwdso:relatedToConceptInICD10CM ?concept_uri .
            GRAPH <urn:x-evn-master:icd10cm__umls2019ab__classes_as_instances> {
                ?concept_uri skos:notation ?code ; skos:prefLabel ?label_lang . FILTER langMatches(lang(?label_lang), "EN")
            }
        }
        UNION
        {
            BIND("ICD-10-PCS" AS ?code_system)
            ?medical_definition_uri rwdso:relatedToConceptInICD10PCS ?concept_uri .
            GRAPH <urn:x-evn-master:icd10pcs__umls2019ab__classes_as_instances> {
                ?concept_uri skos:notation ?code ; skos:prefLabel ?label_lang . FILTER langMatches(lang(?label_lang), "EN")
            }
        }
        UNION
        {
            BIND("SNOMED CT" AS ?code_system)
            ?medical_definition_uri rwdso:relatedToConceptInSNOMEDCT ?concept_uri .
            GRAPH <urn:x-evn-master:snomed_ct__umls2020aa__classes_as_instances> {
                ?concept_uri skos:notation ?code ; skos:prefLabel ?label_lang . FILTER langMatches(lang(?label_lang), "EN")
            }
        }
        UNION
        {
            BIND("LOINC" AS ?code_system)
            ?medical_definition_uri rwdso:relatedToConceptInLOINC ?concept_uri .
            GRAPH <urn:x-evn-master:loinc__umls2020ab__classes_as_instances> {
                ?concept_uri skos:notation ?code ; skos:prefLabel ?label_lang . FILTER langMatches(lang(?label_lang), "EN")
            }
        }
        UNION
        {
            BIND("CPT" AS ?code_system)
            ?medical_definition_uri rwdso:relatedToCodeInCPT ?code .
        }
        UNION
        {
            BIND("HCPCS" AS ?code_system)
            ?medical_definition_uri rwdso:relatedToCodeInHCPCS ?code .
        }
        UNION
        {
            BIND("READ2" AS ?code_system)
            ?medical_definition_uri rwdso:relatedToCodeInRCTV2 ?code .
        }
        UNION
        {
            BIND("READ3" AS ?code_system)
            ?medical_definition_uri rwdso:relatedToCodeInCTV3 ?code .
        }
        UNION
        {
            BIND("NDC" AS ?code_system)
            ?medical_definition_uri rwdso:relatedToCodeInNDC ?code .
        }
        BIND(STR(?label_lang) as ?code_label)
    }
}
ORDER BY ?medical_definition_label ?code_system ?code
`}

/////////////////////////////////////////////////////////////
/////////////////////// RWD Projects ////////////////////////
/////////////////////////////////////////////////////////////

router.get('/api/rwd-projects', (req, res) => {
    console.log("GET aufgerufen mit /api/rwd_projects ");
    let data  = medicalDefinitions()
    if (req.query.id) {
        console.log("using query: rwdProjectsViaProjectID")
        data = rwdProjectsViaProjectID(req.query.id)
    }
    else {
        if (req.query.name) {
            console.log("using query: rwdProjectsViaProjectName")
            data = rwdProjectsViaProjectName(req.query.name)
        }
        else {
            if (req.query.search) {
                console.log("using query: rwdProjectsViaProjectNameSearch")
                data = rwdProjectsViaProjectNameSearch(req.query.search)
            }

        }
    }

    console.log(data)
    let completePath = hostName1 + ":" + port1 + path1

    let options = {
        hostname: hostName1,
        port: port1,
        path: path1,
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Authorization': `Basic ${authCode1}`,
            'Accept': 'text/csv',
            'Content-Length': data.length + 3
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    }

    axios.post(completePath, data, options)
        .then(res2 => {
            console.log(`statusCode: ${res2.status}`)
            console.log(res2.data)
            res.status(200).send(res2.data);
        })
        .catch(error => {
            console.error(error)
            res.status(500).send(`query could not be executed successfully. Following query was send to stardog \n${data}`)
        })
})

// # Query fails on Stardog. I don't know why. It works on CONEDG.

// # restapi_rwd-projects_via_rwd-project-id.rq
// # REST_API_URI/rwd-projects?id=https://pid.bayer.com/16ee9534-730b-439f-b4f2-adea578c6e66/0a933218-080b-47c1-a743-3601c8db0cef
// # Query: Get metadata of a specific RWD Project based on its ID.
// # Input: rwd_project_id
// # Output: rwd_project_id | rwd_project_type | rwd_project_name | rwd_project_description | therapeutic_areas | compounds | countries | data_sources
// # Does not include: code repositories | study protocol | related literatue | related medical definitions and their roles
// # Error handling: When querying a rwd_project_id, which is not present in the data, an empty result is returned.
function rwdProjectsViaProjectID(id) {
    return `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rwdso: <https://pid.bayer.com/a30b1825-d421-46d0-b25e-a7e36d44a866/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT
(STR(?rwd_project_uri) as ?rwd_project_id)
(STR(?rwd_project_type_label) as ?rwd_project_type)
(STR(?rwd_project_label) AS ?rwd_project_name)
(STR(?rwd_project_comment) AS ?rwd_project_description)
(GROUP_CONCAT(DISTINCT ?therapeutic_area_label; separator="|") as ?therapeutic_areas)
(GROUP_CONCAT(DISTINCT ?compound_label; separator="|") as ?compounds)
(GROUP_CONCAT(DISTINCT ?country_label; separator="|") as ?countries)
(GROUP_CONCAT(DISTINCT ?data_source_label; separator="|") as ?data_sources)
WHERE {
    SERVICE <http://vpce-08241da16023adfbc-ilgj17zi.vpce-svc-0c680ea76f33130a4.eu-central-1.vpce.amazonaws.com/edg/tbl/sparql> {
        BIND(<${id}> AS ?rwd_project_uri) # Insert input variable
        VALUES ?rwd_project_types { rwdso:RWDProject rwdso:MedicalDefinitionCollection rwdso:RWDFeasibilityRequest rwdso:RWDLandscaping rwdso:RWDStudy }
        GRAPH <urn:x-evn-master:rwd_project_builder> {
            ?rwd_project_uri rdf:type ?rwd_project_types .
            GRAPH <urn:x-evn-master:rwd_store_ontology> { ?rwd_project_types rdfs:label ?rwd_project_type_label . }
            ?rwd_project_uri rdfs:label ?rwd_project_label .
            OPTIONAL { ?rwd_project_uri rdfs:comment ?rwd_project_comment . }
            OPTIONAL {
                ?rwd_project_uri rwdso:hasTherapeuticArea ?therapeutic_area_uri
                GRAPH <urn:x-evn-master:therapeutic_areas_for_rwd_store> {
                    ?therapeutic_area_uri skos:prefLabel ?therapeutic_area_label .
                }
            }
            OPTIONAL {
                ?rwd_project_uri rwdso:hasCompound ?compound_uri .
                GRAPH <urn:x-evn-master:compounds_for_rwd_store> { 
                    ?compound_uri rdfs:label ?compound_label .
                }
            }
            OPTIONAL {
                ?rwd_project_uri rwdso:specificForCountry ?country_uri .
                GRAPH <urn:x-evn-master:iso_country_codes> {
                    ?country_uri skos:prefLabel ?country_label .
                    FILTER langMatches(lang(?country_label), "EN")
                }
            }
            OPTIONAL {
                ?rwd_project_uri rwdso:usesDataSource ?data_source_uri .
                GRAPH <urn:x-evn-master:rwd_sources_from_colid> {
                    ?data_source_uri rdfs:label ?data_source_label .
                }
            }
        }
    }
}
GROUP BY ?rwd_project_uri ?rwd_project_type_label ?rwd_project_label ?rwd_project_comment
ORDER BY ?rwd_project_type_label ?rwd_project_label
`}

// # Query fails on Stardog. I don't know why. It works on CONEDG.

// # restapi_rwd-projects_via_rwd-project-name.rq
// # REST_API_URI/rwd-projects?name=[TEST]%20Test%20Project
// # Query: Get metadata of specific RWD Project(s) based on a specific RWD Project name.
// # Note: Since this query is based on name (instead of ID), the result may include multiple RWD Projects that have the same name, but different IDs and possibly different metadata.
// # Input: rwd_project_name
// # Output: rwd_project_id | rwd_project_type | rwd_project_name | rwd_project_description | therapeutic_areas | compounds | countries | data_sources
// # Does not include: code repositories | study protocol | related literatue | related medical definitions and their roles
// # Error handling: When querying a rwd_project_name, which is not present in the data, an empty result is returned.
function rwdProjectsViaProjectName(name) {
    return `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rwdso: <https://pid.bayer.com/a30b1825-d421-46d0-b25e-a7e36d44a866/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT
(STR(?rwd_project_uri) as ?rwd_project_id)
(STR(?rwd_project_type_label) as ?rwd_project_type)
(STR(?rwd_project_label) AS ?rwd_project_name)
(STR(?rwd_project_comment) AS ?rwd_project_description)
(GROUP_CONCAT(DISTINCT ?therapeutic_area_label; separator="|") as ?therapeutic_areas)
(GROUP_CONCAT(DISTINCT ?compound_label; separator="|") as ?compounds)
(GROUP_CONCAT(DISTINCT ?country_label; separator="|") as ?countries)
(GROUP_CONCAT(DISTINCT ?data_source_label; separator="|") as ?data_sources)
WHERE {
    SERVICE <http://vpce-08241da16023adfbc-ilgj17zi.vpce-svc-0c680ea76f33130a4.eu-central-1.vpce.amazonaws.com/edg/tbl/sparql> {
        BIND("${name} AS ?rwd_project_label) # Insert input variable
        VALUES ?rwd_project_types { rwdso:RWDProject rwdso:MedicalDefinitionCollection rwdso:RWDFeasibilityRequest rwdso:RWDLandscaping rwdso:RWDStudy }
        GRAPH <urn:x-evn-master:rwd_project_builder> {
            ?rwd_project_uri rdf:type ?rwd_project_types .
            GRAPH <urn:x-evn-master:rwd_store_ontology> { ?rwd_project_types rdfs:label ?rwd_project_type_label . }
            ?rwd_project_uri rdfs:label ?rwd_project_label .
            OPTIONAL { ?rwd_project_uri rdfs:comment ?rwd_project_comment . }
            OPTIONAL {
                ?rwd_project_uri rwdso:hasTherapeuticArea ?therapeutic_area_uri
                GRAPH <urn:x-evn-master:therapeutic_areas_for_rwd_store> {
                    ?therapeutic_area_uri skos:prefLabel ?therapeutic_area_label .
                }
            }
            OPTIONAL {
                ?rwd_project_uri rwdso:hasCompound ?compound_uri .
                GRAPH <urn:x-evn-master:compounds_for_rwd_store> { 
                    ?compound_uri rdfs:label ?compound_label .
                }
            }
            OPTIONAL {
                ?rwd_project_uri rwdso:specificForCountry ?country_uri .
                GRAPH <urn:x-evn-master:iso_country_codes> {
                    ?country_uri skos:prefLabel ?country_label .
                    FILTER langMatches(lang(?country_label), "EN")
                }
            }
            OPTIONAL {
                ?rwd_project_uri rwdso:usesDataSource ?data_source_uri .
                GRAPH <urn:x-evn-master:rwd_sources_from_colid> {
                    ?data_source_uri rdfs:label ?data_source_label .
                }
            }
        }
    }
}
GROUP BY ?rwd_project_uri ?rwd_project_type_label ?rwd_project_label ?rwd_project_comment
ORDER BY ?rwd_project_type_label ?rwd_project_label
`}

// # Query fails on Stardog. I don't know why. It works on CONEDG.

// # restapi_rwd-projects_via_rwd-project-name-search.rq
// # REST_API_URI/rwd-projects?search=study
// # Query: Get metadata of RWD Project(s) the name of which match the entered search term.
// # Note: Since this query is based on name (instead of ID), the result may include multiple RWD Projects that have the same name, but different IDs and possibly different metadata.
// # Input: search term for rwd_project_name
// # Output: rwd_project_id | rwd_project_type | rwd_project_name | rwd_project_description | therapeutic_areas | compounds | countries | data_sources
// # Does not include: code repositories | study protocol | related literatue | related medical definitions and their roles
// # Error handling: When querying a search term which does not have a match in the data, an empty result is returned.
function rwdProjectsViaProjectNameSearch(name) {
    return `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rwdso: <https://pid.bayer.com/a30b1825-d421-46d0-b25e-a7e36d44a866/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT
(STR(?rwd_project_uri) as ?rwd_project_id)
(STR(?rwd_project_type_label) as ?rwd_project_type)
(STR(?rwd_project_label) AS ?rwd_project_name)
(STR(?rwd_project_comment) AS ?rwd_project_description)
(GROUP_CONCAT(DISTINCT ?therapeutic_area_label; separator="|") as ?therapeutic_areas)
(GROUP_CONCAT(DISTINCT ?compound_label; separator="|") as ?compounds)
(GROUP_CONCAT(DISTINCT ?country_label; separator="|") as ?countries)
(GROUP_CONCAT(DISTINCT ?data_source_label; separator="|") as ?data_sources)
WHERE {
    SERVICE <http://vpce-08241da16023adfbc-ilgj17zi.vpce-svc-0c680ea76f33130a4.eu-central-1.vpce.amazonaws.com/edg/tbl/sparql> {
        VALUES ?rwd_project_types { rwdso:RWDProject rwdso:MedicalDefinitionCollection rwdso:RWDFeasibilityRequest rwdso:RWDLandscaping rwdso:RWDStudy }
        GRAPH <urn:x-evn-master:rwd_project_builder> {
            ?rwd_project_uri rdf:type ?rwd_project_types .
            GRAPH <urn:x-evn-master:rwd_store_ontology> { ?rwd_project_types rdfs:label ?rwd_project_type_label . }
            ?rwd_project_uri rdfs:label ?rwd_project_label . FILTER regex(?rwd_project_label, "${name}", "i") # Insert input variable
            OPTIONAL { ?rwd_project_uri rdfs:comment ?rwd_project_comment . }
            OPTIONAL {
                ?rwd_project_uri rwdso:hasTherapeuticArea ?therapeutic_area_uri
                GRAPH <urn:x-evn-master:therapeutic_areas_for_rwd_store> {
                    ?therapeutic_area_uri skos:prefLabel ?therapeutic_area_label .
                }
            }
            OPTIONAL {
                ?rwd_project_uri rwdso:hasCompound ?compound_uri .
                GRAPH <urn:x-evn-master:compounds_for_rwd_store> { 
                    ?compound_uri rdfs:label ?compound_label .
                }
            }
            OPTIONAL {
                ?rwd_project_uri rwdso:specificForCountry ?country_uri .
                GRAPH <urn:x-evn-master:iso_country_codes> {
                    ?country_uri skos:prefLabel ?country_label .
                    FILTER langMatches(lang(?country_label), "EN")
                }
            }
            OPTIONAL {
                ?rwd_project_uri rwdso:usesDataSource ?data_source_uri .
                GRAPH <urn:x-evn-master:rwd_sources_from_colid> {
                    ?data_source_uri rdfs:label ?data_source_label .
                }
            }
        }
    }
}
GROUP BY ?rwd_project_uri ?rwd_project_type_label ?rwd_project_label ?rwd_project_comment
ORDER BY ?rwd_project_type_label ?rwd_project_label
`}

/////////////////////////////////////////////////////////////
/////////////////// Medical Definitions   /////////////////// 
/////////////////////////////////////////////////////////////

router.get('/api/medical-definitions', (req, res) => {
    console.log("GET aufgerufen mit /api/medical-definitions " + req.query.name + " " + req.query.rwd_project_id);
        let data = medicalDefinitions ()
    if (req.query.id) {
        console.log("using query: medicalDefinitionsViaMedicalDefinitionID")
        data = medicalDefinitionsViaMedicalDefinitionID(req.query.id)
    }
    else {
        if (req.query.name && req.query.rwd_project_name) {
            console.log("using query: medicalDefinitionsViaRDWProjectName_medicalDefinitionName")
            data = medicalDefinitionsViaRDWProjectName_medicalDefinitionName(req.query.rwd_project_name, req.query.name)
        } else {
            if (req.query.name && req.query.rwd_project_id) {
                console.log("using query: medicalDefinitionsViaRDWProjectID_medicalDefinitionName")
                data = medicalDefinitionsViaRDWProjectID_medicalDefinitionName(req.query.rwd_project_id, req.query.name)
            }
            else {
                if (req.query.name) {
                    console.log("using query: medicalDefinitionsViaMedicalDefinitionName")
                    data = medicalDefinitionsViaMedicalDefinitionName(req.query.name)
                }
                else {
                    if (req.query.search) {
                        console.log("using query: medicalDefinitionsViaMedicalDefinitionNameSearch")
                        data = medicalDefinitionsViaMedicalDefinitionNameSearch(req.query.search)
                    }
                    else {
                        if (req.query.rwd_project_id) {
                            console.log("using query: medicalDefinitionsViaRDWProjectID")
                            data = medicalDefinitionsViaRDWProjectID(req.query.rwd_project_id)
                        }
                        else {
                            if (req.query.rwd_project_name) {
                                console.log("using query: medicalDefinitionsViaRDWProjectName")
                                data = medicalDefinitionsViaRDWProjectName(req.query.rwd_project_id)
                            }

                        }
                    }
                }
            }
        }
    }

    console.log(data)
    let completePath = hostName1 + ":" + port1 + path1

    let options = {
        hostname: hostName1,
        port: port1,
        path: path1,
        method: 'POST',
        headers: {
            'Content-Type': 'application/sparql-query',
            'Authorization': `Basic ${authCode1}`,
            'Accept': 'text/csv',
            'Content-Length': data.length + 3
        },
        httpsAgent: new https.Agent({
            rejectUnauthorized: false
        })
    }

    axios.post(completePath, data, options)
        .then(res2 => {
            console.log(`statusCode: ${res2.status}`)
            console.log(res2.data)
            res.status(200).send(res2.data);
        })
        .catch(error => {
            console.error(error)
            res.status(500).send(`query could not be executed successfully. Following query was send to stardog \n${data}`)
        })
})

// # restapi_medical-definitions_via_medical-definition-id.rq
// # REST_API_URI/medical-definitions?id=https://pid.bayer.com/5c982019-c57b-4391-9e63-28d44429ef17/4b762e61-8269-9739-9acd-0b1c490315bb
// # Query: Get metadata of a specific Medical Definition based on its ID.
// # Input: medical_definition_id
// # Output: medical_definition_id | medical_definition_name | medical_definition_description | therapeutic_areas
// # Does not include: related validation studies | related literature | related codes | related rwd projects
// # Error handling: When querying a medical_definition_id, which is not present in the data, an empty result is returned.

function medicalDefinitions(){return `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rwdso: <https://pid.bayer.com/a30b1825-d421-46d0-b25e-a7e36d44a866/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT
(STR(?medical_definition_uri) as ?medical_definition_id)
(STR(?medical_definition_label) AS ?medical_definition_name)
(STR(?medical_definition_comment) AS ?medical_definition_description)
(GROUP_CONCAT(DISTINCT ?therapeutic_area_label; separator="|") as ?therapeutic_areas)
WHERE {
    SERVICE <http://vpce-08241da16023adfbc-ilgj17zi.vpce-svc-0c680ea76f33130a4.eu-central-1.vpce.amazonaws.com/edg/tbl/sparql> {
        GRAPH <urn:x-evn-master:medical_definition_library> {
            ?medical_definition_uri rdf:type rwdso:MedicalDefinition ;
                                    rdfs:label ?medical_definition_label .
            OPTIONAL { ?medical_definition_uri rdfs:comment ?medical_definition_comment . }
            OPTIONAL {
                ?medical_definition_uri rwdso:hasTherapeuticArea ?therapeutic_area_uri .
                GRAPH <urn:x-evn-master:therapeutic_areas_for_rwd_store> {
                    ?therapeutic_area_uri skos:prefLabel ?therapeutic_area_label .
                }
            }
        }
    }
}
GROUP BY ?medical_definition_uri ?medical_definition_label ?medical_definition_comment

`}

// # restapi_medical-definitions_via_medical-definition-id.rq
// # REST_API_URI/medical-definitions?id=https://pid.bayer.com/5c982019-c57b-4391-9e63-28d44429ef17/4b762e61-8269-9739-9acd-0b1c490315bb
// # Query: Get metadata of a specific Medical Definition based on its ID.
// # Input: medical_definition_id
// # Output: medical_definition_id | medical_definition_name | medical_definition_description | therapeutic_areas
// # Does not include: related validation studies | related literature | related codes | related rwd projects
// # Error handling: When querying a medical_definition_id, which is not present in the data, an empty result is returned.

function medicalDefinitionsViaMedicalDefinitionID(id) {
    return `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rwdso: <https://pid.bayer.com/a30b1825-d421-46d0-b25e-a7e36d44a866/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT
(STR(?medical_definition_uri) as ?medical_definition_id)
(STR(?medical_definition_label) AS ?medical_definition_name)
(STR(?medical_definition_comment) AS ?medical_definition_description)
(GROUP_CONCAT(DISTINCT ?therapeutic_area_label; separator="|") as ?therapeutic_areas)
WHERE {
    SERVICE <http://vpce-08241da16023adfbc-ilgj17zi.vpce-svc-0c680ea76f33130a4.eu-central-1.vpce.amazonaws.com/edg/tbl/sparql> {
        BIND(<${id}> AS ?medical_definition_uri) 
        GRAPH <urn:x-evn-master:medical_definition_library> {
            ?medical_definition_uri rdf:type rwdso:MedicalDefinition ;
                                    rdfs:label ?medical_definition_label .
            OPTIONAL { ?medical_definition_uri rdfs:comment ?medical_definition_comment . }
            OPTIONAL {
                ?medical_definition_uri rwdso:hasTherapeuticArea ?therapeutic_area_uri .
                GRAPH <urn:x-evn-master:therapeutic_areas_for_rwd_store> {
                    ?therapeutic_area_uri skos:prefLabel ?therapeutic_area_label .
                }
            }
        }
    }
}
GROUP BY ?medical_definition_uri ?medical_definition_label ?medical_definition_comment

`
}

// # restapi_medical-definitions_via_medical-definition-name.rq
// # REST_API_URI/medical-definitions?name=[TEST]%20Test%20Definition
// # Query: Get metadata of specific Medical Definition(s) based on a specific Medical Definition name.
// # Note: Since this query is based on name (instead of ID), the result may include multiple Medical Definitions that have the same name, but different IDs and possibly different metadata.
// # Input: medical_definition_name
// # Output: medical_definition_id | medical_definition_name | medical_definition_description | therapeutic_areas
// # Does not include: related validation studies | related literature | related codes | related rwd projects
// # Error handling: When querying a medical_definition_name, which is not present in the data, an empty result is returned.
function medicalDefinitionsViaMedicalDefinitionName(name) {
    return `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rwdso: <https://pid.bayer.com/a30b1825-d421-46d0-b25e-a7e36d44a866/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT
(STR(?medical_definition_uri) as ?medical_definition_id)
(STR(?medical_definition_label) AS ?medical_definition_name)
(STR(?medical_definition_comment) AS ?medical_definition_description)
(GROUP_CONCAT(DISTINCT ?therapeutic_area_label; separator="|") as ?therapeutic_areas)
WHERE {
    SERVICE <http://vpce-08241da16023adfbc-ilgj17zi.vpce-svc-0c680ea76f33130a4.eu-central-1.vpce.amazonaws.com/edg/tbl/sparql> {
        BIND("${name}" AS ?medical_definition_label) # Insert input variable
        GRAPH <urn:x-evn-master:medical_definition_library> {
            ?medical_definition_uri rdf:type rwdso:MedicalDefinition ;
                                    rdfs:label ?medical_definition_label .
            OPTIONAL { ?medical_definition_uri rdfs:comment ?medical_definition_comment . }
            OPTIONAL {
                ?medical_definition_uri rwdso:hasTherapeuticArea ?therapeutic_area_uri .
                GRAPH <urn:x-evn-master:therapeutic_areas_for_rwd_store> {
                    ?therapeutic_area_uri skos:prefLabel ?therapeutic_area_label .
                }
            }
        }
    }
}
GROUP BY ?medical_definition_uri ?medical_definition_label ?medical_definition_comment
`
}

// # restapi_medical-definitions_via_medical-definition-name-search.rq
// # REST_API_URI/medical-definitions?search=heart
// # Query: Get metadata of specific Medical Definition(s) the name of which match the entered search term.
// # Note: Since this query is based on name (instead of ID), the result may include multiple Medical Definitions that have the same name, but different IDs and possibly different metadata.
// # Input: search term for medical_definition_name
// # Output: medical_definition_id | medical_definition_name | medical_definition_description | therapeutic_areas
// # Does not include: related validation studies | related literature | related codes | related rwd projects
// # Error handling: When querying a search term which does not have a match in the data, an empty result is returned.
function medicalDefinitionsViaMedicalDefinitionNameSearch(name) {
    return `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rwdso: <https://pid.bayer.com/a30b1825-d421-46d0-b25e-a7e36d44a866/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT
(STR(?medical_definition_uri) as ?medical_definition_id)
(STR(?medical_definition_label) AS ?medical_definition_name)
(STR(?medical_definition_comment) AS ?medical_definition_description)
(GROUP_CONCAT(DISTINCT ?therapeutic_area_label; separator="|") as ?therapeutic_areas)
WHERE {
    SERVICE <http://vpce-08241da16023adfbc-ilgj17zi.vpce-svc-0c680ea76f33130a4.eu-central-1.vpce.amazonaws.com/edg/tbl/sparql> {
        GRAPH <urn:x-evn-master:medical_definition_library> {
            ?medical_definition_uri rdf:type rwdso:MedicalDefinition ;
                                    rdfs:label ?medical_definition_label . FILTER regex(?medical_definition_label, "${name}", "i") # Insert input variable
            OPTIONAL { ?medical_definition_uri rdfs:comment ?medical_definition_comment . }
            OPTIONAL {
                ?medical_definition_uri rwdso:hasTherapeuticArea ?therapeutic_area_uri .
                GRAPH <urn:x-evn-master:therapeutic_areas_for_rwd_store> {
                    ?therapeutic_area_uri skos:prefLabel ?therapeutic_area_label .
                }
            }
        }
    }
}
GROUP BY ?medical_definition_uri ?medical_definition_label ?medical_definition_comment
ORDER BY ?medical_definition_label

`
}

// # Query fails on Stardog. I don't know why. It works on CONEDG. 

// # restapi_medical-definitions_via_rwd-project-id.rq
// # REST_API_URI/medical-definitions?rwd-project-id=https://pid.bayer.com/16ee9534-730b-439f-b4f2-adea578c6e66/0a933218-080b-47c1-a743-3601c8db0cef
// # Query: Get a list of all Medical Definitions with their metadata for a specific RWD Project based on a specific RWD Project ID.
// # Note: It may be that no Medical Definitions are assigned to the specified RWD Project.
// # Input: rwd_project_id
// # Output: rwd_project_id | medical_definition_id | medical_definition_name | medical_definition_description | therapeutic_areas
// # Does not include: related validation studies | related literature | related codes
// # Error handling: When querying a rwd_project_id, which is not present in the data, an empty result is returned.
function medicalDefinitionsViaRDWProjectID(projectID) {
    return `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rwdso: <https://pid.bayer.com/a30b1825-d421-46d0-b25e-a7e36d44a866/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT
(STR(?rwd_project_uri) as ?rwd_project_id)
(STR(?medical_definition_uri) as ?medical_definition_id)
(STR(?medical_definition_label) AS ?medical_definition_name)
(STR(?medical_definition_comment) AS ?medical_definition_description)
(GROUP_CONCAT(DISTINCT ?therapeutic_area_label; separator="|") as ?therapeutic_areas)
WHERE {
    SERVICE <http://vpce-08241da16023adfbc-ilgj17zi.vpce-svc-0c680ea76f33130a4.eu-central-1.vpce.amazonaws.com/edg/tbl/sparql> {
        BIND(<${projectID}> AS ?rwd_project_uri) # Insert input variable
        VALUES ?rwd_project_types { rwdso:RWDProject rwdso:MedicalDefinitionCollection rwdso:RWDFeasibilityRequest rwdso:RWDLandscaping rwdso:RWDStudy }
        GRAPH <urn:x-evn-master:rwd_project_builder> {
            ?rwd_project_uri rdf:type ?rwd_project_types .
            OPTIONAL {
                ?rwd_project_uri rwdso:usesMedicalDefinition ?medical_definition_uri .
                GRAPH <urn:x-evn-master:medical_definition_library> {
                    ?medical_definition_uri rdf:type rwdso:MedicalDefinition ;
                                            rdfs:label ?medical_definition_label .
                    OPTIONAL { ?medical_definition_uri rdfs:comment ?medical_definition_comment . }
                    OPTIONAL {
                        ?medical_definition_uri rwdso:hasTherapeuticArea ?therapeutic_area_uri .
                        GRAPH <urn:x-evn-master:therapeutic_areas_for_rwd_store> {
                            ?therapeutic_area_uri skos:prefLabel ?therapeutic_area_label .
                        }
                    }
                }
            }
        }
    }
}
GROUP BY ?rwd_project_uri ?medical_definition_uri ?medical_definition_label ?medical_definition_comment
ORDER BY ?medical_definition_label
`
}

// # Query fails on Stardog. I don't know why. It works on CONEDG.

// # restapi_medical-definitions_via_rwd-project-name.rq
// # REST_API_URI/medical-definitions?rwd-project-name=[TEST]%20Test%20Project
// # Query: Get a list of all Medical Definitions with their metadata for specific RWD Project(s) based on a specific RWD Project name.
// # Note: Since this query is based on name (instead of ID), the result may include Medical Definitions of multiple RWD Projects that have the same name, but different IDs.
// # Note: It may be that no Medical Definitions are assigned to the specified RWD Project.
// # Input: rwd_project_name
// # Output: rwd_project_id | medical_definition_id | medical_definition_name | medical_definition_description | therapeutic_areas
// # Does not include: related validation studies | related literature | related codes
// # Error handling: When querying a rwd_project_name, which is not present in the data, an empty result is returned.
function medicalDefinitionsViaRDWProjectName(projectName) {
    return `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rwdso: <https://pid.bayer.com/a30b1825-d421-46d0-b25e-a7e36d44a866/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT
(STR(?rwd_project_uri) as ?rwd_project_id)
(STR(?medical_definition_uri) as ?medical_definition_id)
(STR(?medical_definition_label) AS ?medical_definition_name)
(STR(?medical_definition_comment) AS ?medical_definition_description)
(GROUP_CONCAT(DISTINCT ?therapeutic_area_label; separator="|") as ?therapeutic_areas)
WHERE {
    SERVICE <http://vpce-08241da16023adfbc-ilgj17zi.vpce-svc-0c680ea76f33130a4.eu-central-1.vpce.amazonaws.com/edg/tbl/sparql> {
        BIND("${projectName}" AS ?rwd_project_label) # Insert input variable
        VALUES ?rwd_project_types { rwdso:RWDProject rwdso:MedicalDefinitionCollection rwdso:RWDFeasibilityRequest rwdso:RWDLandscaping rwdso:RWDStudy }
        GRAPH <urn:x-evn-master:rwd_project_builder> {
            ?rwd_project_uri rdf:type ?rwd_project_types ;
                            rdfs:label ?rwd_project_label .
            OPTIONAL {
                ?rwd_project_uri rwdso:usesMedicalDefinition ?medical_definition_uri .
                GRAPH <urn:x-evn-master:medical_definition_library> {
                    ?medical_definition_uri rdf:type rwdso:MedicalDefinition ;
                                            rdfs:label ?medical_definition_label .
                    OPTIONAL { ?medical_definition_uri rdfs:comment ?medical_definition_comment . }
                    OPTIONAL {
                        ?medical_definition_uri rwdso:hasTherapeuticArea ?therapeutic_area_uri .
                        GRAPH <urn:x-evn-master:therapeutic_areas_for_rwd_store> {
                            ?therapeutic_area_uri skos:prefLabel ?therapeutic_area_label .
                        }
                    }
                }
            }
        }
    }
}
GROUP BY ?rwd_project_uri ?medical_definition_uri ?medical_definition_label ?medical_definition_comment
ORDER BY ?rwd_project_uri ?medical_definition_label
`
}

// # Query fails on Stardog. I don't know why. It works on CONEDG.

// # restapi_medical-definitions_via_rwd-project-id_medical-definition-name.rq
// # REST_API_URI/medical-definitions?name=[TEST]%20Test%20Definition&rwd-project-id=https://pid.bayer.com/16ee9534-730b-439f-b4f2-adea578c6e66/0a933218-080b-47c1-a743-3601c8db0cef
// # Query: Get metadata of specific Medical Definition(s) for a specific RWD Project based on specific RWD Project ID and specific Medical Definition name.
// # Note: Since this query is based on name (instead of ID), the result may include multiple Medical Definitions that have the same name, but different IDs and possibly different metadata.
// # Note: It may be that no Medical Definitions are assigned to the specified RWD Project.
// # Input: rwd_project_id medical_definition_name
// # Output: rwd_project_id | medical_definition_id | medical_definition_name | medical_definition_description | therapeutic_areas
// # Does not include: related validation studies | related literature | related codes
// # Error handling: When querying a combination of rwd_project_id and medical_definition_name, which is not present in the data, an empty result is returned. This includes the case that one of the inputs is misspelled.
function medicalDefinitionsViaRDWProjectID_medicalDefinitionName(projectID, name) {
    return `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rwdso: <https://pid.bayer.com/a30b1825-d421-46d0-b25e-a7e36d44a866/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT
(STR(?rwd_project_uri) as ?rwd_project_id)
(STR(?medical_definition_uri) as ?medical_definition_id)
(STR(?medical_definition_label) AS ?medical_definition_name)
(STR(?medical_definition_comment) AS ?medical_definition_description)
(GROUP_CONCAT(DISTINCT ?therapeutic_area_label; separator="|") as ?therapeutic_areas)
WHERE {
    SERVICE <http://vpce-08241da16023adfbc-ilgj17zi.vpce-svc-0c680ea76f33130a4.eu-central-1.vpce.amazonaws.com/edg/tbl/sparql> {
        BIND(<${projectID}> AS ?rwd_project_uri) # Insert input variable
        BIND("${name}" AS ?medical_definition_label) # Insert input variable
        VALUES ?rwd_project_types { rwdso:RWDProject rwdso:MedicalDefinitionCollection rwdso:RWDFeasibilityRequest rwdso:RWDLandscaping rwdso:RWDStudy }
        GRAPH <urn:x-evn-master:rwd_project_builder> {
            ?rwd_project_uri rdf:type ?rwd_project_types ;
                            rdfs:label ?rwd_project_label ;
                            rwdso:usesMedicalDefinition ?medical_definition_uri .
            GRAPH <urn:x-evn-master:medical_definition_library> {
                ?medical_definition_uri rdf:type rwdso:MedicalDefinition ;
                                        rdfs:label ?medical_definition_label .
                OPTIONAL { ?medical_definition_uri rdfs:comment ?medical_definition_comment . }
                OPTIONAL {
                    ?medical_definition_uri rwdso:hasTherapeuticArea ?therapeutic_area_uri .
                    GRAPH <urn:x-evn-master:therapeutic_areas_for_rwd_store> {
                        ?therapeutic_area_uri skos:prefLabel ?therapeutic_area_label .
                    }
                }
            }
        }
    }
}
GROUP BY ?rwd_project_uri ?medical_definition_uri ?medical_definition_label ?medical_definition_comment
ORDER BY ?rwd_project_uri ?medical_definition_label
`
}

// # Query fails on Stardog. I don't know why. It works on CONEDG.

// # restapi_medical-definitions_via_rwd-project-name_medical-definition-name.rq
// # REST_API_URI/medical-definitions?name=[TEST]%20Test%20Definition&rwd-project-name=[TEST]%20Test%20Project
// # Query: Get metadata of specific Medical Definition(s) for specific RWD Project(s) based on specific RWD Project name and specific Medical Definition name.
// # Note: Since this query is based on names (instead of IDs), the result may include Medical Definitions of multiple RWD Projects that have the same name, but different IDs.
// # Note: It may be that no Medical Definitions are assigned to the specified RWD Project.
// # Input: rwd_project_name medical_definition_name
// # Output: rwd_project_id | medical_definition_id | medical_definition_name | medical_definition_description | therapeutic_areas
// # Does not include: related validation studies | related literature | related codes
// # Error handling: When querying a combination of rwd_project_name and medical_definition_name, which is not present in the data, an empty result is returned. This includes the case that one of the inputs is misspelled.
function medicalDefinitionsViaRDWProjectName_medicalDefinitionName(projectName, name) {
    return `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX rwdso: <https://pid.bayer.com/a30b1825-d421-46d0-b25e-a7e36d44a866/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
SELECT
(STR(?rwd_project_uri) as ?rwd_project_id)
(STR(?medical_definition_uri) as ?medical_definition_id)
(STR(?medical_definition_label) AS ?medical_definition_name)
(STR(?medical_definition_comment) AS ?medical_definition_description)
(GROUP_CONCAT(DISTINCT ?therapeutic_area_label; separator="|") as ?therapeutic_areas)
WHERE {
    SERVICE <http://vpce-08241da16023adfbc-ilgj17zi.vpce-svc-0c680ea76f33130a4.eu-central-1.vpce.amazonaws.com/edg/tbl/sparql> {
        BIND("${projectName}" AS ?rwd_project_label) # Insert input variable
        BIND("${name}" AS ?medical_definition_label) # Insert input variable
        VALUES ?rwd_project_types { rwdso:RWDProject rwdso:MedicalDefinitionCollection rwdso:RWDFeasibilityRequest rwdso:RWDLandscaping rwdso:RWDStudy }
        GRAPH <urn:x-evn-master:rwd_project_builder> {
            ?rwd_project_uri rdf:type ?rwd_project_types ;
                            rdfs:label ?rwd_project_label ;
                            rwdso:usesMedicalDefinition ?medical_definition_uri .
            GRAPH <urn:x-evn-master:medical_definition_library> {
                ?medical_definition_uri rdf:type rwdso:MedicalDefinition ;
                                        rdfs:label ?medical_definition_label .
                OPTIONAL { ?medical_definition_uri rdfs:comment ?medical_definition_comment . }
                OPTIONAL {
                    ?medical_definition_uri rwdso:hasTherapeuticArea ?therapeutic_area_uri .
                    GRAPH <urn:x-evn-master:therapeutic_areas_for_rwd_store> {
                        ?therapeutic_area_uri skos:prefLabel ?therapeutic_area_label .
                    }
                }
            }
        }
    }
}
GROUP BY ?rwd_project_uri ?medical_definition_uri ?medical_definition_label ?medical_definition_comment
ORDER BY ?rwd_project_uri ?medical_definition_label
`
};

export default router;

