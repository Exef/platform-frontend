import { inject, injectable } from "inversify";

import { symbols } from "../../di/symbols";
import { IHttpClient } from "./client/IHttpClient";
import { ILogger } from "../dependencies/Logger";
import { delay } from "bluebird";

//This is a mock implementation

export interface IStoreEndpointResponse {
  vault: string;
}

export interface IUserData {
  email?: string;
}

@injectable()
export class UsersApi {
  constructor(
    @inject(symbols.jsonHttpClient) private httpClient: IHttpClient,
    @inject(symbols.logger) private logger: ILogger,
  ) {}

  public async createAccount(email?: string, salt?: string): Promise<IUserData> {
    this.logger.info("Creating account for email: ", email!);

    return {
      email
    }
  }

  public async me(): Promise<IUserData | undefined> {
    await delay(500);
    return {
      email: "krzkaczor@test.com",
    };
  }
}
