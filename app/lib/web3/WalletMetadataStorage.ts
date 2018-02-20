import { injectable, inject } from "inversify";
import { symbols } from "../../di/symbols";
import { ILogger } from "../dependencies/Logger";
import { Storage } from "../dependencies/storage";
import { WalletType } from "../../modules/web3/types";

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
 * Stores metadata about wallet (vault, salt) in injected storage.
 */
@injectable()
export class WalletMetadataStorage {
  constructor(
    @inject(symbols.storage) private readonly storage: Storage,
    @inject(symbols.logger) private readonly logger: ILogger,
  ) {}

  saveMetadata(metadata: TWalletMetadata) {
    this.logger.info(`Storing wallet metadata for ${metadata.walletType} in storage...`);

    this.storage.setKey(STORAGE_WALLET_METADATA_KEY, JSON.stringify(metadata));
  }

  getMetadata(): Partial<TWalletMetadata> {
    const rawData = this.storage.getKey(STORAGE_WALLET_METADATA_KEY);
    if (!rawData) {
      this.logger.info(`Wallet metadata missing from storage`);
      return {};
    }

    this.logger.info(`Wallet metadata got from storage`);
    const data: TWalletMetadata = JSON.parse(rawData);
    return data;
  }
}
