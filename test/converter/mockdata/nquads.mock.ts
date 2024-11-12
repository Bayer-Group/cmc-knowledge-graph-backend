export const mockNquads = `
<http://test/test/123> <http://test/123/123> <http://test/1235/123> .
<http://test/test/123> <http://test/123/123> <http://test/1235/123> .
<http://test/test/123> <http://test/123/123> <http://test/1235/123> .
<http://test/test/123> <http://test/123/123> <http://test/1235/123> .
<http://test/test/123> <http://test/123/123> <http://test/1235/123> .
<http://test/test/123> <http://test/123/123> <http://test/1235/123> .
<http://test/test/123> <http://test/123/123> <http://test/1235/123> .
`

export const mockNquadsWithClass = `
<http://test/test/123> <http://test/123/123> <http://test/1235/123> .
<http://test/test/hallo> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .
<http://test/test/123> <http://test/1234667> "Test" .
`

export const mockNquadsWithoutClass = `
<http://test/test/123> <http://test/123/123> <http://test/1235/123> .
<http://test/test/123> <http://test/1234667> "Test" .
`
export const mockNquadsFullData = `
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://www.w3.org/2000/01/rdf-schema#label> "G\u00F6khan Coskun" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/firstName> "G\u00F6khan" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/lastName> "Coskun" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/affiliatedWith> <http://example.com/companies/Bayer> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/worksOn> <http://example.com/KnowledgeSpace> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/hasPicture> <https://mug0eu-1.assets-yammer.com/mugshot/images/Ph0GLscW22mMsf2MPwTxw9K2DPD1J1fl> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/isLocateIn> <http://example.com/bln_m427> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/offers> <http://example.com/Product/LinkedDataBasics> .
`

export const mockNquadsWithSpecialCharacters = `
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/offers> "\u01C5enan \u01C5afi\u0107" .
<http://pid.bayer.com/kos/19014/1/ggvcm> "\u01C5enan \u01C5afi\u0107" <http://example.com/offers> .
"\u01C5enan \u01C5afi\u0107" <http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/offers> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/offers> "Ger\u00e4te\u00fcberh\u00f6hung" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/offers> "le tr\u00e9ma" .
`