import {mockNquadsFullData} from './mockdata/nquads.mock';
import { expect } from 'chai';
import { d3OutgoingAdditional } from './mockdata/d3OutgoingAdditional.mock';
import { nquadsOutgoing } from './mockdata/nquadsOutgoing.mock';
import {NQuadsToD3ConverterService} from '../../src/services/nquadsToD3Converter.service';


describe('NquadsToD3OutgoingAdditional', async () => {
    it('Try NquadsToD3OutgoingAdditional with Data', async () => {
        const result = NQuadsToD3ConverterService.getInstance().convertOutgoing(nquadsOutgoing, "http://pid.bayer.com/kos/19014/1/ggvcm");
        // console.log("Result: ", result);
        expect(result).to.eql(d3OutgoingAdditional);
    });

    it('Try NquadsToD3OutgoingAdditional without Data', async () => {
        const result = NQuadsToD3ConverterService.getInstance().convertOutgoing("", "http://pid.bayer.com/kos/1231411");
        expect(result).to.eql({nodes: [], links: []});
    });
});