import { GetState } from "../../di/setupBindings";
import { symbols } from "../../di/symbols";
import { SignatureAuthApi } from "../../lib/api/SignatureAuthApi";
import { CryptoRandomString } from "../../lib/dependencies/cryptoRandomString";
import { ILogger } from "../../lib/dependencies/Logger";
import { Web3Manager } from "../../lib/web3/Web3Manager";
import { injectableFn } from "../../middlewares/redux-injectify";
import { selectEthereumAddressWithChecksum } from "../web3/reducer";
import { neuTake, getDependency, getDependencies } from "../sagas";
import { TAction, actions } from "../actions";
import { Task, effects } from "redux-saga";
import { UsersApi, IUserData } from "../../lib/api/UsersApi";
import { WalletMetadataStorage } from "../../lib/web3/WalletMetadataStorage";
import { IAppState } from "../../store";
import { Storage } from "../../lib/dependencies/storage";
import { WalletType } from "../web3/types";

const JWT_LOCAL_STORAGE_KEY = "NF_JWT";

function* startup(): Iterator<any> {
  yield neuTake("APP_INIT");
  const jwt = yield effects.spawn(loadJwtFromStorage);
  if (jwt) {
    yield effects.spawn(loadUser);
  }
}

const JWT_STORAGE_KEY = "NF_JWT";
function* loadJwtFromStorage(): Iterator<any> {
  const storage: Storage = yield getDependency(symbols.storage);
  const jwt = storage.getKey(JWT_STORAGE_KEY);
  if (jwt) {
    yield effects.put(actions.auth.loadJWT(jwt));
    return jwt;
  }
}

export function* loadUser(): Iterator<any> {
  const usersApi: UsersApi = yield getDependency(symbols.usersApi);
  const walletMetadataStorage: WalletMetadataStorage = yield getDependency(
    symbols.walletMetadataStorage,
  );
  let me: IUserData | undefined = yield usersApi.me();

  if (!me) {
    const walletMetadata = walletMetadataStorage.getMetadata();
    if (walletMetadata && walletMetadata.walletType === WalletType.LIGHT) {
      me = yield usersApi.createAccount(walletMetadata.email, walletMetadata.salt);
    } else {
      me = yield usersApi.createAccount();
    }
  }
  yield effects.put(actions.auth.loadUser(me!));
}

// startupUser
// get JWT
// userservice.me

// function* signinUser(): Iterator<any> {
//   const jwt: string | undefined = yield getJwt();

//   if (!jwt) {
//     return;
//   }

// const usersApi: UsersApi = yield getDependency(symbols.usersApi);
// const me: IUser | undefined = yield usersApi.me();

// if (me) {
//   yield effects.put(actions.auth.loadUser(me));
// }
// }

// function* getJwt(): Iterator<any> {
//   // this could be abstracted to separate dependency managing jwt token
//   const storage: Storage = yield getDependency(symbols.storage);

//   const jwt = storage.getItem(JWT_LOCAL_STORAGE_KEY);

//   if (!jwt) {
//     return;
//   }

//   yield effects.put(actions.auth.loadJWT(jwt));

//   return jwt;
// }
// take(INIT);
// const jwt = JWT_LOADER();  // this gets JWT from localstorage, checks if its valid and stores it in store as well
// if (!jwt) {
// yield take(WEB3_WALLET_SETUP);
// }
// let user = UserService.me();
// if (!user) {
// if (wallet === lightWallet) {
//   user = yield UserService.createUser(lightwallet.email, lightwallet.salt)
// } else {
//   user = yield UserService.createUser();
// }
// }
// put(SET_USER)

// let currentTask: Task | undefined = undefined

// function* signinUser(): Iterator<any> {
//   yield take("ROUTE ACTION /LOGIN OR /REGISTER");
//   yield call
// }

// function* watchSigninUser(): Iterator<any> {
//   while (true){
//     yield take("ROUTE ACTION /LOGIN OR /REGISTER");
//     if ( currentTask ) yield cancel(currentTask)
//     currentTask = yield fork(signinUser)
//   }
// }

// export const sagas = {
//   obtainJwt: injectableFn(
//     async (
//       web3Manager: Web3Manager,
//       getState: GetState,
//       signatureAuthApi: SignatureAuthApi,
//       cryptoRandomString: CryptoRandomString,
//       logger: ILogger,
//     ) => {
//       const address = selectEthereumAddressWithChecksum(getState().web3State);

//       const salt = cryptoRandomString(64);

//       const signerType = web3Manager.personalWallet!.signerType;

//       logger.info("Obtaining auth challenge from api");
//       const { body: { challenge } } = await signatureAuthApi.challenge(address, salt, signerType);

//       logger.info("Signing challenge");
//       const signedChallenge = await web3Manager.personalWallet!.signMessage(challenge);

//       logger.info("Sending signed challenge back to api");
//       const { body: { jwt } } = await signatureAuthApi.createJwt(
//         challenge,
//         signedChallenge,
//         signerType,
//       );
//       logger.info("JWT obtained!", jwt); // get rid of printing jwt in near future
//     },
// [
//   symbols.web3Manager,
//   symbols.getState,
//   symbols.signatureAuthApi,
//   symbols.cryptoRandomString,
//   symbols.logger,
// ],
//   )
// }

export const authSagas = function*(): Iterator<effects.Effect> {
  yield effects.all([effects.fork(startup)]);
};
