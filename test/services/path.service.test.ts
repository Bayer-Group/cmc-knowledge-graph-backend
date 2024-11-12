

import { expect } from 'chai';
import { TripleStore } from '../../src/config/configfile.model';
import { DbConfig } from '../../src/routes/models/dbconfig.model';
import { IPathService } from '../../src/services/interfaces/path.service.interface';
import { PathConfig } from '../../src/routes/models/pathconfig.model';
import { pathResponse, fullPathResult } from './mockdata/path.mock';
const nock = require('nock');

const testTripleStore: TripleStore = {
    host: "test",
    port: 123,
    protocol: 'http',
    serviceHost: "test",
    type: "test",
    paths: [{ dbpath: "/testpath", name: "testdb" }]
} 

const testDbConfig: DbConfig[] = [{
    instance: "test",
    dbpath: "/testpath",
    selectedNamedGraphs: [''],
    virtualGraphs: []
}]

const testPathConfig: PathConfig = {
    bidirectional: true,
    disableTBox: true,
    shortestPath: true,
    numPaths: 1,
    maxPathLength: 0,
    showRange: true,
    pathRange: [
      0
    ],
    dbconfig: [
      {
        "instance": "stardogSandbox",
        "dbpath": "/ontorest"
      }
    ]
  }


  /* Unused methodes
describe('Path Service', async () => {
    let ps: IPathService;

    before(() => {
        //ps = new PathService(testTripleStore, testDbConfig);
    });    

    it('Try getRawPathDataAsync with Success Response from TripleStore', async () => {
        // mock tripelStore call
        nock('http://test:123/')
            .post('/testpath')
            .reply(200, pathResponse);

        const result = await ps.getRawPathDataAsync(testPathConfig, "http://pid.bayer.com/kos/19014/1/ggvcm", "http://example.com/Person/erik");
        expect(result).to.eql(pathResponse);
    });
     
    it('Try getRawPathDataAsync with Exception Response from TripleStore', async () => {
        // mock tripelStore call
        nock('http://test:123/')
            .post('/testpath')
            .replyWithError('something awful happened');

        const result = await ps.getRawPathDataAsync(testPathConfig, "http://pid.bayer.com/kos/19014/1/ggvcm", "http://example.com/Person/erik");
        expect(result).to.eql(null);
    });

});*/
