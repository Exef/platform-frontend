import { AppReducer } from "../../store";

export type TWalletTab = "light" | "browser" | "ledger";

export interface IWalletSelectorState {
  isMessageSigning: boolean;
  messageSigningError?: string;
}

const walletSelectorInitialState: IWalletSelectorState = {
  isMessageSigning: false,
};

export const walletSelectorReducer: AppReducer<IWalletSelectorState> = (
  state = walletSelectorInitialState,
  action,
): IWalletSelectorState => {
  switch (action.type) {
    case "WALLET_SELECTOR_MESSAGE_SIGNING":
      return {
        ...state,
        isMessageSigning: true,
        messageSigningError: undefined,
      };
    case "WALLET_SELECTOR_MESSAGE_SIGNING_ERROR":
      return {
        ...state,
        messageSigningError: action.payload.errorMessage,
      };

    case "WALLET_SELECTOR_RESET":
      return {
        ...state,
        isMessageSigning: false,
        messageSigningError: undefined,
      };
  }

  return state;
};
