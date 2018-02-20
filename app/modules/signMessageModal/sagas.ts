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
} from "../../lib/web3/WalletMetadataStorage";
import { WalletType } from "../web3/types";
import { LedgerWalletConnector } from "../../lib/web3/LedgerWallet";
import { BrowserWalletConnector } from "../../lib/web3/BrowserWallet";
import { LightWalletConnector } from "../../lib/web3/LightWallet";

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
  const metadata = walletMetadata.getMetadata();

  if (metadata.walletType === WalletType.LEDGER) {
    console.log("LEDGER WALLET DETECTED!");
    return await connectLedger(ledgerWalletConnector, web3Manager, metadata as any); // @todo metadata should be null not partial
  }
  if (metadata.walletType === WalletType.BROWSER) {
    console.log("BROWSER WALLET DETECTED!");

    return await connectBrowser(browserWalletConnector, web3Manager, metadata as any);
  }
  if (metadata.walletType === WalletType.LIGHT) {
    console.log("LIGHT WALLET DETECTED!");
    return await connectLightWallet(lightWalletConnector, web3Manager, metadata as any);
  }
  throw new Error("Unrecognized wallet!")
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
