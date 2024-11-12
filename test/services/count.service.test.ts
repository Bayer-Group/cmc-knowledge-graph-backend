

import { expect } from 'chai';
import { ICountService } from '../../src/services/interfaces/count.service.interface';
import { CountService } from '../../src/services/count.service';
import { TripleStore } from '../../src/config/configfile.model';
import { DbConfig } from '../../src/routes/models/dbconfig.model';
const nock = require('nock');

const testTripleStore: TripleStore = {
    host: "test",
    port: 123,
    protocol: 'http',
    serviceHost: "test",
    type: "stardog",
    paths: [{ dbpath: "/testpath", name: "testdb" }]
} 

const testDbConfig: DbConfig[] = [{
    instance: "test",
    dbpath: "/testpath",
    selectedNamedGraphs: [""],
    virtualGraphs: []
}]
describe('Count Service', async () => {
    let cc: ICountService;

    before(() => {
        cc = new CountService(testTripleStore, testDbConfig);
    });    

    it('Try getIncomingAsync with Success Response from TripleStore', async () => {
        // mock tripelStore call
        nock('http://test:123/')
            .post('/testpath')
            .reply(200, '<http://pid.bayer.com/kos/19014/Person> <http://www.w3.org/2000/01/rdf-schema#numberOfIssues> "3"^^<http://www.w3.org/2001/XMLSchema#integer> .'); // ^^<http://www.w3.org/2001/XMLSchema#integer>

        const result = await cc.getIncomingAsync("http://pid.bayer.com/kos/19014/Person");
        console.log("count test resultes")
        console.log(result)
        expect(result).to.eql({count: "3"});
    });

    it('Try getIncomingAsync with Exception Response from TripleStore', async () => {
        // mock tripelStore call
        nock('http://test:123/')
            .post('/testpath')
            .replyWithError('something awful happened');

        const result = await cc.getIncomingAsync("http://pid.bayer.com/kos/19014/Person");
        console.log("count test resulte")
        console.log(result)
        expect(result).to.eql({count: "0"});
    });


});
