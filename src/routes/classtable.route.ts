import express = require('express');
import { config } from '../config/config';
import logger from '../logger/logger';
import { ClassTableService } from '../services/classtable.service';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   ClasstableRequest:
 *     type: object
 *     properties:
 *       classUri:
 *         type: string
 *       attributes:
 *         type: array
 
 */

/** 
 * @swagger 
 * /classtable: 
 *   post: 
 *     description: | 
 *       This Endpoints save a given class table configuration and returns a unique identifier that can be used to retrieve the table data
 *     tags: 
 *       - classTable 
 *     produces: 
 *       - application/json 
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Request containing the table configurations
 *         required: true
 *         type: Object
 *     responses: 
 *       200: 
 *         description: OK 
 */

 /**
{
    "classUri": "http://pid.bayer.com/kos/19014/Person",
    "attributes": [
        {
            "uri": "http://10.122.106.18:3000/lastName",
            "display": "lastName"
        },
        {
            "uri": "http://10.122.106.18:3000/firstName",
            "display": "firstName"
        }
    ]
}
  */
router.post('/',  async function(req, res) {
    try {
    logger.info("START POST /classtable", req.body);
    logger.info("START POST /classtable request header host", req.headers.host);
    let result = await new ClassTableService(config().tripleStores.KGEConfigDB, req.body.dbConfig).storeSparqlQuery(req.body, "https://"+req.headers.host);
    logger.info("FINISH POST /classtable", {status: 200});
    res.status(200).json(result);
    } catch (error) {
        logger.error("error in classtable route", error);
        
    }
})

/** 
 * @swagger 
 * /classtable/{uuid}: 
 *   get: 
 *     description: | 
 *       This Endpoints returns a table structured data by a given id
 *     tags: 
 *       - classTable 
 *     produces: 
 *       - application/sparql-results+json
 *     parameters:
 *       - in: path
 *         name: uuid
 *         description: Unique identifier of the data
 *         required: true
 *         type: string
 *     responses: 
 *       200: 
 *         description: OK 
 */
 router.get('/:uuid',  async function(req, res) {
     try {
    logger.info("START GET /classtable:uuid", req.params.uuid);
    if (req.query.page && !req.query.limit) {
        logger.info("FINISH GET /classtable:uudi", {status: 400});
        res.status(200).json({message: "You need to provide a limit if you want to use paginiation!"});
    } else {
        let kgeConfig = [
            {
                dbpath: config().tripleStores.KGEConfigDB.path,
                selectedNamedGraphs: [],
                instance: "KGEConfigDB",
                virtualGraphs: [],
            },]
        let result = await new ClassTableService(config().tripleStores.KGEConfigDB, kgeConfig).getStoredSparqlQuery(req.params.uuid as string, 
            "https://"+ req.headers.host, req.headers.accept, 
            req.query.page as string, req.query.limit as string);
        if (result.name == "Error") {
            logger.info("FINISH GET /classtable:uudi", {status: result.response.status});
            res.sendStatus(result.response.status);
        } else {
            res.set("content-type", "text/csv");
            res.attachment(req.params.uuid+'.csv');
            if (req.query.page) {
                let page: number = +req.query.page;
                let endpoint = "https://"+req.headers.host+"/classtable/"+req.params.uuid;
                logger.info("FINISH GET /classtable:uudi", {status: 200});
                res.status(200).set('Next-Page', `${endpoint}?limit=${req.query.limit}&page=${page+1}`);
                if (page > 1) {
                    res.set('Previous-Page', `${endpoint}?limit=${req.query.limit}&page=${page-1}`);
                }
                res.send(result);
            } else {
                logger.info("FINISH GET /classtable:uudi", {status: 200});
                res.status(200).send(result);
            }
        }
    }    
     } catch (error) {
        logger.error("error in fetching /:uuid", error);
        res.status(404).send(error);
    }
})

/** 
 * @swagger 
 * /classtable/labels: 
 *   post: 
 *     description: | 
 *       This Endpoints retrieves possible lables for the given input attributes and label properties
 *     tags: 
 *       - classTable 
 *     produces: 
 *       - application/json 
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Request containing the label attributes and uris
 *         required: true
 *         type: Object
 *     responses: 
 *       200: 
 *         description: OK 
 */

 /**
{
    "attributes": ["http://pid.bayer.com/kos/19014/worksOn", "http://pid.bayer.com/kos/19014/isLocateIn"],
    "labels": ["http://test.de/hasLabel"]
}
  */
 router.post('/labels',  async (req, res) => {
    try {
    logger.info("START POST /labels", req.body);
    let result = await new ClassTableService(config().tripleStores.KGEConfigDB, req.body.dbConfig).fetchLabels(req.body);
    logger.info("FINISH POST /labels", {status: 200});
    res.status(200).send(result);
    }
    catch (error) {
        logger.error("error in fetching labels", error);
        res.status(404).send(error);
    }
})

/** 
 * @swagger 
 * /classtable/incoming: 
 *   post: 
 *     description: | 
 *       This Endpoints retrieves incoming triples for a class URI
 *     tags: 
 *       - classTable 
 *     produces: 
 *       - application/json 
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Request containing the label attributes and uris
 *         required: true
 *         type: Object
 *     responses: 
 *       200: 
 *         description: OK 
 */

router.post('/incoming',  async (req, res) => {
    try {

    logger.info("START POST /classtable/incoming", req.body);
    let result = await new ClassTableService(config().tripleStores.KGEConfigDB, req.body.dbConfig).getClassTableIncomingAsync(req.body.url,req.body.dbconfig);
    logger.info("FINISH POST /classtable/incoming", {status: 200});
    res.status(200).send(result);
    }
    catch (error) {
        logger.error("error in fetching labels", error);
        res.status(404).send(error);
    }
})

/** 
 * @swagger 
 * /classtable/generate-csv: 
 *   post: 
 *     description: | 
 *       This Endpoints the csv for the given class table
 *     tags: 
 *       - classTable 
 *     produces: 
 *       - application/csv 
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Request containing the label attributes and uris
 *         required: true
 *         type: Object
 *     responses: 
 *       200: 
 *         description: OK 
 */

router.post('/generate-csv',  async (req, res) => {
    try {
        logger.info("START POST /classtable", req.body);
        logger.info("START POST /classtable request header host", req.headers.host);
        let result = await new ClassTableService(config().tripleStores.KGEConfigDB, req.body.dbConfig).getCSVQuery(req.body);
        // Set appropriate headers for CSV response
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');

        // Send CSV data as response
        // res.status(200).send(result);
        logger.info("FINISH POST /classtable", {status: 200});
        res.status(200).json(result);
        } catch (error) {
            logger.error("error in classtable route", error);
            res.status(500).json({ error: 'Internal server error' });
        }
})

export default router;