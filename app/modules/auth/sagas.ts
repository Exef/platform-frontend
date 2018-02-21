import { effects } from "redux-saga";
import { symbols } from "../../di/symbols";
import { IUserData, UsersApi } from "../../lib/api/UsersApi";
import { Storage } from "../../lib/persistence/Storage";
import { WalletMetadataStorage } from "../../lib/persistence/WalletMetadataStorage";
import { actions } from "../actions";
import { getDependency, neuTake } from "../sagas";
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

export const authSagas = function*(): Iterator<effects.Effect> {
  yield effects.all([effects.fork(startup)]);
};
