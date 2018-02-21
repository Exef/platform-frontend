import { inject, injectable } from "inversify";

import { delay } from "bluebird";
import { symbols } from "../../di/symbols";
import { ILogger } from "../dependencies/Logger";
import { IHttpClient } from "./client/IHttpClient";

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
    // tslint:disable-next-line
    @inject(symbols.jsonHttpClient) private httpClient: IHttpClient,
    @inject(symbols.logger) private logger: ILogger,
  ) {}

  // tslint:disable-next-line
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
