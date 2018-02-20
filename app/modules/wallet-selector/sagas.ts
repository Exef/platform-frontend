import { TAction, actions } from "../actions";
import { effects } from "redux-saga";
import { getDependencies, getDependency, neuTake } from "../sagas";
import { symbols } from "../../di/symbols";
import { Web3Manager } from "../../lib/web3/Web3Manager";
import { GetState } from "../../di/setupBindings";
import { SignatureAuthApi } from "../../lib/api/SignatureAuthApi";
import { CryptoRandomString } from "../../lib/dependencies/cryptoRandomString";
import { ILogger } from "../../lib/dependencies/Logger";
import { selectEthereumAddressWithChecksum } from "../web3/reducer";
import { IAppState } from "../../store";
import { loadUser } from "../auth/sagas";

function* signInUser(): Iterator<any> {
  while (true) {
    const web3ConnectedAction: TAction = yield neuTake("WALLET_SELECTOR_CONNECTED");
    if (web3ConnectedAction.type !== "WALLET_SELECTOR_CONNECTED") {
      continue;
    }

    try {
      const jwt = yield obtainJWT();
      yield effects.spawn(loadUser);

      yield effects.put(actions.routing.goToDashboard());
    } catch (e) {
      yield effects.put(actions.wallet.messageSigningError("Error while signing a message!"));
    }
  }
}

function* obtainJWT(): Iterator<any> {
  yield effects.put(actions.wallet.messageSigning());
  const deps: any = yield getDependencies([
    symbols.web3Manager,
    symbols.getState,
    symbols.signatureAuthApi,
    symbols.cryptoRandomString,
    symbols.logger,
  ]);

  const jwt: string = yield (obtainJwtPromise as any)(...deps);
  yield effects.put(actions.auth.loadJWT(jwt));
  yield effects.call(saveJwtToStorage);

  return jwt;
}

const obtainJwtPromise = async (
  web3Manager: Web3Manager,
  getState: GetState,
  signatureAuthApi: SignatureAuthApi,
  cryptoRandomString: CryptoRandomString,
  logger: ILogger,
) => {
  const address = selectEthereumAddressWithChecksum(getState().web3State);

  const salt = cryptoRandomString(64);

  const signerType = web3Manager.personalWallet!.signerType;

  logger.info("Obtaining auth challenge from api");
  const { body: { challenge } } = await signatureAuthApi.challenge(address, salt, signerType);

  logger.info("Signing challenge");
  const signedChallenge = await web3Manager.personalWallet!.signMessage(challenge);

  logger.info("Sending signed challenge back to api");
  const { body: { jwt } } = await signatureAuthApi.createJwt(
    challenge,
    signedChallenge,
    signerType,
  );
};

// @todo create save jwt abstraction
function* saveJwtToStorage(): Iterator<any> {
  const jwt = yield effects.select<IAppState>(s => s.auth.jwt);
  const storage: Storage = yield getDependency(symbols.storage);
  storage.setKey(JWT_STORAGE_KEY, jwt);
}

const JWT_STORAGE_KEY = "NF_JWT";

export const walletSelectorSagas = function*(): Iterator<effects.Effect> {
  yield effects.all([effects.fork(signInUser)]);
};
