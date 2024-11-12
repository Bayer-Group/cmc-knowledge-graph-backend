export const initalIncomingACResult = [
    {
      "uri": "http://example.com/Person/FriedrichBayer",
      "value": "Friedrich Bayer",
      "link": "label"
    },
    {
      "uri": "http://example.com/Person/FriedrichBayer",
      "value": "Friedrich",
      "link": "firstName"
    },
    {
      "uri": "http://example.com/Person/FriedrichBayer",
      "value": "Bayer",
      "link": "lastName"
    },
    {
      "uri": "http://example.com/Person/erik",
      "value": "Erik Krummeich",
      "link": "label"
    },
    {
      "uri": "http://example.com/Person/erik",
      "value": "Erik",
      "link": "firstName"
    }
  ];

export const incomingACResult = [
    {
      "uri": "http://example.com/Person/erik",
      "value": "Erik Krummeich",
      "link": "label"
    },
    {
      "uri": "http://example.com/Person/erik",
      "value": "Erik",
      "link": "firstName"
    }
  ];

export const incomingRandomACResult = [
    {
      "uri": "http://example.com/Person/erik",
      "value": "Erik Krummeich",
      "link": "type"
    },
    {
      "uri": "http://pid.bayer.com/kos/19014/1/ggvcm",
      "value": "Gökhan Coskun",
      "link": "type"
    },
    {
      "uri": "http://example.com/Person/FriedrichBayer",
      "value": "Friedrich Bayer",
      "link": "type"
    }
  ]

export const outgoingMultipleGroupsResult = [
    {
      "group": "Person",
      "data": [
        {
          "uri": "http://example.com/Person/FriedrichBayer",
          "link": "label",
          "value": "Friedrich Bayer"
        },
        {
          "uri": "http://example.com/Person/FriedrichBayer",
          "link": "lastName",
          "value": "Bayer"
        }
      ]
    },
    {
      "group": "OfficeBuilding",
      "data": [
        {
          "uri": "http://example.com/bln_m427",
          "link": "hasPicture",
          "value": "https://transkript.de/fileadmin//transkript/01_Nachrichten/2020/2020_02_11_bayer_berlin.jpg"
        }
      ]
    },
    {
      "group": "Company",
      "data": [
        {
          "uri": "http://example.com/companies/Bayer",
          "link": "label",
          "value": "Bayer AG"
        }
      ]
    }
  ];

  export const outgoingOneGroupsResult = [
    {
      "group": "Person",
      "data": [
        {
          "uri": "http://example.com/Person/FriedrichBayer",
          "link": "label",
          "value": "Friedrich Bayer"
        },
        {
          "uri": "http://example.com/Person/FriedrichBayer",
          "link": "lastName",
          "value": "Bayer"
        }
      ]
    }
  ];

  export const outgoingDefaultGroupResult = [
    {
      "group": "Default",
      "data": [
        {
          "uri": "http://example.com/Person/FriedrichBayer",
          "link": "label",
          "value": "Friedrich Bayer"
        },
        {
          "uri": "http://example.com/Person/FriedrichBayer",
          "link": "lastName",
          "value": "Bayer"
        }
      ]
    }
  ];