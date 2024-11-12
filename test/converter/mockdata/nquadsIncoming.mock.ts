export const nquadsIncoming = `
<http://localhost:5820/Person/EPMQX> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://localhost:5820/Person> .
<http://example.com/Company> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .
<http://example.com/companies/Bayer> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/Company> .
<http://example.com/KnowledgeSpace> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/Project> .
<http://example.com/Project> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .
<http://example.com/OfficeBuilding> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .
<http://example.com/bln_m427> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/OfficeBuilding> .
<http://example.com/Person> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .
<http://example.com/Person/FriedrichBayer> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://example.com/Person/erik> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://example.com/affiliatedWith> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Property> .
<http://example.com/worksOn> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Property> .
<http://example.com/Product/LinkedDataBasics> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/Product> .
<http://example.com/Substance> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .
<http://example.com/bln_m427> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/OfficeBuilding> .
<http://example.com/companies/Bayer> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/Company> .
<http://example.com/isLocateIn> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Property> .
<http://example.com/offers> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Property> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://example.com/Company> <http://www.w3.org/2000/01/rdf-schema#label> "Company" .
<http://example.com/companies/Bayer> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/Company> .
<http://www.w3.org/2000/01/rdf-schema#Class> <http://www.w3.org/2000/01/rdf-schema#label> "Class" .
<http://example.com/Company> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .
<http://example.com/Project> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .
<http://example.com/OfficeBuilding> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .
<http://example.com/Person> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .
<http://example.com/Substance> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .
<http://example.com/KnowledgeSpace> <http://www.w3.org/2000/01/rdf-schema#label> "Knowledge Space" .
<http://example.com/OfficeBuilding> <http://www.w3.org/2000/01/rdf-schema#label> "Office Building" .
<http://example.com/bln_m427> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/OfficeBuilding> .
<http://example.com/Person> <http://www.w3.org/2000/01/rdf-schema#label> "Person" .
<http://example.com/Person/FriedrichBayer> <http://www.w3.org/2000/01/rdf-schema#label> "Friedrich Bayer" .
<http://pid.bayer.com/kos/19014/Person> <http://www.w3.org/2000/01/rdf-schema#label> "Person" .
<http://example.com/Person/FriedrichBayer> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://example.com/Person/erik> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://example.com/Person/erik> <http://www.w3.org/2000/01/rdf-schema#label> "Erik Krummeich" .
<http://example.com/Product/LinkedDataBasics> <http://www.w3.org/2000/01/rdf-schema#label> "Training on Basics of Linked Data" .
<http://example.com/bln_m427> <http://www.w3.org/2000/01/rdf-schema#label> "Building M427" .
<http://example.com/companies/Bayer> <http://www.w3.org/2000/01/rdf-schema#label> "Bayer AG" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://www.w3.org/2000/01/rdf-schema#label> "G\u00F6khan Coskun" .
<http://example.com/KnowledgeSpace> <http://example.com/workedOnBy> <http://example.com/Person/glqze> .
<http://example.com/KnowledgeSpace> <http://www.w3.org/1999/02/22-rdf-syntax-ns#test> <http://example.com/Person/glqze> .
<http://example.com/Person/FriedrichBayer> <http://example.com/firstName> "Friedrich" .
<http://example.com/Person/erik> <http://example.com/firstName> "Erik" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/firstName> "G\u00F6khan" .
<http://example.com/Person/FriedrichBayer> <http://example.com/lastName> "Bayer" .
<http://example.com/Person/erik> <http://example.com/lastName> "Krummeich" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/lastName> "Coskun" .
<http://example.com/Person/erik> <http://example.com/affiliatedWith> <http://example.com/companies/Capgemini> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/affiliatedWith> <http://example.com/companies/Bayer> .
<http://example.com/Person/erik> <http://example.com/worksOn> <http://example.com/KnowledgeSpace> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/worksOn> <http://example.com/KnowledgeSpace> .
<http://example.com/bln_m427> <http://example.com/hasPicture> <https://bayernet.int.bayer.com/-/media/bag-intra/ws_bayernet/germany/ph-berlin/shared/news/standardbilder/luftbild.jpg?h=400&w=600&la=de-DE&hash=BE36C5761EDC42E094380C68714B0F2A> .
<http://example.com/bln_m427> <http://example.com/hasPicture> "https://transkript.de/fileadmin//transkript/01_Nachrichten/2020/2020_02_11_bayer_berlin.jpg" .
<http://example.com/companies/Bayer> <http://example.com/hasPicture> <https://bayernet.int.bayer.com/-/media/bag-intra/ws_bayernet/site-configuration/logo/bayer-logo.svg?la=de-DE&hash=D39973A6139797AC177B7D529C2F27F6> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/hasPicture> <https://mug0eu-1.assets-yammer.com/mugshot/images/Ph0GLscW22mMsf2MPwTxw9K2DPD1J1fl> .
<http://example.com/bln_m427> <http://example.com/street> "Gerichtstr. " .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/isLocateIn> <http://example.com/bln_m427> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://example.com/offers> <http://example.com/Product/LinkedDataBasics> .
<http://pid.bayer.com/kos/19014/Person> <http://www.w3.org/2000/01/rdf-schema#comment> "This is a person, saved in ontorest" .
<http://example.com/Person/FriedrichBayer> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://example.com/Person/erik> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<https://pid.bayer.com/70107/001/1/SubstanceCombination_13057> <http://example.com/Test> <http://pid.bayer.com/kos/19014/1/ggvcm> .

`