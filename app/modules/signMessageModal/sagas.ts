import { delay } from "bluebird";
import { effects } from "redux-saga";
import { symbols } from "../../di/symbols";
import {
  IBrowserWalletMetadata,
  ILedgerWalletMetadata,
  ILightWalletMetadata,
  WalletMetadataStorage,
} from "../../lib/persistence/WalletMetadataStorage";
import { BrowserWalletConnector } from "../../lib/web3/BrowserWallet";
import { LedgerWalletConnector } from "../../lib/web3/LedgerWallet";
import { LightWalletConnector, LightWalletUtil } from "../../lib/web3/LightWallet";
import { SignerError, Web3Manager } from "../../lib/web3/Web3Manager";
import { invariant } from "../../utils/invariant";
import { actions } from "../actions";
import { getDependencies } from "../sagas";
import { WalletType } from "../web3/types";

export function* messageSign(message: string): Iterator<any> {
  yield effects.put(actions.signMessageModal.show());

  const deps: any = yield getDependencies([
    symbols.walletMetadataStorage,
    symbols.web3Manager,
    symbols.ledgerWalletConnector,
    symbols.browserWalletConnector,
    symbols.lightWalletConnector,
  ]);
  const web3Manager: Web3Manager = deps[1];

  while (true) {
    try {
      yield (ensureWalletConnection as any)(...deps);

      const signedMessage = yield web3Manager.sign(message);
      yield effects.put(actions.signMessageModal.hide());
      return signedMessage;
    } catch (e) {
      yield effects.put(actions.signMessageModal.signingError(e.message)); // todo: better error management

      if (!(e instanceof SignerError)) {
        yield delay(500);
      }
      return;
    }
  }
}

export async function ensureWalletConnection(
  walletMetadata: WalletMetadataStorage,
  web3Manager: Web3Manager,
  ledgerWalletConnector: LedgerWalletConnector,
  browserWalletConnector: BrowserWalletConnector,
  lightWalletConnector: LightWalletConnector,
): Promise<void> {
  if (web3Manager.personalWallet) {
    return;
  }
  const metadata = walletMetadata.getMetadata()!;

  invariant(metadata, "User has JWT but doesn't have wallet metadata!");

  switch (metadata.walletType) {
    case WalletType.LEDGER:
      return await connectLedger(ledgerWalletConnector, web3Manager, metadata);
    case WalletType.BROWSER:
      return await connectBrowser(browserWalletConnector, web3Manager, metadata);
    case WalletType.LIGHT:
      return await connectLightWallet(lightWalletConnector, web3Manager, metadata);
    default:
      invariant(false, "Wallet type unrecognized");
  }
}

async function connectLedger(
  ledgerWalletConnector: LedgerWalletConnector,
  web3Manager: Web3Manager,
  metadata: ILedgerWalletMetadata,
): Promise<void> {
  await ledgerWalletConnector.connect(web3Manager.networkId!);
  const wallet = await ledgerWalletConnector.finishConnecting(metadata.derivationPath);
  await web3Manager.plugPersonalWallet(wallet);
}

async function connectBrowser(
  browserWalletConnector: BrowserWalletConnector,
  web3Manager: Web3Manager,
  metadata: IBrowserWalletMetadata,
): Promise<void> {
  const wallet = await browserWalletConnector.connect(web3Manager.networkId!);
  await web3Manager.plugPersonalWallet(wallet);
}

async function connectLightWallet(
  lightWalletConnector: LightWalletConnector,
  web3Manager: Web3Manager,
  metadata: ILightWalletMetadata,
): Promise<void> {
  const lightWalletUtils = new LightWalletUtil();
  const walletInstance = await lightWalletUtils.deserializeLightWalletVault(
    metadata.vault,
    metadata.salt,
  );

  const wallet = await lightWalletConnector.connect(
    {
      walletInstance,
      salt: metadata.salt,
    },
  );
  await web3Manager.plugPersonalWallet(wallet);
}
