import { config } from "../config/config";
import { Path, TripleStore } from "../config/configfile.model";
import TripleStoreConnector from "../connector/triplestore.connector";
import logger from "../logger/logger";
import { DbConfig } from "../routes/models/dbconfig.model";
import { GraphDataService } from "./graphdata.service";
import { IDBConfigService } from "./interfaces/dbconfig.service.interface";

export class DBConfigService implements IDBConfigService {
  private kgeConfig: DbConfig[];
  private kgeConfigConnection: GraphDataService;

  constructor() {
    this.kgeConfig = [
      {
        dbpath: config().tripleStores.KGEConfigDB.path,
        selectedNamedGraphs: [],
        instance: "KGEConfigDB",
        virtualGraphs: [],
      },
    ];
    this.kgeConfigConnection = new GraphDataService(
      config().tripleStores.KGEConfigDB,
      this.kgeConfig
    );
  }

  public async getDBPaths(): Promise<any> {
    try {
      const result = await this.kgeConfigConnection.getTripleStores();

      
      return result;
    } catch (error) {
      logger.error("error while fetching getDBPaths");
      logger.error(error.message);
      return null;
    }
  }
}
