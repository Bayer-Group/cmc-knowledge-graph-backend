import { expect } from 'chai';
import {parseAutocomplete} from '../../src/services/helpers.service';
import { autocompleteNquads, autocompleteResult } from './mockdata/autocomplete.mock';


describe('ParseAutocomplete Incoming', async () => {
    it('Try ParseAutocomplete with Data', async () => {
        const result = parseAutocomplete(autocompleteNquads);
        // console.log("Result: ", result);
        expect(result).to.eql(autocompleteResult);
    });

    it('Try ParseAutocomplete without Data', async () => {
        const result = parseAutocomplete("");
        expect(result).to.eql([]);
    });
});