import { createNodeObject, createLinkObject, removeUrlFromString, isValue } from '../../src/services/helpers.service'
import { expect } from 'chai';
import mockedNodes from './mockdata/nodeObjects.mock';
import mockedD3Link from './mockdata/linkObjects.mock';


describe('Helpers', async () => {
    it('Create Basic Node Object', async () => {
        const result = createNodeObject("http://test/test123");
        expect(result).to.eql(mockedNodes.mockedNodeObj01);
    });

    it('Create _BNODE Node Object', async () => {
        const result = createNodeObject("_:bnode");
        expect(result).to.eql(mockedNodes.mockedNodeObj02);
    });

    it('Create Link Object', async () => {
        const result = createLinkObject("http://test/hallo", "http://test/1", "http://test/2");
        expect(result).to.eql(mockedD3Link);
    });

    it('Remove URL from String', async () => {
        const result = removeUrlFromString("http://test/hallo");
        expect(result).to.eql("hallo");
    });

    it('Is Value true', async () => {
        const result = isValue("test");
        expect(result).to.eql(true);
    });

    it('Is Value false', async () => {
        const result = isValue("http://test/hallo");
        const result2 = isValue("https://test/hallo");
        expect(result).to.eql(false);
        expect(result2).to.eql(false);
    });
})