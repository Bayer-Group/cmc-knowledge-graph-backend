import express = require('express');
import { validateDBConfig } from './routeHelper';
import { config } from '../config/config';
import logger from '../logger/logger';
import TripleStoreConnector from '../connector/triplestore.connector';
import cons from "../constants/constants";
import { TripleModel } from '../services/models/triples.model';
import { NquadsString } from '../connector/models/nquadsString.model';

const router = express.Router();

/** 
 * @swagger 
 * /graphDataNew: 
 *   post: 
 *     description: | 
 *       This Endpoint returns you GraphData N-Triple (Nquads) Fromat based on a given baseNode. Example URL: http://10.122.106.18:3000/Person/ggvcm
 *     tags: 
 *       - graphData 
 *     produces: 
 *       - application/n-triples 
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [outgoing, incoming]
 *         required: false
 *         description: The request type either outgoing or incoming. If nothing is provided it will be handled as an outgoing request
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional filter value (uri)
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
 *           application/n-triples: |- 
 *             <http://pid.bayer.com/kos/19014/1/ggvcm> <http://pid.bayer.com/kos/19014/firstName> "G\u00F6khan" .
 *             <http://pid.bayer.com/kos/19014/1/ggvcm> <http://pid.bayer.com/kos/19014/lastName> "Coskun" .
 *             <http://pid.bayer.com/kos/19014/1/ggvcm> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
 */
router.post('/', validateDBConfig, async function (req, res) {
    logger.info("START POST /graphDataNew", req.body);
    console.log("Handle Request Query:")
    console.log(req.query.type);
    console.log(req.body.url);
    if ((!req.body.url && (!req.body.endUri && !req.body.startUri))) {
        logger.info("FINISH POST /graphDataNew", { status: 400 });
        res.status(400).json({ message: "Invalid Request: Parameter url is missing in the request" })
    }
    else {
        let kgeConfig = [
            {
              dbpath: config().tripleStores.KGEConfigDB.path,
              selectedNamedGraphs: [],
              instance: "KGEConfigDB",
              virtualGraphs: [],
            },]
        const tripleStore = new TripleStoreConnector(config().tripleStores.KGEConfigDB, kgeConfig);
        let result: NquadsString;
        let invalidType = false;
        if (!req.query.type || req.query.type == "outgoing") {
            result = await tripleStore.getOutgoingAsync(req.body.url,req.body.dbconfig);
        } else if (req.query.type == "incoming") {
            if (req.query.filter) {
                console.log("WITH FILTER")
                result = await tripleStore.getResourcesIncomingWithFilterAsync(req.body.url, req.query.filter as string);
            }
            result = await tripleStore.getIncomingAsync(req.body.url,req.body.dbconfig);
        } else if (req.query.type == "all") {
            result = await tripleStore.getAllAsync(req.body.dbconfig);
        } else if (req.query.type == "colid") {
            result = await tripleStore.getColidAsync(req.body.url, config().colidGraph);
        } else if (req.query.type == "globalpath") {
            result = await tripleStore.getPathInNquards(req.body.pathConfig, req.body.startUri, req.body.endUri);
        } else if (req.query.type == "randomnode") {
            result = await tripleStore.getResourcesOutgoingRandomAsync(req.body.dbconfig);
        }
        else {
            logger.info("FINISH POST /graphDataNew", { status: 400 });
            invalidType = true;
            res.status(400).json({ message: `Invalid query paramter type` });
        }
        if (!invalidType) {
            if (result) {
                logger.info("FINISH POST /graphDataNew", { status: 200 });
                res.setHeader('content-type', cons.ACCEPT_NQUADS);
                res.status(200).send(result);
            }
            else {
                logger.info("FINISH POST /graphDataNew", { status: 404 });
                res.status(404).json({ message: `No Data found for the given url ${req.body.url}` });
            }
        }

    }
});

export default router;