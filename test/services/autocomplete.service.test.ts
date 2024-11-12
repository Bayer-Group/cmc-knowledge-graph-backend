

import { expect } from 'chai';
import cons from '../../src/constants/constants'
import { AutocompleteService } from '../../src/services/autocomplete.service';
import { TripleStore } from '../../src/config/configfile.model';
import { DbConfig } from '../../src/routes/models/dbconfig.model';
import { IAutocompleteService } from '../../src/services/interfaces/autocomplete.service.interface';
import { successInitalIncomingAutocomplete, successIncomingAutocomplete, successIncomingRandomAutocomplete, successOutgoingMultipleGroups, successOutgoingOneGroup, successOutgoingDefaultGroup } from './mockdata/autocomplete.nquads.mock';
import { initalIncomingACResult, incomingACResult, incomingRandomACResult, outgoingMultipleGroupsResult, outgoingOneGroupsResult, outgoingDefaultGroupResult } from './mockdata/autocomplete.res.mock';
const nock = require('nock');

const testTripleStore: TripleStore = {
    host: "test",
    port: 123,
    protocol: 'http',
    serviceHost: "test",
    type: "test",
    paths: [{ dbpath: "/test", name: "test" }]
} 

const testDbConfig: DbConfig[] = [{
    instance: "test",
    dbpath: "/test",
    selectedNamedGraphs: [''],
    virtualGraphs: []
}]

describe('Autocomplete Service', async () => {
    let ac: IAutocompleteService;

    before(() => {
        ac = new AutocompleteService(testTripleStore, testDbConfig);
    });    

    it('Try getIncomingInitialAsync with Success Response from TripleStore', async () => {
        // mock tripelStore call
        nock('http://test:123')
            .post('/test') // .post('/')
            .reply(200, successInitalIncomingAutocomplete);

        const result = await ac.getIncomingInitialAsync("http://uri/"); 
        expect(result).to.eql(initalIncomingACResult);
    });

    it('Try getIncomingInitialAsync with Exception Response from TripleStore', async () => {
        // mock tripelStore call
        nock('http://test:123/')
            .post('/test')
            .replyWithError('something awful happened');

        const result = await ac.getIncomingInitialAsync("http://uri/");
        expect(result).to.eql([]);
    });


    it('Try getIncomingAsync with Success Response from TripleStore', async () => {
        // mock tripelStore call
        nock('http://test:123/')
            .post('/test')
            .reply(200, successIncomingAutocomplete);

        const result = await ac.getIncomingAsync("http://uri/", "erik");
        expect(result).to.eql(incomingACResult);
    });

    it('Try getIncomingAsync with Exception Response from TripleStore', async () => {
        // mock tripelStore call
        nock('http://test:123/')
            .post('/test')
            .replyWithError('something awful happened');

            const result = await ac.getIncomingAsync("http://uri/", "erik");
        expect(result).to.eql([]);
    });

    it('Try getIncomingRandomAsync with Success Response from TripleStore', async () => {
        // mock tripelStore call
        nock('http://test:123/')
            .post('/test')
            .reply(200, successIncomingRandomAutocomplete);

        const result = await ac.getIncomingRandomAsync("http://uri/");
        expect(result).to.eql(incomingRandomACResult);
    });

    it('Try getIncomingRandomAsync with Exception Response from TripleStore', async () => {
        // mock tripelStore call
        nock('http://test:123/')
            .post('/test')
            .replyWithError('something awful happened');

            const result = await ac.getIncomingRandomAsync("http://uri/");
        expect(result).to.eql([]);
    });

    it('Try getOutgoingAsync success with multiple groups', async () => {
        // mock tripelStore call
        nock('http://test:123/')
            .post('/test')
            .reply(200, successOutgoingMultipleGroups);

            const result = await ac.getOutgoingAsync("Bay");
        expect(result).to.eql(outgoingMultipleGroupsResult);
    });

    it('Try getOutgoingAsync success with one group', async () => {
        // mock tripelStore call
        nock('http://test:123/')
            .post('/test')
            .reply(200, successOutgoingOneGroup);

            const result = await ac.getOutgoingAsync("Bay");
        expect(result).to.eql(outgoingOneGroupsResult);
    });

    it('Try getOutgoingAsync success with DEFAULT group', async () => {
        // mock tripelStore call
        nock('http://test:123/')
            .post('/test')
            .reply(200, successOutgoingDefaultGroup);

            const result = await ac.getOutgoingAsync("Bay");
        expect(result).to.eql(outgoingDefaultGroupResult);
    });

    it('Try getOutgoingAsync Exception Response from TripleStore', async () => {
        // mock tripelStore call
        nock('http://test:123/')
            .post('/test')
            .replyWithError('something awful happened');

            const result = await ac.getOutgoingAsync("Bay");
        expect(result).to.eql([]);
    });
});
