import { inject, injectable } from "inversify";

import { symbols } from "../../di/symbols";
import { IHttpClient } from "./client/IHttpClient";
import { delay } from "bluebird";
import { ILogger } from "../dependencies/Logger";

//This is a mock implementation

@injectable()
export class VaultApi {
  // tslint:disable-next-line
  constructor(
    @inject(symbols.jsonHttpClient) private httpClient: IHttpClient,
    @inject(symbols.logger) private logger: ILogger,
  ) {}

  public async store(key: string, serializedVault: string): Promise<void> {
    this.logger.info(`Storing vault at ${key}`);
    return delay(500);
  }

  public async retrieve(hash: string): Promise<string> {
    return Promise.resolve("Serialized wallet");
  }
}
