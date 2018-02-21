import { Container } from "inversify";
import { push } from "react-router-redux";
import { MiddlewareAPI } from "redux";
import { IConfig } from "../config/getConfig";
import { IHttpClient } from "../lib/api/client/IHttpClient";
import { JsonHttpClient } from "../lib/api/client/JsonHttpClient";
import { SignatureAuthApi } from "../lib/api/SignatureAuthApi";
import { UsersApi } from "../lib/api/UsersApi";
import { VaultApi } from "../lib/api/VaultApi";
import { cryptoRandomString, CryptoRandomString } from "../lib/dependencies/cryptoRandomString";
import { DevConsoleLogger, ILogger } from "../lib/dependencies/Logger";
import { NotificationCenter } from "../lib/dependencies/NotificationCenter";
import { Storage } from "../lib/persistence/Storage";
import { BrowserWalletConnector } from "../lib/web3/BrowserWallet";
import { LedgerWalletConnector } from "../lib/web3/LedgerWallet";
import { LightWalletConnector, LightWalletUtil } from "../lib/web3/LightWallet";
import { IEthereumNetworkConfig, Web3Manager } from "../lib/web3/Web3Manager";
import { IAppState } from "../store";
import {
  AsyncIntervalSchedulerFactory,
  AsyncIntervalSchedulerFactoryType,
} from "../utils/AsyncIntervalScheduler";

import { ApiKycService } from "../lib/api/kyc/index";
import { detectBrowser, TDetectBrowser } from "../lib/dependencies/detectBrowser";
import { WalletMetadataStorage } from "../lib/persistence/WalletMetadataStorage";
import { symbols } from "./symbols";

export type NavigateTo = (path: string) => void;
export type GetState = () => IAppState;

export function setupBindings(config: IConfig): Container {
  const container = new Container();
  const storage = new Storage(window.localStorage);
  const lightWalletUtil = new LightWalletUtil();

  // functions
  container
    .bind<CryptoRandomString>(symbols.cryptoRandomString)
    .toConstantValue(cryptoRandomString);
  container.bind<TDetectBrowser>(symbols.detectBrowser).toConstantValue(detectBrowser);

  container
    .bind<IEthereumNetworkConfig>(symbols.ethereumNetworkConfig)
    .toConstantValue(config.ethereumNetwork);

  // @todo different logger could be injected to each class with additional info like name of the file etc.
  container.bind<ILogger>(symbols.logger).toConstantValue(new DevConsoleLogger());

  // classes
  container.bind<IHttpClient>(symbols.jsonHttpClient).to(JsonHttpClient);
  // singletons
  container
    .bind<SignatureAuthApi>(symbols.signatureAuthApi)
    .to(SignatureAuthApi)
    .inSingletonScope();
  container
    .bind<WalletMetadataStorage>(symbols.walletMetadataStorage)
    .to(WalletMetadataStorage)
    .inSingletonScope();

  container.bind<LightWalletUtil>(symbols.lightWalletUtil).toConstantValue(lightWalletUtil);

  container
    .bind<VaultApi>(symbols.vaultApi)
    .to(VaultApi)
    .inSingletonScope();

  container
    .bind<UsersApi>(symbols.usersApi)
    .to(UsersApi)
    .inSingletonScope();

  container.bind<Storage>(symbols.storage).toConstantValue(storage);
  container
    .bind<NotificationCenter>(symbols.notificationCenter)
    .to(NotificationCenter)
    .inSingletonScope();

  container
    .bind<LedgerWalletConnector>(symbols.ledgerWalletConnector)
    .to(LedgerWalletConnector)
    .inSingletonScope();

  container
    .bind<LightWalletConnector>(symbols.lightWalletConnector)
    .to(LightWalletConnector)
    .inSingletonScope();

  container
    .bind<BrowserWalletConnector>(symbols.browserWalletConnector)
    .to(BrowserWalletConnector)
    .inSingletonScope();
  container
    .bind<Web3Manager>(symbols.web3Manager)
    .to(Web3Manager)
    .inSingletonScope();
  container
    .bind<ApiKycService>(symbols.apiKycService)
    .to(ApiKycService)
    .inSingletonScope();

  // factories
  container
    .bind<AsyncIntervalSchedulerFactoryType>(symbols.asyncIntervalSchedulerFactory)
    .toFactory(AsyncIntervalSchedulerFactory);

  return container;
}

export function customizerContainerWithMiddlewareApi(
  container: Container,
  { dispatch, getState }: MiddlewareAPI<any>,
): Container {
  container.bind(symbols.appDispatch).toConstantValue(dispatch);
  container.bind(symbols.getState).toConstantValue(() => getState());
  container.bind(symbols.navigateTo).toConstantValue((path: string) => dispatch(push(path)));

  return container;
}
