import { D3Node } from "../../../src/services/models/d3Node.model"

const mockedNodeObj01: D3Node = {
    uri: "http://test/test123",
    data: {
        mainLabel: "Unlabelled Node"
    }
}

const mockedNodeObj02: D3Node = {
    uri: "_:bnode",
    data: {
        mainLabel: "bnode"
    }
}

const mockedNodes = {
    mockedNodeObj01,
    mockedNodeObj02
}

export default mockedNodes;