import swaggerJSDoc = require('swagger-jsdoc');
// swagger options
const options = {
    definition: {
      info: {
        title: 'Knowledge Graph Explorer API', // Title (required)
        description: 'This API provides Endpoints to query a TripleStore. The Result will be in a for D3 understandable format.',
        version: '0.0.1', // Version (required)
        contact: {
          email: "kanwalmeet.singhkochar.ext@bayer.com"
        }
      },
      tags: [{
        name: "graphData",
        description: "All Endpoints for querying GraphData in D3 Format from the TripleStore"
      },
      {
        name: "count",
        description: "All Endpoints for counting GraphData in the Triplestore"
      },
      {
        name: "autocomplete",
        description: "All Endpoints for an autocomplete search in the TripleStore"
      },
      {
        name: "paths",
        description: "All Endpoints that calculate a Path between two Nodes"
      },
      {
        name: "classTable",
        description: "All Endpoints for class tables"
      }]
    },
    // Path to the API docs
    apis: [global.appRoot+'/routes/graphdata.route.js',
           global.appRoot+'/routes/count.route.js',
           global.appRoot+'/routes/paths.route.js',
           global.appRoot+'/routes/autocomplete.route.js',
           global.appRoot+'/routes/graphdata.new.route.js',
           global.appRoot+'/routes/classtable.route.js'],
};
// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;