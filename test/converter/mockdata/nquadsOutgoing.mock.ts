export const nquadsOutgoing = `
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/worksOn> <http://example.com/KnowledgeSpace> .
<http://example.com/KnowledgeSpace> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/Project> .
<http://example.com/KnowledgeSpace> <http://www.w3.org/2000/01/rdf-schema#label> "Knowledge Space" .
<http://example.com/KnowledgeSpace> <http://example.com/workedOnBy> <http://example.com/Person/glqze> .
<http://example.com/KnowledgeSpace> <http://www.w3.org/1999/02/22-rdf-syntax-ns#test> <http://example.com/Person/glqze> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://pid.bayer.com/kos/19014/Person> <http://www.w3.org/2000/01/rdf-schema#label> "Person" .
<http://pid.bayer.com/kos/19014/Person> <http://www.w3.org/2000/01/rdf-schema#comment> "This is a person, saved in ontorest" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/offers> <http://example.com/Product/LinkedDataBasics> .
<http://example.com/Product/LinkedDataBasics> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/Product> .
<http://example.com/Product/LinkedDataBasics> <http://www.w3.org/2000/01/rdf-schema#label> "Training on Basics of Linked Data" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/isLocateIn> <http://example.com/bln_m427> .
<http://example.com/bln_m427> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/OfficeBuilding> .
<http://example.com/bln_m427> <http://www.w3.org/2000/01/rdf-schema#label> "Building M427" .
<http://example.com/bln_m427> <http://example.com/hasPicture> <https://bayernet.int.bayer.com/-/media/bag-intra/ws_bayernet/germany/ph-berlin/shared/news/standardbilder/luftbild.jpg?h=400&w=600&la=de-DE&hash=BE36C5761EDC42E094380C68714B0F2A> .
<http://example.com/bln_m427> <http://example.com/hasPicture> "https://transkript.de/fileadmin//transkript/01_Nachrichten/2020/2020_02_11_bayer_berlin.jpg" .
<http://example.com/bln_m427> <http://example.com/street> "Gerichtstr. " .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/affiliatedWith> <http://example.com/companies/Bayer> .
<http://example.com/companies/Bayer> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/Company> .
<http://example.com/companies/Bayer> <http://www.w3.org/2000/01/rdf-schema#label> "Bayer AG" .
<http://example.com/companies/Bayer> <http://example.com/hasPicture> <https://bayernet.int.bayer.com/-/media/bag-intra/ws_bayernet/site-configuration/logo/bayer-logo.svg?la=de-DE&hash=D39973A6139797AC177B7D529C2F27F6> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/firstName> "G\u00F6khan" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/hasPicture> <https://mug0eu-1.assets-yammer.com/mugshot/images/Ph0GLscW22mMsf2MPwTxw9K2DPD1J1fl> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/lastName> "Coskun" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://www.w3.org/2000/01/rdf-schema#label> "G\u00F6khan Coskun" .
`

export const nquadsOutgoing2 = `
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/worksOn> <http://example.com/KnowledgeSpace> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://www.w3.org/2000/01/rdf-schema#label> "G\u00F6khan Coskun" .
`

export const nquadsOutgoing3 = `
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/worksOn> <http://example.com/KnowledgeSpace> .
<http://example.com/bln_m427> <http://www.w3.org/2000/01/rdf-schema#label> "Building M427" .
<http://example.com/KnowledgeSpace> <http://www.w3.org/2000/01/rdf-schema#label> "Knowledge Space" .
<http://example.com/companies/Bayer> <http://example.com/hasPicture> <https://bayernet.int.bayer.com/-/media/bag-intra/ws_bayernet/site-configuration/logo/bayer-logo.svg?la=de-DE&hash=D39973A6139797AC177B7D529C2F27F6> .
<http://example.com/bln_m427> <http://example.com/hasPicture> <https://bayernet.int.bayer.com/-/media/bag-intra/ws_bayernet/germany/ph-berlin/shared/news/standardbilder/luftbild.jpg?h=400&w=600&la=de-DE&hash=BE36C5761EDC42E094380C68714B0F2A> .
<http://example.com/KnowledgeSpace> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/Project> .
<http://example.com/KnowledgeSpace> <http://example.com/workedOnBy> <http://example.com/Person/glqze> .
<http://example.com/KnowledgeSpace> <http://www.w3.org/1999/02/22-rdf-syntax-ns#test> <http://example.com/Person/glqze> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://pid.bayer.com/kos/19014/Person> <http://www.w3.org/2000/01/rdf-schema#label> "Person" .
<http://pid.bayer.com/kos/19014/Person> <http://www.w3.org/2000/01/rdf-schema#comment> "This is a person, saved in ontorest" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/offers> <http://example.com/Product/LinkedDataBasics> .
<http://example.com/Product/LinkedDataBasics> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/Product> .
<http://example.com/Product/LinkedDataBasics> <http://www.w3.org/2000/01/rdf-schema#label> "Training on Basics of Linked Data" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/isLocateIn> <http://example.com/bln_m427> .
<http://example.com/bln_m427> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/OfficeBuilding> .
<http://example.com/bln_m427> <http://example.com/hasPicture> "https://transkript.de/fileadmin//transkript/01_Nachrichten/2020/2020_02_11_bayer_berlin.jpg" .
<http://example.com/bln_m427> <http://example.com/street> "Gerichtstr. " .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/affiliatedWith> <http://example.com/companies/Bayer> .
<http://example.com/companies/Bayer> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/Company> .
<http://example.com/companies/Bayer> <http://www.w3.org/2000/01/rdf-schema#label> "Bayer AG" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/firstName> "G\u00F6khan" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/hasPicture> <https://mug0eu-1.assets-yammer.com/mugshot/images/Ph0GLscW22mMsf2MPwTxw9K2DPD1J1fl> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/lastName> "Coskun" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://www.w3.org/2000/01/rdf-schema#label> "G\u00F6khan Coskun" .
`