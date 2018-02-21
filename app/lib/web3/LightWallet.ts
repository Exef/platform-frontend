import { promisify } from "bluebird";
import * as LightWalletProvider from "eth-lightwallet";
import * as ethUtils from "ethereumjs-util";
import { inject, injectable } from "inversify";
import * as Web3 from "web3";
import * as Web3ProviderEngine from "web3-provider-engine";
// tslint:disable-next-line
import * as HookedWalletSubprovider from "web3-provider-engine/subproviders/hooked-wallet";
// tslint:disable-next-line
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";
import { IPersonalWallet, SignerType } from "./PersonalWeb3";
import { IEthereumNetworkConfig } from "./Web3Manager";

import { symbols } from "../../di/symbols";
import { WalletSubType, WalletType } from "../../modules/web3/types";
import { EthereumAddress } from "../../types";
import { Web3Adapter } from "./Web3Adapter";

const LIGHT_WALLET_PASSWORD_CACHE_TIME = 1000 * 60 * 5;

export interface ICreateVault {
  password: string;
  hdPathString: string;
  recoverSeed?: string | undefined;
  customSalt?: string | undefined;
}

export interface IVault {
  walletInstance: any;
  salt: string;
}

export interface ILightWallet {
  addresses: Array<string>;
  encHdRootPriv: object;
  encPrivKeys: object;
  encSeed: object;
  hdIndex: number;
  hdPathString: string;
  salt: string;
  version: number;
  getSeed: (walletKey: object) => string;
  signTransaction: (txParams: object) => void;
  getAddresses: () => Array<string>;
}

export class LightError extends Error {}
export class LightWalletUtilError extends LightError {}
export class LightWalletConnectorError extends LightError {}
export class LightWalletError extends LightError {}
export class LightWrongPasswordSaltError extends LightWalletUtilError {}
export class LightSignMessageError extends LightWalletError {}
export class LightUnknownError extends LightError {}
export class LightCreationError extends LightWalletUtilError {}
export class LightDesirializeError extends LightWalletUtilError {}
export class LightWalletMissingPassword extends LightWalletError {}

@injectable()
export class LightWalletUtil {
  public async deserializeLightWalletVault(
    serializedWallet: string,
    salt: string,
  ): Promise<ILightWallet> {
    try {
      return await LightWalletProvider.keystore.deserialize(serializedWallet, salt);
    } catch (e) {
      throw new LightDesirializeError();
    }
  }

  public async createLightWalletVault({
    password,
    hdPathString,
    recoverSeed,
    customSalt,
  }: ICreateVault): Promise<IVault> {
    try {
      const create = promisify<any, object>(LightWalletProvider.keystore.createVault);
      //256bit strength generates a 24 word mnemonic
      const entropyStrength = 256;
      const seed = recoverSeed
        ? recoverSeed
        : LightWalletProvider.keystore.generateRandomSeed(undefined, entropyStrength);
      //salt strength should be 32 bit. see https://github.com/ConsenSys/eth-lightwallet/blob/master/lib/keystore.js#L107
      const salt = customSalt ? customSalt : LightWalletProvider.keystore.generateSalt(32);
      const lightWalletInstance = await create({
        password,
        seedPhrase: seed,
        hdPathString,
        salt,
      });
      const unlockedWallet = await LightWalletUtil.getWalletKey(lightWalletInstance, password);
      lightWalletInstance.generateNewAddress(unlockedWallet, 1);
      return { walletInstance: await lightWalletInstance.serialize(), salt };
    } catch (e) {
      throw new LightCreationError();
    }
  }

  static async getWalletKey(lightWalletInstance: any, password: string): Promise<object> {
    try {
      const keyFromPassword = promisify<ILightWallet, string>(
        lightWalletInstance.keyFromPassword.bind(lightWalletInstance),
      );
      return await keyFromPassword(password);
    } catch (e) {
      throw new LightWrongPasswordSaltError();
    }
  }
}

export class LightWallet implements IPersonalWallet {
  constructor(
    public readonly web3Adapter: Web3Adapter,
    public readonly ethereumAddress: EthereumAddress,
    private vault: IVault,
    password?: string,
  ) {
    this.password = password;
  }
  public readonly walletType = WalletType.LIGHT;
  public readonly walletSubType = WalletSubType.UNKNOWN;
  public readonly signerType = SignerType.ETH_SIGN;

  // autoclear password after some time
  private _password?: string;
  set password(newPassword: string | undefined) {
    this._password = newPassword;

    setTimeout(() => {
      this._password = undefined;
    }, LIGHT_WALLET_PASSWORD_CACHE_TIME);
  }

  public async testConnection(networkId: string): Promise<boolean> {
    const currentNetworkId = await this.web3Adapter.getNetworkId();
    if (currentNetworkId !== networkId) {
      return false;
    }
    return !!await this.web3Adapter.getAccountAddress();
  }

  public async signMessage(data: string): Promise<string> {
    const password = this._password;

    if (!password) {
      throw new LightWalletMissingPassword();
    }

    try {
      const rawSignedMsg = await LightWalletProvider.signing.signMsg(
        this.vault.walletInstance,
        await LightWalletUtil.getWalletKey(this.vault.walletInstance, this.password!),
        data,
        this.ethereumAddress,
      );
      // from signature parameters to eth_sign RPC
      // @see https://github.com/ethereumjs/ethereumjs-util/blob/master/docs/index.md#torpcsig
      return ethUtils.toRpcSig(rawSignedMsg.v, rawSignedMsg.r, rawSignedMsg.s);
    } catch (e) {
      throw new LightSignMessageError();
    }
  }
}

@injectable()
export class LightWalletConnector {
  private web3Adapter?: Web3Adapter;
  public constructor(
    @inject(symbols.ethereumNetworkConfig) public readonly web3Config: IEthereumNetworkConfig,
  ) {}

  public readonly walletSubType: WalletSubType = WalletSubType.UNKNOWN;

  public async connect(lightWalletVault: IVault, password?: string): Promise<IPersonalWallet> {
    try {
      this.web3Adapter = new Web3Adapter(await this.setWeb3Provider(lightWalletVault));
      return new LightWallet(
        this.web3Adapter,
        await this.web3Adapter.getAccountAddress(),
        lightWalletVault,
        password,
      );
    } catch (e) {
      if (e instanceof LightError) {
        throw e;
      } else {
        throw new LightUnknownError();
      }
    }
  }

  private async setWeb3Provider(lightWalletVault: IVault): Promise<any> {
    let engine: any;
    try {
      // hooked-wallet-subprovider required methods were manually implemented
      const web3Provider = new HookedWalletSubprovider({
        signTransaction: lightWalletVault.walletInstance.signTransaction.bind(
          lightWalletVault.walletInstance,
        ),
        getAccounts: (cb: any) => {
          const data = lightWalletVault.walletInstance.getAddresses.bind(
            lightWalletVault.walletInstance,
          )();
          cb(undefined, data);
        },
      });
      engine = new Web3ProviderEngine();
      engine.addProvider(web3Provider);
      engine.addProvider(
        new RpcSubprovider({
          rpcUrl: this.web3Config.rpcUrl,
        }),
      );
      engine.start();
      return new Web3(engine);
    } catch (e) {
      if (engine) {
        engine.stop();
      }
      throw e;
    }
  }
}
