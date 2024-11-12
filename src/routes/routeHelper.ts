import { config } from '.././config/config';
import logger from '../logger/logger';

export const validateDBConfig = (req, res, next) => {
    logger.info("START validating dbConfig object", req.body.dbConfig);
    if (!req.body.dbconfig) {
        let resultMessage = "Invalid Request: No dbconfig object found.";
        logger.info("FINISH validating dbConfig object", {status: 400, resultMessage: resultMessage});
        res.status(400).json({message: resultMessage})
    } else if (req.body.dbconfig.length > 0) {
        let resultMessage;
        let error = false;
        req.body.dbconfig.forEach(conf => {
            if (!conf.instance) {
                resultMessage = "Invalid Request: No instance found in dbconfig object.";
                logger.info("FINISH validating dbConfig object", {status: 400, resultMessage: resultMessage});
            } else if (!conf.dbpath) {
                resultMessage = "Invalid Request: No dbpath found in dbconfig object.";
                logger.info("FINISH validating dbConfig object", {status: 400, resultMessage: resultMessage});
            } else if (!config().tripleStores[conf.instance]) {
                resultMessage = `Invalid Request: No matching TripleStore config found for: ${conf.instance}`;
                logger.info("FINISH validating dbConfig object", {status: 400, resultMessage: resultMessage});
            }   
        });

        if (error) {
            res.status(400).json({message: resultMessage})  
        } else {
            logger.info("FINISH validating dbConfig object", {status: 200});
            next()
        }
    } else {
        let resultMessage = "Invalid Request: No dbconfig object found.";
        logger.info("FINISH validating dbConfig object", {status: 400, resultMessage: resultMessage});
        res.status(400).json({message: "Invalid Request: No dbconfig object found."})
    }
}
