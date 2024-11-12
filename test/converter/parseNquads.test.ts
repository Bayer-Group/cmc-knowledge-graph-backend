import {parseNquads} from '../../src/services/helpers.service';
import {mockNquads, mockNquadsWithSpecialCharacters} from './mockdata/nquads.mock';
import {parsedNquadsResult, parsedNquadsSpecialCharacterResult} from './mockdata/parsedNquadsResult.mock';
import { TripleModel } from '../../src/services/models/triples.model';
import { expect } from 'chai';


describe('ParseNquads', async () => {
    it('Try parsing nquads to TripleModel', async () => {
        const result = parseNquads(mockNquads);
        expect(result).to.eql(parsedNquadsResult);
    })
    it('Try parsing nquads to TripleModel', async () => {
        const result = parseNquads(mockNquadsWithSpecialCharacters);
        expect(result).to.eql(parsedNquadsSpecialCharacterResult);
    })
})