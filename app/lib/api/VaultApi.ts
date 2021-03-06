import { inject, injectable } from "inversify";

import { symbols } from "../../di/symbols";
import { IHttpClient } from "./client/IHttpClient";

//This is a mock implementation

@injectable()
export class VaultApi {
  // tslint:disable-next-line
  constructor(@inject(symbols.jsonHttpClient) private httpClient: IHttpClient) {}
  // tslint:disable-next-line
  public async store(password: string, salt: string, serializedVault: string): Promise<void> {
    return Promise.resolve();
  }
  // tslint:disable-next-line
  public async retrieve(hash: string): Promise<string> {
    return Promise.resolve("Serialized wallet");
  }
}
