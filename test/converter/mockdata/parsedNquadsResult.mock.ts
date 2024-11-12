import { TripleModel } from "../../../src/services/models/triples.model";

export const parsedNquadsResult: TripleModel[] = [
    {
      s: 'http://test/test/123',
      p: 'http://test/123/123',
      o: 'http://test/1235/123'
    },
    {
      s: 'http://test/test/123',
      p: 'http://test/123/123',
      o: 'http://test/1235/123'
    },
    {
      s: 'http://test/test/123',
      p: 'http://test/123/123',
      o: 'http://test/1235/123'
    },
    {
      s: 'http://test/test/123',
      p: 'http://test/123/123',
      o: 'http://test/1235/123'
    },
    {
      s: 'http://test/test/123',
      p: 'http://test/123/123',
      o: 'http://test/1235/123'
    },
    {
      s: 'http://test/test/123',
      p: 'http://test/123/123',
      o: 'http://test/1235/123'
    },
    {
      s: 'http://test/test/123',
      p: 'http://test/123/123',
      o: 'http://test/1235/123'
    }
  ];

  export const parsedNquadsSpecialCharacterResult: TripleModel[] = [
    {
      s: 'http://pid.bayer.com/kos/19014/1/ggvcm',
      p: 'http://example.com/offers',
      o: 'ǅenan ǅafić'
    },
    {
      s: 'http://pid.bayer.com/kos/19014/1/ggvcm',
      p: 'ǅenan ǅafić',
      o: 'http://example.com/offers'
    },
    {
      s: 'ǅenan ǅafić',
      p: 'http://pid.bayer.com/kos/19014/1/ggvcm',
      o: 'http://example.com/offers'
    },
    {
      s: 'http://pid.bayer.com/kos/19014/1/ggvcm',
      p: 'http://example.com/offers',
      o: 'Geräteüberhöhung'
    },
    {
      s: 'http://pid.bayer.com/kos/19014/1/ggvcm',
      p: 'http://example.com/offers',
      o: 'le tréma'
    },
  ];

export default parsedNquadsResult;