import {createNodeObject, addNodeData, isValue, createLinkObject, isImage, parseNquads} from "./helpers.service";
import { D3Result } from "./models/d3Result.model";
import cons from "../constants/constants";
import { imageMapping } from "../constants/image.mapping";
import { D3Node } from "./models/d3Node.model";
import { TripleModel } from "./models/triples.model";
import {INQuadsToD3ConverterService} from "./interfaces/nquadsToD3Converter.service.interface";
import { D3Link } from "./models/d3Link.model";

export class NQuadsToD3ConverterService implements INQuadsToD3ConverterService{

    static converterInstance : NQuadsToD3ConverterService = null;

    convertOutgoing(nquads: string, startNode="", startNodeIndex=0, nextNodeIndex=0): D3Result {
        var nodes = [];
        var links = [];
        const nquadsObject = parseNquads(nquads);
    
        nquadsObject.forEach(triple => {
            const foundSubjectIndex = nodes.length == 0 ? -1 : nodes.findIndex(node => node.uri == triple.s);
            const foundObjectIndex = nodes.length == 0 ? -1 : nodes.findIndex(node => node.uri == triple.o);
            const subjectFound = (foundSubjectIndex != -1);
            const objectFound = (foundObjectIndex != -1);
            var subjectIndex = foundSubjectIndex;
    
            
            if (startNode != "") { // to be removed?
                if (startNode == triple.s){ // about startNode
                    if (!isValue(triple.o) && !isImage(triple.p))  {
                        if (!objectFound) {
                            const pushedObjectIndex = nodes.push(createNodeObject(triple.o))-1;
                            
                            this.setNodeIsClassShort(nodes[pushedObjectIndex], triple);
                            if (subjectFound) {
                                this.setNodeIsClass(nodes[foundSubjectIndex], triple);
                            }
                        }
                        let foundLink = links.find(link => link.label === triple.p && link.source === triple.s && link.target === triple.o)
                        if (!foundLink){
                            links.push(createLinkObject(triple.p, triple.s, triple.o));
                        }
                    } else {
                        let index = foundSubjectIndex;
                        if (!subjectFound) {
                            index = nodes.push(createNodeObject(triple.s))-1;
                        } 
                        // nodes[index].data[helpers.removeUrlFromString(triple.p)] = triple.o;
                        // addNodeData(nodes[index], triple.p, triple.o);
                        if (isValue(triple.o)){
                            addNodeData(nodes[index], triple.p, triple.o)
                        }
                        else if (isImage(triple.p)){
                            nodes[index].data[imageMapping[triple.p]] = triple.o;
                        }
                    }
                }
                else{ // not startNode
                    let index = foundSubjectIndex;
                    if (!subjectFound) {
                        index = nodes.push(createNodeObject(triple.s))-1;
                    } 
                    
                    this.setNodeIsClass(nodes[index], triple)
                     
                    if (isValue(triple.o)){
                        addNodeData(nodes[index], triple.p, triple.o)
                    }
                    else if (isImage(triple.p)){
                        nodes[index].data[imageMapping[triple.p]] = triple.o;
                    }
                }
            } 
            else
            {
                if (!subjectFound){
                    subjectIndex = nodes.push(createNodeObject(triple.s))-1;
                }
        
                if (!objectFound){
                    if (isValue(triple.o)){
                        addNodeData(nodes[subjectIndex], triple.p, triple.o);
                    }
                    else if (isImage(triple.p)){
                        nodes[subjectIndex].data[imageMapping[triple.p]] = triple.o;
                    }
                    else{ // add target to node queue
                        if ( (!subjectFound && triple.s !== triple.o) || foundSubjectIndex == startNodeIndex) {
                            const pushedObjectIndex = nodes.push(createNodeObject(triple.o))-1;
                            this.setNodeIsClassShort(nodes[pushedObjectIndex], triple);
        
                            if (foundSubjectIndex == startNodeIndex)
                                links.push(createLinkObject(triple.p, triple.s, triple.o));
                        }
                        this.setNodeIsClass(nodes[subjectIndex], triple);
                        if (!subjectFound)
                            links.push(createLinkObject(triple.p, triple.s, triple.o));
                    }
                }
                
                if ( (subjectFound && objectFound)|| (!subjectFound && objectFound) ){
                    this.setNodeIsClass(nodes[foundSubjectIndex], triple);
                    links.push(createLinkObject(triple.p, triple.s, triple.o));
                }
            }
        });
    
        return { nodes:nodes, links: links};
    }

    
    convertIncoming(nquads: string, baseNodeUri: string): D3Result {
        const nquadsObject = parseNquads(nquads);
        var nodes = [];
        var links = [];
        
        nquadsObject.forEach(triple => {
            const foundSubjectIndex = nodes.length == 0 ? -1 : nodes.findIndex(node => node.uri == triple.s);
            const foundObjectIndex = nodes.length == 0 ? -1 : nodes.findIndex(node => node.uri == triple.o);
            const hasSubjectIndex = (foundSubjectIndex != -1);
            const hasObjectIndex = (foundObjectIndex != -1);
    
            if (!hasSubjectIndex && !hasObjectIndex) {
                if (triple.o == baseNodeUri) {
                    const pushedSubjectIndex = nodes.push(createNodeObject(triple.s))-1;
                    
                    this.setNodeIsClass(nodes[pushedSubjectIndex], triple);
                    links.push(createLinkObject(triple.p, triple.s, triple.o));
                }
            }  else if (!hasSubjectIndex && hasObjectIndex) {
                this.setNodeIsClassShort(nodes[foundObjectIndex], triple);
                    
            } 
            else { 
                this.setNodeIsClass(nodes[foundSubjectIndex], triple);
                if (isValue(triple.o)) 
                    addNodeData(nodes[foundSubjectIndex], triple.p, triple.o);
                else if (isImage(triple.p)) 
                    nodes[foundSubjectIndex].data[imageMapping[triple.p]] = triple.o;
                else if (triple.o === baseNodeUri && !this.isDuplicateLink(triple, links)) {
                    links.push(createLinkObject(triple.p, triple.s, triple.o));
                }
            }
         
        })
    
        return { nodes: nodes, links: links};
    }
    
    static getInstance() : NQuadsToD3ConverterService {
        if (!this.converterInstance){
            this.converterInstance = new NQuadsToD3ConverterService();
        }
        return this.converterInstance;
    }

    /**
     * 
     * @param node 
     * @param triple 
     */
    private setNodeIsClass = function(node: D3Node, triple: TripleModel){
        if (triple.p == cons.RDF_TYPE && (triple.o === cons.OWL_CLASS || triple.o === cons.RDF_CLASS)){
            node.data.isClass = true;
        }
    }
    
    private setNodeIsClassShort = function(node: D3Node, triple: TripleModel){
        if (triple.p == cons.RDF_TYPE){
            node.data.isClass = true;
        }
    }

    private isDuplicateLink = function(triple: TripleModel, links: D3Link[]): Boolean {
        let test = links.find(link => link.label == triple.p && link.source == triple.s && link.target == triple.o)
        return !!test
    }

}