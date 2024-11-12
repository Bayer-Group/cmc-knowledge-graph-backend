import {mockNquadsWithClass, mockNquadsWithoutClass} from './mockdata/nquads.mock';
import { expect } from 'chai';
import {nquadsToD3Description} from '../../src/services/helpers.service';
import { d3DescriptionResult, d3DescriptionResultWithoutClass } from './mockdata/d3Description.mock';


describe('NquadsToD3Description', async () => {
    it('Try NquadsToD3Description with Class', async () => {
        const result = nquadsToD3Description(mockNquadsWithClass);
        expect(result).to.eql(d3DescriptionResult);
    });

    it('Try NquadsToD3Description without Class', async () => {
        const result = nquadsToD3Description(mockNquadsWithoutClass);
        // console.log(result);
        expect(result).to.eql(d3DescriptionResultWithoutClass);
    });
})