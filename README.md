# Knowledge Graph Explorer

This Project contains the code for all Backend Services for the Knowledge Graph Explorer project.
The Backend Service is written in Node.Js using Typescript.

# Get Started

The backend web-service docker image would automatically get built by running the docker-compose up command in the Setup Project

If you want to manually build the docker image for the web-service, please use below command.
`docker-compose up --build cmc-kge-backend`

Please make sure you have the *fuseki* image running at your localhost:3030 port.

The fuseki image will take care of loading the initial graphs *https://github.com/Bayer-Group/kge/triplestores* <br /> *https://github.com/Bayer-Group/kge/triplestoreSystems* to the local triplestore.

If you want to add your own graphs and datasets, they can be done easily via the fuseki. Please use the *kge:CMCKGEDataset* entry in the triplestores graph for reference.

The available graphs in the triplestore can be then easily visualized on the Knowledge Graph Explorer.

## Local Installation

For local install please follow the below steps:

Run `npm install` to download all required dependencies.

Run `npm test` to run all Unit tests.

Run `npm start` to run the application.
