import { Web3Manager, SignerError } from "../../lib/web3/Web3Manager";
import { getDependency, getDependencies } from "../sagas";
import { symbols } from "../../di/symbols";
import { actions } from "../actions";
import { effects } from "redux-saga";
import { delay } from "bluebird";
import {
  WalletMetadataStorage,
  ILedgerWalletMetadata,
  IBrowserWalletMetadata,
  ILightWalletMetadata,
} from "../../lib/persistence/WalletMetadataStorage";
import { WalletType } from "../web3/types";
import { LedgerWalletConnector } from "../../lib/web3/LedgerWallet";
import { BrowserWalletConnector } from "../../lib/web3/BrowserWallet";
import { LightWalletConnector } from "../../lib/web3/LightWallet";
import { invariant } from "../../utils/invariant";

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
      console.log("Wallet ensured!");
      const signedMessage = yield web3Manager.sign(message);
      yield effects.put(actions.signMessageModal.hide());
      return signedMessage;
    } catch (e) {
      yield effects.put(actions.signMessageModal.signingError("error: " + e.message));

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
) {
  if (web3Manager.personalWallet) {
    return;
  }
  const metadata = walletMetadata.getMetadata()!;

  invariant(metadata, "User has JWT but doesn't have wallet metadata!");

  switch (metadata.walletType) {
    case WalletType.LEDGER:
      return await connectLedger(ledgerWalletConnector, web3Manager, metadata as any);
    case WalletType.BROWSER:
      return await connectBrowser(browserWalletConnector, web3Manager, metadata as any);
    case WalletType.LIGHT:
      return await connectLightWallet(lightWalletConnector, web3Manager, metadata as any);
    default:
      invariant(false, "Wallet type unrecognized");
  }
}

async function connectLedger(
  ledgerWalletConnector: LedgerWalletConnector,
  web3Manager: Web3Manager,
  metadata: ILedgerWalletMetadata,
) {
  await ledgerWalletConnector.connect(web3Manager.networkId!);
  const wallet = await ledgerWalletConnector.finishConnecting(metadata.derivationPath);
  await web3Manager.plugPersonalWallet(wallet);
}

async function connectBrowser(
  browserWalletConnector: BrowserWalletConnector,
  web3Manager: Web3Manager,
  metadata: IBrowserWalletMetadata,
) {
  const wallet = await browserWalletConnector.connect(web3Manager.networkId!);
  await web3Manager.plugPersonalWallet(wallet);
}

async function connectLightWallet(
  lightWalletConnector: LightWalletConnector,
  web3Manager: Web3Manager,
  metadata: ILightWalletMetadata,
) {
  const wallet = await lightWalletConnector.connect({
    walletInstance: metadata.vault,
    salt: metadata.salt,
  });
  await web3Manager.plugPersonalWallet(wallet);
}
