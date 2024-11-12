import { AutocompleteResult, GroupAutocompleteResult } from "../../../src/services/models/autocomplete.model"

export const autocompleteNquads = `
<http://test/test/mk> <http://test/123/123> "hallo" .
<http://test/test/ab> <http://test/123/123> "hello" .
<http://test/test/cd> <http://test/123/123> "hola" .
`
export const autocompleteResult: AutocompleteResult[] = [
    { uri: 'http://test/test/mk', value: 'hallo', link: '123' },
    { uri: 'http://test/test/ab', value: 'hello', link: '123' },
    { uri: 'http://test/test/cd', value: 'hola', link: '123' }
]

export const autocompleteGroupResult: GroupAutocompleteResult[] = [
  {
    group: "default",
    data: [
      { uri: 'http://test/test/mk', value: 'hello', link: '123' },
      { uri: 'http://test/test/ab', value: 'hi', link: '123' }
    ]
  },
  {
    group: "TEST",
    data: [
      { uri: 'http://test/test/de', value: 'hihihi', link: '123' }
    ]
  }
]

export const autocompleteGroupResultDefault: GroupAutocompleteResult[] = [
  {
    group: "default",
    data: [
      { uri: 'http://test/test/mk', value: 'hello', link: '123' },
      { uri: 'http://test/test/ab', value: 'hihi', link: '123' }
    ]
  }
]

export const autocompleteJson = {
  results:
    {
      bindings: [
        {
          link: { value: "http://test/123/123"},
          uri: { value: "http://test/test/mk"},
          value: { value: "hello"}
        },
        {
          link: { value: "http://test/123/123"},
          uri: { value: "http://test/test/ab"},
          value: { value: "hihi"}
        }
      ]
              
    }
}

export const autocompleteXML = {
  sparql: {
    results: [
      {
        result: [
          {
            binding: [
              {
                uri: ["http://test/123/123"],
                "$": {
                  name: "link"
                }
              },
              {
                uri: ["http://test/test/mk"],
                "$": {
                  name: "uri"
                }
              },
              {
                literal: ["hello"],
                "$": {
                  name: "value"
                }
              }
            ]
          },
          {
            binding: [
              {
                uri: ["http://test/123/123"],
                "$": {
                  name: "link"
                }
              },
              {
                uri: ["http://test/test/ab"],
                "$": {
                  name: "uri"
                }
              },
              {
                literal: ["hi"],
                "$": {
                  name: "value"
                }
              }
            ]
          },
          {
            binding: [
              {
                uri: ["http://test/123/123"],
                "$": {
                  name: "link"
                }
              },
              {
                uri: ["http://test/test/de"],
                "$": {
                  name: "uri"
                }
              },
              {
                uri: ["http://test/test/TEST"],
                "$": {
                  name: "type"
                }
              },
              {
                literal: ["hihihi"],
                "$": {
                  name: "value"
                }
              }
            ]
          }
        ]
      }
    ]
  }
}