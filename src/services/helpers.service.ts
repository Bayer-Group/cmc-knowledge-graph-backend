import { D3Node } from "./models/d3Node.model";
import { D3Link } from "./models/d3Link.model";
import { imageMapping } from "../constants/image.mapping";
import { TripleModel } from "./models/triples.model";
import cons from "../constants/constants";
import { AutocompleteResult } from "./models/autocomplete.model";
import { NquadsString } from "../connector/models/nquadsString.model";
import logger from "../logger/logger";
import { DbConfig } from "../routes/models/dbconfig.model";

// returns a Node Object in the format that D3 needs
export function createNodeObject(item: string): D3Node {
    let label;
    if (item.startsWith("_:bnode")) {
        label = "bnode"
    } else {
        label = "Unlabelled Node"
    }
    const node = {
        uri: item,
        data: { mainLabel: label }
    }
    return node;
}

export function createLinkObject(item: string, source: string, target: string): D3Link {
    const link = {
        prettyLabel: removeUrlFromString(item),
        label: item,
        source: source,
        target: target
    }
    return link;
}

export function addNodeData(node, predicate, object) {
    const value = removeUrlFromString(predicate);
    if (value === "label") {
        if (node.data[predicate]) {
            node.data[predicate].values.push(object);
        } else {
            node.data[predicate] = { prettyLabel: value, values: [object] };
        }
        node.data.mainLabel = object;
    } else {
        if (node.data[predicate]) {
            node.data[predicate].values.push(object);
        } else {
            node.data[predicate] = { prettyLabel: value, values: [object] };
        }
    }
}
export function parseAutocomplete(val: NquadsString): AutocompleteResult[] {
    const nQuads = parseNquads(val);

    let result = [];

    nQuads.forEach(triple => {
        if (isValue(triple.o)) {
            result.push({
                uri: triple.s,
                value: triple.o,
                link: removeUrlFromString(triple.p)
            })
        }
    })

    return result;
}
// removes an Url from a string if a url is existing
// otherwise it will return the string as it is
export function removeUrlFromString(str: string): string {
    let removedUrl = (str.substr(0, 4) == "http" || str.substr(0, 5) === "https") ? str.substr(str.lastIndexOf("/") + 1, str.length) : str;
    let remvedHash = removedUrl.substr(removedUrl.lastIndexOf("#") + 1, removedUrl.length);
    return remvedHash;
}

// checks if string is a value or link
export function isValue(str: string): Boolean {
    // ------- TODO --------------
    // check for better solution to filter images that start with http/s
    return ((!str.startsWith("http://") && !str.startsWith("https://")))
        && !str.startsWith("_:bnode") && !str.startsWith("bnode");
}

// checks if a given input string is in the imageMapping configuration
export function isImage(str: string): Boolean {
    return imageMapping[str];
}

// for parsing nQuads
export function parseNquads(nquads): TripleModel[] {
    if (!nquads) return []

    let triples: TripleModel[] = [];
    const lines = nquads.split(/\.\r?\n/).filter(x => Boolean(x.trim())); // split the lines with .\n, keep only the non-empty lines
    // .filter(Boolean) does not remove lines with a single space
    lines.forEach(line => {
        const attributes = line.split(/\" |> /);

        triples.push({ s: prettyString(attributes[0]), p: prettyString(attributes[1]), o: prettyString(attributes[2]) })
    })
    return triples;
}

export function nquadsToD3Description(nquads: string) {
    //parse nquads to an object with s,p,o format
    const nquadsObject: TripleModel[] = parseNquads(nquads);

    if (nquadsObject.length === 0) {
        return null;
    }
    const node = createNodeObject(nquadsObject[0].s);
    nquadsObject.forEach(triple => {
        // check if object is a value add as value
        if (triple.p === cons.RDF_TYPE && triple.o === cons.RDF_CLASS) node.data.isClass = true;
        // if (helpers.isValue(triple.o)) node.data[helpers.removeUrlFromString(triple.p)] = triple.o;
        if (isValue(triple.o)) addNodeData(node, triple.p, triple.o);
        else if (isImage(triple.p)) node.data[imageMapping[triple.p]] = triple.o;
    })
    return node;
}


function prettyString(str) {
    const s = str.replace(/\"|<|>/g, "");
    return convertUmlaute(s).trim(); // use the trim here
}


function convertToUnicode(str) {
    return String.fromCharCode(parseInt("0x" + str.substring(2, str.length))); // parseInt("0x"+ can be removed
}


function convertUmlaute(str) {
    return str.replace(/\\u\w\w\w\w/g, convertToUnicode);
}

export function joinAsValuesList(dbconfig: DbConfig[]) {
    try {
        let valuesList = "";
        for (let index = 0; index < dbconfig.length; index++) {
            const dbInstance = dbconfig[index];
            const dbPath = `(<${dbInstance.dbpath}>`
            if(dbInstance.instance){
            dbInstance.selectedNamedGraphs.forEach(graph => {
                let valuesString = `${dbPath}<${graph}>)`
                valuesList = valuesList.concat(valuesString)
            });
        }
        }
        return valuesList;
    } catch (error) {
        logger.info("error in joinAsValuesList", error);
        return null;
    }

}

export function joinDefaultGraphs(dbconfig: DbConfig[]) {
    try {
        let defaultGraphs = dbconfig.filter(x => x.selectedNamedGraphs.includes('')).map(y => y.dbpath)
        let valuesList = "";
        if (defaultGraphs.length > 0) {
            for (let i = 0; i < defaultGraphs.length; i++) {
                const defaultGraph = `(<${defaultGraphs[i]}>)`;
                valuesList = valuesList.concat(defaultGraph)
            }
            return valuesList
        }
        return valuesList
    } catch (error) {
        logger.info("error in joinAsValuesList", error);
        return null;
    }

}

export function joinAsGraphsList(graphsArray: Array<string>): string {
    return graphsArray.map(x=>'FROM '+ `<${x}>`).join(" ");
}
