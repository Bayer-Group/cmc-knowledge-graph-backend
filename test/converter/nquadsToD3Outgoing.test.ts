import {mockNquadsFullData} from './mockdata/nquads.mock';
import { expect } from 'chai';
import {NQuadsToD3ConverterService} from '../../src/services/nquadsToD3Converter.service';
import { d3OutgoingAdditional, d3OutgoingResult2, d3OutgoingResult3 } from './mockdata/d3OutgoingAdditional.mock';
import { nquadsOutgoing, nquadsOutgoing2, nquadsOutgoing3 } from './mockdata/nquadsOutgoing.mock';


describe('NquadsToD3Outgoing', async () => {
    
    it('Try NquadsToD3Outgoing(Aditional) with Data', async () => {
        const result = NQuadsToD3ConverterService.getInstance().convertOutgoing(nquadsOutgoing, "http://pid.bayer.com/kos/19014/1/ggvcm");
        // console.log("Result: ", result);
        expect(result).to.eql(d3OutgoingAdditional);
    });

    it('Try NquadsToD3Outgoing with small Data (nquadsOutgoing2)', async () => {
        const result = NQuadsToD3ConverterService.getInstance().convertOutgoing(nquadsOutgoing2, "");
        // console.log("Result: ", result);
        expect(result).to.eql(d3OutgoingResult2);
    });

    it('Try NquadsToD3Outgoing with Data, line order changed, for path coverage', async () => {
        const result = NQuadsToD3ConverterService.getInstance().convertOutgoing(nquadsOutgoing3, "");
        // console.log("Result: ", result);
        expect(result).to.eql(d3OutgoingResult3);
    });

    it('Try NquadsToD3Outgoing without Data', async () => {
        const result = NQuadsToD3ConverterService.getInstance().convertOutgoing("", "http://pid.bayer.com/kos/1231411");
        expect(result).to.eql({nodes: [], links: []});
    });
});