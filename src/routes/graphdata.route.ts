import express = require('express');
import { validateDBConfig } from './routeHelper';
import { GraphDataService } from '../services/graphdata.service';
import { config } from '../config/config';
import { D3Result } from '../services/models/d3Result.model';
import logger from '../logger/logger';
import { DbConfig } from './models/dbconfig.model';
import { TripleStores } from '../config/configfile.model';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   IncomingRequest:
 *     type: object
 *     properties:
 *       url:
 *         type: string
 *       dbconfig:
 *         $ref: '#/definitions/DBConfig'
 *   OutgoingRequest:
 *     type: object
 *     properties:
 *       url:
 *         type: string
 *       dbconfig:
 *         $ref: '#/definitions/DBConfig'
 *   OutgoingRequestAdditonal:
 *     type: object
 *     properties:
 *       url:
 *         type: string
 *       dbconfig:
 *         $ref: '#/definitions/DBConfig'
 *   SaveRequest:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *       data:
 *         type: string
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
 * /graphData/incoming: 
 *   post: 
 *     description: | 
 *       This Endpoint returns you GraphData in D3 Format for Incoming Nodes based on a given baseNode. Example URL: http://10.122.106.18:3000/Person
 *     tags: 
 *       - graphData 
 *     produces: 
 *       - application/json 
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Request containing all needed information
 *         required: true
 *         schema:
 *           $ref: '#/definitions/IncomingRequest'
 *       - in: query
 *         name: q
 *         description: Optional Filter Value (Uri of a specific Node that should be fetched e.g. http://10.122.106.18:3000/Person/erik)
 *         required: false
 *         type: string
 *     responses: 
 *       200: 
 *         description: OK 
 *         examples: 
 *           application/json: |- 
 *             { 
 *               "nodes" : [],
 *               "links" : []
 *             } 
 */
router.post('/incoming', validateDBConfig, async function(req, res) {
   logger.info("START POST /graphData/incoming", req.body);
   if (!req.body.url) {
       logger.info("FINISH POST /graphData/incoming", {status: 400});
       res.status(400).json({message: "Invalid Request: Parameter url is missing in the request"});
   }
   else {
       const graphData = new GraphDataService(config().tripleStores[req.body.dbconfig[0].instance], req.body.dbconfig);
       let result: D3Result;
       if (req.query.q) result = await graphData.getIncomingWithFilterAsync(req.body.url, req.query.q as string);
       else result = await graphData.getIncomingAsync(req.body.url);

       if (result) {
           logger.info("FINISH POST /graphData/incoming", {status: 200});
           res.status(200).json(result);
       }
       else {
           logger.info("FINISH POST /graphData/incoming", {status: 404});
           res.status(404).json({message: `No Data found for the given url ${req.body.url}`})
        } 
   }
});

/** 
 * @swagger 
 * /graphData/outgoingAdditional: 
 *   post: 
 *     description: | 
 *       This Endpoint returns GraphData in D3 Format with all additional outgoing Nodes, based on a given baseNode. Example URL: http://10.122.106.18:3000/Person/ggvcm
 *     tags: 
 *       - graphData 
 *     produces: 
 *       - application/json 
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Request containing all needed information
 *         required: true
 *         schema:
 *           $ref: '#/definitions/OutgoingRequestAdditonal'
 *     responses: 
 *       200: 
 *         description: OK 
 *         examples: 
 *           application/json: |- 
 *             { 
 *               "nodes" : [],
 *               "links" : []
 *             } 
 */
router.post('/outgoingAdditional', validateDBConfig,  async function(req, res) {
    logger.info("START POST /graphData/outgoingAdditional", req.body);
    if (!req.body.url) {
        logger.info("FINISH POST /graphData/outgoingAdditional", {status: 400});
        res.status(400).json({message: "Invalid Request: Parameter url is missing in the request"});
    }
    else {
        const graphData = new GraphDataService(config().tripleStores[req.body.dbconfig[0].instance], req.body.dbconfig);
        const result = await graphData.getOutgoingAsync(req.body.url);
        if (result) {
            logger.info("FINISH POST /graphData/outgoingAdditional", {status: 200});
            res.status(200).json(result);
        }
        else {
            logger.info("FINISH POST /graphData/outgoingAdditional", {status: 404});
            res.status(404).json({message: `No Data found for the given url ${req.body.url}`}) ;
        }      
    }
});


/** 
 * @swagger 
 * /graphData/outgoing: 
 *   post: 
 *     description: | 
 *       This Endpoint returns you GraphData in D3 Format with all outgoing Nodes based on a given baseNode. Example URL: http://10.122.106.18:3000/Person/ggvcm
 *       Optional you can define a startNodeIndex and a nextNodeIndex to use the API to fetch additional Nodes
 *     tags: 
 *       - graphData 
 *     produces: 
 *       - application/json 
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Request containing all needed information
 *         required: true
 *         schema:
 *           $ref: '#/definitions/OutgoingRequest'
 *     responses: 
 *       200: 
 *         description: OK 
 *         examples: 
 *           application/json: |- 
 *             { 
 *               "nodes" : [],
 *               "links" : []
 *             } 
 */
router.post('/outgoing', validateDBConfig, async function(req, res) {
    logger.info("START POST /graphData/outgoing", req.body);
    if (!req.body.url) {
        logger.info("FINISH POST /graphData/outgoing", {status: 400});
        res.status(400).json({message: "Invalid Request: Parameter url is missing in the request"})
    }
    else {
        const graphData = new GraphDataService(config().tripleStores[req.body.dbconfig[0].instance], req.body.dbconfig);
        const result = await graphData.getOutgoingAsync(req.body.url);
        if (result) {
            logger.info("FINISH POST /graphData/outgoing", {status: 200});
            res.status(200).json(result);
        }
        else {
            logger.info("FINISH POST /graphData/outgoing", {status: 404});
            res.status(404).json({message: `No Data found for the given url ${req.body.url}`}); 
        }
    }
});



/** 
 * @swagger 
 * /graphData/outgoingRandom: 
 *   post: 
 *     description: | 
 *       This Endpoint returns you a random GraphData in D3 Format with all outgoing Nodes based on a given baseNode. Example URL: http://10.122.106.18:3000/Person/ggvcm
 *     tags: 
 *       - graphData 
 *     produces: 
 *       - application/json 
 *     parameters:
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
 *             { 
 *               "nodes" : [],
 *               "links" : []
 *             } 
 */
router.post('/outgoingRandom', validateDBConfig, async function(req, res) {
    logger.info("START POST /graphData/outgoingRandom", req.body);
    const graphData = new GraphDataService(config().tripleStores[req.body.dbconfig[0].instance], req.body.dbconfig);
    const result = await graphData.getOutgoingRandomAsync();
    if (result) {
        logger.info("FINISH POST /graphData/outgoingRandom", {status: 200});
        res.status(200).json(result);
    }
    else {
        logger.info("FINISH POST /graphData/outgoingRandom", {status: 404});
        res.status(404).json({message: `No Data found for the given url ${req.body.url}`})  
    } 
});


/** 
 * @swagger 
 * /graphData/savedGraphs/{graphId}: 
 *   get: 
 *     description: | 
 *       This Endpoint returns the base64 encrypted data representing a saved graph, based on the given id. Example Graph: http://10.122.106.18:3000/graphData/savedGraphs/ce54935b-d7f3-41c2-b593-497ab8c7840b
 *     tags: 
 *       - graphData 
 *     produces: 
 *       - application/json 
 *     parameters:
 *       - in: path
 *         name: graphId
 *         description: Request containing the id used to identify the graph 
 *         required: true
 *         type: string
 *     responses: 
 *       200: 
 *         description: OK 
 *         examples: 
 *           application/json: |- 
 *             { 
 *               "nodes" : [],
 *               "links" : []
 *             } 
 */
router.get('/savedGraphs/:id/:host', async (req, res) => {
    try {
        logger.info(`START GET /graphData/savedGraphs/${req.params.id}`, req.body);
        let kgeStoredGraphsConfig = [
            {
              dbpath: "/kgeStoredGraphs/query",
              selectedNamedGraphs: [],
              instance: "kgeStoredGraphs",
              virtualGraphs: [],
            },]
        const id = req.params.id;
        const host = req.params.host;
        const graphData = new GraphDataService(config().tripleStores.KGEConfigDB, kgeStoredGraphsConfig);
        const result = await graphData.getSavedGraphData(id,host);
        if (result) {
            logger.info(`FINISH GET /graphData/savedGraphs/${req.params.id}`, {status: 200});
            res.status(200).json(result);
        }
        else {
            logger.info(`FINISH GET /graphData/savedGraphs/${req.params.id}`, {status: 404});
            res.status(404).json({message: `No Data found for the given uuid ${id}`})  
        } 
    } catch (error) {
        logger.error("error in fetching savedGraphs /:uuid", error);
        res.status(404).send(error);
    } 
})

/** 
 * @swagger 
 * /graphData/savedGraphs: 
 *   post: 
 *     description: | 
 *       This Endpoint saves the graph data in the triplestore. 
 *     tags: 
 *       - graphData 
 *     produces: 
 *       - application/json 
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Request containing all needed information
 *         required: true
 *         schema:
 *           $ref: '#/definitions/SaveRequest'
 *     responses: 
 *       200: 
 *         description: OK 
 */
router.post('/savedGraphs', async (req, res) => {
    logger.info(`START POST /graphData/savedGraphs`, req.body);
    const body = req.body;
    if (!body.data || !body.id) {
        logger.info("FINISH POST /graphData/savedGraphs", {status: 400});
        res.status(400).json({message: "Invalid Request: Missing data or id in request body"});
    } 
    else {
        let kgeStoredGraphsConfig = [
            {
              dbpath: "/kgeStoredGraphs/update",
              selectedNamedGraphs: [],
              instance: "kgeStoredGraphs",
              virtualGraphs: [],
            },]
        const graphData = new GraphDataService(config().tripleStores.KGEConfigDB, kgeStoredGraphsConfig);
        const result = await graphData.postSaveGraphData(body.id, body.data,body.host);
        if (result) {
            logger.info("FINISH POST /graphData/savedGraphs", {status: 200});
            res.status(200).json(result);
        }
        else {
            logger.info("FINISH POST /graphData/savedGraphs", {status: 404});
            res.status(404).json({message: `No Data found for the given uuid ${body.id}`}); 
        }
    }
})
/** 
 * @swagger 
 * /graphData/virtualGraphs: 
 *   get: 
 *     description: | 
 *       This Endpoint returns the list of available virtual graphs. It includes their path and the name of the stardog instance. 
 *     tags: 
 *       - graphData 
 *     parameters:
 *       - in: query
 *         name: user
 *         description: the user email address
 *         required: true
 *         type: string
*     produces: 
 *       - application/json 
 *     responses: 
 *       200: 
 *         description: OK 
 */
router.get('/virtualGraphs', async (req, res) => {
    logger.info(`START GET /graphData/virtualGraphs`, req.body);
  try {
    const graphDataKge =   new GraphDataService(
        config().tripleStores.KGEConfigDB,
        req.body
    );
    const eligibleUser = await graphDataKge.checkEligibleUser(req.query.user as string);
    if(!eligibleUser){
        logger.info(`non eligible user`, {status: 200});
        res.status(200).json([]);
        return
    }
    const graphData = new GraphDataService(
        config().tripleStores.StardogAdminDB,
        req.body
    );
    const result = await graphData.getVirtualGraphs({"StardogAdmin": config().tripleStores.StardogAdminDB});
        if (result) {
            logger.info(`FINISH GET /graphData/virtualGraphs`, {status: 200});
            res.status(200).json(result);
        }
  } 
 
    // let dbconfig: DbConfig[] = [{
    //     dbpath: triplestore.paths[0].dbpath,
    //     selectedNamedGraphs: [ '' ],
    //     instance: triplestoreNames[0],
    //     virtualGraphs: [] }
    //     ]

    // const graphData = new GraphDataService(triplestore, dbconfig)

    // let result = await graphData.getVirtualGraphs(config().tripleStores);
        // if (result) {
        //     logger.info(`FINISH GET /graphData/virtualGraphs`, {status: 200});
        //     res.status(200).json(result);
        // }
        // else {
        //     logger.info(`FINISH GET /graphData/virtualGraphs`, {status: 200});
        //     res.status(200).json([]);
        // }
        catch (error) {
            res.status(500).json(error.message)
        }
    })

/** 
 * @swagger 
 * /graphData/namedGraphs: 
 *   get: 
 *     description: | 
 *       This Endpoint returns the list of available named graphs, based on the given dbpath. 
 *     tags: 
 *       - graphData 
 *     produces: 
 *       - application/json 
 *     parameters:
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
 */
router.post('/namedGraphs', validateDBConfig, async (req, res) => {
    logger.info(`START POST /graphData/namedGraphs`, req.body);
    if (!req.body.dbconfig){
        logger.info(`Wrong request body! /graphData/namedGraphs`, {status: 404});
        res.status(404).json([]);
    }
    const graphData = new GraphDataService(config().tripleStores.KGEConfigDB, req.body.dbconfig); // earlier was external db stardogSavedGraph, now is tripleStores.stardogSandbox
    const result = await graphData.getNamedGraphs(req.body.dbconfig[0].dbpath);
    if (result.length > 0) {
        logger.info(`FINISH POST /graphData/namedGraphs`, {status: 200});
        res.status(200).json(result);
    }
    else {
        logger.info(`FINISH POST /graphData/namedGraphs`, {status: 404});
        res.status(404).json([]);
    }
});

/** 
 * @swagger 
 * /graphData/dbpaths: 
 *   get: 
 *     description: | 
 *       This Endpoint returns the list of available database paths. 
 *     tags: 
 *       - graphData
 *     produces: 
 *       - application/json 
 *     responses: 
 *       200: 
 *         description: OK 
 */
router.get('/dbpaths', async (req, res) => {
    logger.info(`START GET /graphData/dbpaths`, req.body);
    try {
    const graphData = new GraphDataService(
        config().tripleStores.KGEConfigDB,
        req.body.dbconfig
    );
    const result = await graphData.getTripleStores(req.query.user as string);
    logger.info(`FINISH GET /graphData/dbpaths`, {status: 200});
    res.status(200).json(result).end();
} catch (error) {
    res.status(500).json(error.message);
}
})

export default router;