
export interface IDBConfigService {

    /**
     *Returns Paths for TripleStores
    */
    getDBPaths(): Promise<any>
}