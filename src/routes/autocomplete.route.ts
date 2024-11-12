import express = require('express');
import { validateDBConfig } from './routeHelper';
import { config } from '../config/config';
import { AutocompleteService } from '../services/autocomplete.service';
import { AutocompleteResult } from '../services/models/autocomplete.model';
import logger from '../logger/logger';
import { json } from 'body-parser';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   DBConfig:
 *     type: array
 *     items:
 *       type: object
 *       properties:
 *         instance: 
 *           type: string
 *         dbpath:
 *           type: string
 *         selectedNamedGraphs:
 *           type: array
 *           items:
 *             type: string
 *         virtualGraphs:
 *           type: array
 *           items:
 *             type: string
 */

/** 
 * @swagger 
 * /autocomplete/incoming: 
 *   post: 
 *     description: | 
 *       This Endpoint returns you the Autocomplete Values for a given baseNode and autocomplete string.
 *       If you do not provide an autocomplete string it will fetch the inital autocomplete values.
 *       Example URL: http://10.122.106.18:3000/Person
 *     tags: 
 *       - autocomplete 
 *     produces: 
 *       - application/json 
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Autocomplete String
 *         required: false
 *         type: string
 *       - in: query
 *         name: n
 *         description: The baseNode URI for incoming nodes
 *         required: true
 *         type: string
 *       - in: body
 *         name: dbconfig
 *         description: Contains all database instances + paths that will be used in the query
 *         required: false
 *         type: object
 *         properties:
 *           dbconfig:
 *             $ref: '#/definitions/DBConfig'
 *     responses: 
 *       200: 
 *         description: OK 
 *         examples: 
 *           application/json: |- 
 *             [
 *                { 
 *                   "uri" : "string",
 *                   "value" : "string",
 *                   "link" : "string"
 *                } 
 *             ]
 */
router.post('/incoming', validateDBConfig, async function(req, res) {
    logger.info("START POST /autocomplete/incoming", req.body);
    const baseNode = req.query.n as string;
    if (!baseNode) {
        logger.info("FINISH POST /autocomplete/incoming", {status: 400});
        res.status(400).json({message: "Invalid Request: You need to provide the query parameter n"});
    }
    else {
        const acService = new AutocompleteService(config().tripleStores.KGEConfigDB, req.body.dbconfig);
        let result: AutocompleteResult[];
        if (!req.query.q) result = await acService.getIncomingInitialAsync(baseNode);
        else result = await acService.getIncomingAsync(baseNode, req.query.q as string)
        logger.info("FINISH POST /autocomplete/incoming", {status: 200});
        res.status(200).json(result);
    }
})


/** 
 * @swagger 
 * /autocomplete/incoming/random: 
 *   post: 
 *     description: | 
 *       This Endpoint returns you random 3 autocomplete values for a given baseNode.
 *       Example URL: http://10.122.106.18:3000/autocomplete/incoming/random?n=http://10.122.106.18:3000/Person 
 *     tags: 
 *       - autocomplete 
 *     produces: 
 *       - application/json 
 *     parameters:
 *       - in: query
 *         name: n
 *         description: The baseNode URI for incoming nodes
 *         required: true
 *         type: string
 *       - in: body
 *         name: dbconfig
 *         description: Contains all database instances + paths that will be used in the query
 *         required: false
 *         type: object
 *         properties:
 *           dbconfig:
 *             $ref: '#/definitions/DBConfig'
 *     responses: 
 *       200: 
 *         description: OK 
 *         examples: 
 *           application/json: |- 
 *             [
 *                { 
 *                   "uri" : "string",
 *                   "value" : "string",
 *                   "link" : "string"
 *                } 
 *             ]
 */
router.post('/incoming/random', validateDBConfig,  async (req, res) => {
    logger.info("START POST /autocomplete/incoming/random", req.body);
    let baseNode = req.query.n as string;
    if (!baseNode) res.status(400).json({message: "Invalid Request: You need to provide the query parameter n"});
    else {
        const acService = new AutocompleteService(config().tripleStores[req.body.dbconfig[0].instance], req.body.dbconfig);
        const result = await acService.getIncomingRandomAsync(baseNode);
        logger.info("FINISH POST /autocomplete/incoming/random", {status: 200});
        res.status(200).send(result);
    }
});

/** 
 * @swagger 
 * /autocomplete/outgoing: 
 *   post: 
 *     description: | 
 *       This Endpoint returns you the Autocomplete Values for and autocomplete string.
 *       The values represent all outgoing nodes including the additional data about the node
 *       The Response is group by the Class of the Node. e.g Person, Company etc..
 *       Example AutocompleteString: Gökhan
 *     tags: 
 *       - autocomplete 
 *     produces: 
 *       - application/json 
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Autocomplete String
 *         required: true
 *         type: string
 *       - in: body
 *         name: dbconfig
 *         description: Contains all database instances + paths that will be used in the query
 *         required: false
 *         type: object
 *         properties:
 *           dbconfig:
 *             $ref: '#/definitions/DBConfig'
 *     responses: 
 *       200: 
 *         description: OK 
 *         examples: 
 *           application/json: |- 
 *             [
 *                { 
 *                   "group" : "string",                  
 *                   "data" : [
 *                        "link": "string",
 *                        "uri": "string",
 *                        "value": "string"
 *                   ]
 *                } 
 *             ]
 */
router.post('/outgoing', async function(req, res) {
    logger.info("START POST /autocomplete/outgoing", req.body);
    const autocompleteString = req.query.q;
    if (!autocompleteString) {
        logger.info("FINISH POST /autocomplete/outgoing", {status: 400});
        res.status(400).json({message: "Invalid Request: You need to provide the query parameter q"});
    }
    else {
        const acService = new AutocompleteService(config().tripleStores.KGEConfigDB, req.body.dbconfig);
        const result = await acService.getOutgoingAsync(autocompleteString as string);
        logger.info("FINISH POST /autocomplete/outgoing", {status: 200});
        res.status(200).send(result);
    }
})

/** 
 * @swagger 
 * /autocomplete/outgoing: 
 *   post: 
 *     description: | 
 *       This Endpoint returns you the Autocomplete Values for and autocomplete string.
 *       The values represent all outgoing nodes including the additional data about the node
 *       The Response is group by the Class of the Node. e.g Person, Company etc..
 *       Example AutocompleteString: Gökhan
 *     tags: 
 *       - autocomplete 
 *     produces: 
 *       - application/json 
 *     parameters:
 *       - in: query
 *         name: q
 *         description: Autocomplete String
 *         required: true
 *         type: string
 *       - in: body
 *         name: dbconfig
 *         description: Contains all database instances + paths that will be used in the query
 *         required: false
 *         type: object
 *         properties:
 *           dbconfig:
 *             $ref: '#/definitions/DBConfig'
 *     responses: 
 *       200: 
 *         description: OK 
 *         examples: 
 *           application/json: |- 
 *             [
 *                { 
 *                   "group" : "string",                  
 *                   "data" : [
 *                        "link": "string",
 *                        "uri": "string",
 *                        "value": "string"
 *                   ]
 *                } 
 *             ]
 */
router.post('/outgoingAdditional', async function(req, res) {
    // logger.info("START POST /autocomplete/outgoingAdditional", req.body);
    // const autocompleteString = req.query.q;
    // if (!autocompleteString) {
    //     logger.info("FINISH POST /autocomplete/outgoingAdditional", {status: 400});
    //     res.status(400).json({message: "Invalid Request: You need to provide the query parameter q"});
    // }
    // else {
    //     const acService = new AutocompleteService(config().tripleStores[req.body.dbconfig[0].instance], req.body.dbconfig);
    //     const result = await acService.getOutgoingAdditionalAsync(autocompleteString as string, req.body.url);
    //     console.log(result)
    //     console.log(result[0].data)
    //     logger.info("FINISH POST /autocomplete/outgoingAdditional", {status: 200});
    //     res.status(200).send(result);
    // }
    //
    logger.info("START POST /autocomplete/outgoingAdditional", req.body);
    const autocompleteString = req.query.q;
    const baseNode = req.body.url as string;
    const filteredChildURIs = req.body.filteredChildURIs;
    if (!baseNode || !autocompleteString || !filteredChildURIs) {
        logger.info("FINISH POST /autocomplete/outgoingAdditional", {status: 400});
        res.status(400).json({message: "Invalid Request: You need to provide the body parameter url and query param q"});
    }
    else {
        const acService = new AutocompleteService(config().tripleStores[req.body.dbconfig[0].instance], req.body.dbconfig);
        
        const result = await acService.getOutgoingAdditionalAsync(autocompleteString as string, baseNode, filteredChildURIs);
        logger.info("FINISH POST /autocomplete/outgoingAdditional", {status: 200});
        res.status(200).json(result);
    }
})


export default router;
