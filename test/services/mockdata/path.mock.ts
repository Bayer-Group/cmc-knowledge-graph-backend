export const pathResponse = {
    "head": {
      "vars": [
        "x",
        "x",
        "p",
        "forward",
        "y",
        "y"
      ]
    },
    "results": {
      "bindings": [
        {
          "p": {
            "type": "uri",
            "value": "http://example.com/worksOn"
          },
          "forward": {
            "datatype": "http://www.w3.org/2001/XMLSchema#boolean",
            "type": "literal",
            "value": "true"
          },
          "x": {
            "type": "uri",
            "value": "http://pid.bayer.com/kos/19014/1/ggvcm"
          },
          "y": {
            "type": "uri",
            "value": "http://example.com/KnowledgeSpace"
          }
        },
        {
          "p": {
            "type": "uri",
            "value": "http://example.com/worksOn"
          },
          "forward": {
            "datatype": "http://www.w3.org/2001/XMLSchema#boolean",
            "type": "literal",
            "value": "false"
          },
          "x": {
            "type": "uri",
            "value": "http://example.com/KnowledgeSpace"
          },
          "y": {
            "type": "uri",
            "value": "http://example.com/Person/erik"
          }
        }
      ]
    }
  }

export const fullPathResult = {
    "nodes": [
      {
        "uri": "http://pid.bayer.com/kos/19014/1/ggvcm",
        "data": {
          "mainLabel": "Gökhan Coskun",
          "http://www.w3.org/2000/01/rdf-schema#label": {
            "prettyLabel": "label",
            "values": [
              "Gökhan Coskun"
            ]
          },
          "http://example.com/firstName": {
            "prettyLabel": "firstName",
            "values": [
              "Gökhan"
            ]
          },
          "http://example.com/lastName": {
            "prettyLabel": "lastName",
            "values": [
              "Coskun"
            ]
          }
        }
      },
      {
        "uri": "http://example.com/KnowledgeSpace",
        "data": {
          "mainLabel": "Knowledge Space",
          "http://www.w3.org/2000/01/rdf-schema#label": {
            "prettyLabel": "label",
            "values": [
              "Knowledge Space"
            ]
          }
        }
      },
      {
        "uri": "http://example.com/Person/erik",
        "data": {
          "mainLabel": "Erik Krummeich",
          "http://www.w3.org/2000/01/rdf-schema#label": {
            "prettyLabel": "label",
            "values": [
              "Erik Krummeich"
            ]
          },
          "http://example.com/firstName": {
            "prettyLabel": "firstName",
            "values": [
              "Erik"
            ]
          },
          "http://example.com/lastName": {
            "prettyLabel": "lastName",
            "values": [
              "Krummeich"
            ]
          }
        }
      }
    ],
    "links": [
      {
        "prettyLabel": "worksOn",
        "label": "http://example.com/worksOn",
        "source": "http://pid.bayer.com/kos/19014/1/ggvcm",
        "target": "http://example.com/KnowledgeSpace"
      },
      {
        "prettyLabel": "worksOn",
        "label": "http://example.com/worksOn",
        "source": "http://example.com/Person/erik",
        "target": "http://example.com/KnowledgeSpace"
      }
    ]
  };