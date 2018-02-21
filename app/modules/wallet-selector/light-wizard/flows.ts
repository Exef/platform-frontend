import { symbols } from "../../../di/symbols";
import { VaultApi } from "../../../lib/api/VaultApi";
import { ILogger } from "../../../lib/dependencies/Logger";
import { WalletMetadataStorage } from "../../../lib/persistence/WalletMetadataStorage";
import {
  LightCreationError,
  LightDesirializeError,
  LightSignMessageError,
  LightWalletConnector,
  LightWalletUtil,
  LightWrongPasswordSaltError,
} from "../../../lib/web3/LightWallet";
import { Web3Manager } from "../../../lib/web3/Web3Manager";
import { injectableFn } from "../../../middlewares/redux-injectify";
import { AppDispatch } from "../../../store";
import { actions } from "../../actions";
import { WalletType } from "../../web3/types";

export const lightWizardFlows = {
  tryConnectingWithLightWallet: (email: string, password: string) =>
    injectableFn(
      async (
        dispatch: AppDispatch,
        web3Manager: Web3Manager,
        lightWalletConnector: LightWalletConnector,
        lightWalletUtil: LightWalletUtil,
        walletMetadataStorage: WalletMetadataStorage,
        vaultApi: VaultApi,
        logger: ILogger,
      ) => {
        try {
          const lightWalletVault = await lightWalletUtil.createLightWalletVault({
            password,
            hdPathString: "m/44'/60'/0'",
          });

          const walletInstance = await lightWalletUtil.deserializeLightWalletVault(
            lightWalletVault.walletInstance,
            lightWalletVault.salt,
          );

          walletMetadataStorage.saveMetadata({
            walletType: WalletType.LIGHT,
            vault: lightWalletVault.walletInstance,
            salt: lightWalletVault.salt,
            email: email,
          });

          // @todo: proper key calc!
          const vaultKey = password + lightWalletVault.salt;
          await vaultApi.store(vaultKey, lightWalletVault.walletInstance);
          const lightWallet = await lightWalletConnector.connect({
            walletInstance,
            salt: lightWalletVault.salt,
          }, password);
          await web3Manager.plugPersonalWallet(lightWallet);
          dispatch(actions.wallet.connected());
        } catch (e) {
          logger.warn("Error while trying to connect with light wallet: ", e.message);
          dispatch(actions.wallet.lightWalletConnectionError(mapLightWalletErrorToErrorMessage(e)));
        }
      },
      [
        symbols.appDispatch,
        symbols.web3Manager,
        symbols.lightWalletConnector,
        symbols.lightWalletUtil,
        symbols.walletMetadataStorage,
        symbols.vaultApi,
        symbols.logger,
      ],
    ),
};

function mapLightWalletErrorToErrorMessage(e: Error): string {
  if (e instanceof LightWrongPasswordSaltError) {
    return "Password is not correct";
  }
  if (e instanceof LightSignMessageError) {
    return `Cannot sign personal message`;
  }
  if (e instanceof LightCreationError) {
    return "Cannot create new Lightwallet";
  }
  if (e instanceof LightDesirializeError) {
    return "Problem with Vault retrieval";
  }
  return "Light wallet unavailable";
}
