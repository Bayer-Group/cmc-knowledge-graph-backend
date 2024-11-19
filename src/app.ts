// import npm modules
import express = require('express');
import bodyParser = require('body-parser');
import swaggerUi = require('swagger-ui-express');
import cors = require('cors');
// set global appRoot variable to help the swagger generation to find the files
import path = require('path');
global.appRoot = path.resolve(__dirname);
// import config
import { ConfigFile } from './config/configfile.model';
import { config } from './config/config';
// import routes
import graphData from './routes/graphdata.route';
import graphDataNew from './routes/graphdata.new.route';
import count from './routes/count.route';
import autocomplete from './routes/autocomplete.route';
import classtable from './routes/classtable.route';
// import swagger
import swaggerSpec from './swagger/swagger';
import logger from './logger/logger'

const app: express.Application = express();

// use bodyParse to parse incoming JSONs
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//enable all cors request
app.use(cors({origin: "*"}));

// setup swagger routes
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// setup all routes
app.use('/graphData', graphData);
app.use('/graphDataNew', graphDataNew);
app.use('/count', count);
//app.use('/paths', paths);
app.use('/autocomplete', autocomplete);
app.use('/classtable', classtable);


app.listen(config().app.port, function () {
    logger.info('Application has been started', {port: config().app.port, environment: process.env.NODE_ENV == undefined ? "local" : process.env.NODE_ENV});
});