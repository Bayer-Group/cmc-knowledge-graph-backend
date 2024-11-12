export class PathResult {
    head: Head;
    results: Results;
}

export class Head {
    vars: string[];
}

export class Results {
    bindings: Binding[];
}

export class Binding {
    [key: string]: any;
}

