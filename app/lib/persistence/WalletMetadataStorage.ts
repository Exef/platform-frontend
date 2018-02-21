import { inject, injectable } from "inversify";
import { symbols } from "../../di/symbols";
import { WalletType } from "../../modules/web3/types";
import { ILogger } from "../dependencies/Logger";
import { Storage } from "./Storage";

const STORAGE_WALLET_METADATA_KEY = "NF_WALLET_METADATA";

type TWalletMetadata = ILightWalletMetadata | IBrowserWalletMetadata | ILedgerWalletMetadata;

export interface ILightWalletMetadata {
  walletType: WalletType.LIGHT;
  vault: string;
  salt: string;
  email: string;
}

export interface IBrowserWalletMetadata {
  walletType: WalletType.BROWSER;
}

export interface ILedgerWalletMetadata {
  walletType: WalletType.LEDGER;
  derivationPath: string;
}

/**
 * Stores metadata about different wallets in injected storage. It can return sensitive data  (light wallet vault, salt).
 */
@injectable()
export class WalletMetadataStorage {
  constructor(
    @inject(symbols.storage) private readonly storage: Storage,
    @inject(symbols.logger) private readonly logger: ILogger,
  ) {}

  saveMetadata(metadata: TWalletMetadata): void {
    this.logger.info(`Storing wallet metadata for ${metadata.walletType} in storage...`);

    this.storage.setKey(STORAGE_WALLET_METADATA_KEY, JSON.stringify(metadata));
  }

  getMetadata(): TWalletMetadata | undefined {
    const rawData = this.storage.getKey(STORAGE_WALLET_METADATA_KEY);
    if (!rawData) {
      this.logger.info(`Wallet metadata missing from storage`);
      return undefined;
    }

    this.logger.info(`Wallet metadata got from storage`);
    const data: TWalletMetadata = JSON.parse(rawData);
    return data;
  }
}
