export const successInitalIncomingAutocomplete = `
<http://example.com/Person/FriedrichBayer> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://example.com/Person/FriedrichBayer> <http://www.w3.org/2000/01/rdf-schema#label> "Friedrich Bayer" .
<http://example.com/Person/FriedrichBayer> <http://example.com/firstName> "Friedrich" .
<http://example.com/Person/FriedrichBayer> <http://example.com/lastName> "Bayer" .
<http://example.com/Person/erik> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://example.com/Person/erik> <http://www.w3.org/2000/01/rdf-schema#label> "Erik Krummeich" .
<http://example.com/Person/erik> <http://example.com/firstName> "Erik" .
`

export const successIncomingAutocomplete = `
<http://example.com/Person/erik> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://example.com/Person/erik> <http://www.w3.org/2000/01/rdf-schema#label> "Erik Krummeich" .
<http://example.com/Person/erik> <http://example.com/firstName> "Erik" .
`

export const successIncomingRandomAutocomplete = `
<http://example.com/Person/erik> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> "Erik Krummeich" .
<http://pid.bayer.com/kos/19014/1/ggvcm> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> "G\u00F6khan Coskun" .
<http://example.com/Person/FriedrichBayer> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> "Friedrich Bayer" .
`

export const successOutgoingMultipleGroups = `
<http://example.com/Person/FriedrichBayer> <http://www.w3.org/2000/01/rdf-schema#label> "Friedrich Bayer" .
<http://example.com/Person/FriedrichBayer> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://example.com/Person/FriedrichBayer> <http://example.com/lastName> "Bayer" .
<http://example.com/bln_m427> <http://example.com/hasPicture> "https://transkript.de/fileadmin//transkript/01_Nachrichten/2020/2020_02_11_bayer_berlin.jpg" .
<http://example.com/bln_m427> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/OfficeBuilding> .
<http://example.com/companies/Bayer> <http://www.w3.org/2000/01/rdf-schema#label> "Bayer AG" .
<http://example.com/companies/Bayer> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://example.com/Company> .
`

export const successOutgoingOneGroup = `
<http://example.com/Person/FriedrichBayer> <http://www.w3.org/2000/01/rdf-schema#label> "Friedrich Bayer" .
<http://example.com/Person/FriedrichBayer> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://pid.bayer.com/kos/19014/Person> .
<http://example.com/Person/FriedrichBayer> <http://example.com/lastName> "Bayer" .
`

export const successOutgoingDefaultGroup = `
<http://example.com/Person/FriedrichBayer> <http://www.w3.org/2000/01/rdf-schema#label> "Friedrich Bayer" .
<http://example.com/Person/FriedrichBayer> <http://example.com/lastName> "Bayer" .
`