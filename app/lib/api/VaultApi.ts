import { inject, injectable } from "inversify";

import { delay } from "bluebird";
import { symbols } from "../../di/symbols";
import { ILogger } from "../dependencies/Logger";
import { IHttpClient } from "./client/IHttpClient";

//This is a mock implementation

@injectable()
export class VaultApi {
  // tslint:disable-next-line
  constructor(
    // tslint:disable-next-line
    @inject(symbols.jsonHttpClient) private httpClient: IHttpClient,
    @inject(symbols.logger) private logger: ILogger,
  ) {}

  // tslint:disable-next-line
  public async store(key: string, serializedVault: string): Promise<void> {
    this.logger.info(`Storing vault at ${key}`);
    return delay(500);
  }

  // tslint:disable-next-line
  public async retrieve(hash: string): Promise<string> {
    return Promise.resolve("Serialized wallet");
  }
}
