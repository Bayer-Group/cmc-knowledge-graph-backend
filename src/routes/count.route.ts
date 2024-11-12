import express = require('express');
import { validateDBConfig } from './routeHelper';
import { config } from '../config/config';
import { CountService } from '../services/count.service';
import logger from '../logger/logger';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   CountRequest:
 *     type: object
 *     properties:
 *       url:
 *         type: string
*       dbconfig:
 *         $ref: '#/definitions/DBConfig'
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
 * /count/incoming: 
 *   post: 
 *     description: | 
 *       This Endpoint returns you the Count of all incoming links for a given uri. Example URL: http://10.122.106.18:3000/Person
 *     tags: 
 *       - count 
 *     produces: 
 *       - application/json 
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Request containing the node uri
 *         required: true
 *         schema:
 *           $ref: '#/definitions/CountRequest'
 *     responses: 
 *       200: 
 *         description: OK 
 *         examples: 
 *           application/json: |- 
 *             { 
 *               "count" : "3"
 *             } 
 */
router.post('/incoming', validateDBConfig,  async function(req, res) {
    logger.info("START POST /count/incoming", req.body);
    if (!req.body.url) {
        logger.info("FINISH POST /count/incoming", {status: 400});
        res.status(400).json({message: "Invalid Request: You need to provide the body parameter url"});
    } 
    const countService = new CountService(config().tripleStores[req.body.dbconfig[0].instance], req.body.dbconfig);
    const result = await countService.getIncomingAsync(req.body.url as string);
    logger.info("FINISH POST /count/incoming", {status: 200});
    res.status(200).send(result);
})


/**
* @swagger 
 * /count/outgoing: 
 *   post: 
 *     description: | 
 *       This Endpoint returns you the Count of all outgoing links for a given uri. Example URL: http://10.122.106.18:3000/Person
 *     tags: 
 *       - count 
 *     produces: 
 *       - application/json 
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Request containing the node uri
 *         required: true
 *         schema:
 *           $ref: '#/definitions/CountRequest'
 *     responses: 
 *       200: 
 *         description: OK 
 *         examples: 
 *           application/json: |- 
 *             { 
 *               "count" : "3"
 *             } 
 */
router.post('/outgoing', validateDBConfig,  async function(req, res) {
    logger.info("START POST /count/outgoing", req.body);
    if (!req.body.url) {
        logger.info("FINISH POST /count/outgoing", {status: 400});
        res.status(400).json({message: "Invalid Request: You need to provide the body parameter url"});
    } 
    const countService = new CountService(config().tripleStores[req.body.dbconfig[0].instance], req.body.dbconfig);
    const result = await countService.getCountOutgoingAsync(req.body.url as string);
    logger.info("FINISH POST /count/outgoing", {status: 200});
    res.status(200).send(result);
})


export default router;