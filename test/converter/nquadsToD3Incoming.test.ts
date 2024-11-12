import { expect } from 'chai';
import { nquadsIncoming } from './mockdata/nquadsIncoming.mock';
import { d3Incoming } from './mockdata/d3Incoming.mock';
import {NQuadsToD3ConverterService} from '../../src/services/nquadsToD3Converter.service';



describe('NquadsToD3Incoming', async () => {
    it('Try NquadsToD3Incoming with Data', async () => {
        const result = NQuadsToD3ConverterService.getInstance().convertIncoming(nquadsIncoming, "http://pid.bayer.com/kos/19014/1/ggvcm");
        // console.log("Result: ", result);
        expect(result).to.eql(d3Incoming);
    });

    it('Try NquadsToD3Incoming without Data', async () => {
        const result = NQuadsToD3ConverterService.getInstance().convertIncoming(nquadsIncoming, "http://pid.bayer.com/kos/1231411");
        expect(result).to.eql({nodes: [], links: []});
    });
})