import { DbConfig } from "./dbconfig.model";

export class ClassTableRequest {
    classUri: string;
    attributes: ClassTableAttributes[];
    dbConfig: DbConfig[];
    user:string;
}

export class ClassTableAttributes {
    uri: string;
    display: string;
}

export class ClassTableLabelRequest {
    attributes: string[];
    labels: string[];
    dbConfig: DbConfig[];
}

export class ClassTableLabelResponse {
    [key: string]: string[];
}