import { AppReducer } from "../../store";

export type TWalletTab = "light" | "browser" | "ledger";

export interface WalletSelectorState {
  isMessageSigning: boolean;
  messageSigningError?: string;
}

const walletSelectorInitialState: WalletSelectorState = {
  isMessageSigning: false,
};

export const walletSelectorReducer: AppReducer<WalletSelectorState> = (
  state = walletSelectorInitialState,
  action,
): WalletSelectorState => {
  switch (action.type) {
    case "WALLET_SELECTOR_MESSAGE_SIGNING":
      return {
        ...state,
        isMessageSigning: true,
        messageSigningError: undefined,
      };
    case "WALLET_SELECTOR_MESSAGE_SIGNING_ERROR": {
      return {
        ...state,
        messageSigningError: action.payload.errorMessage,
      };
    }
    case "WALLET_SELECTOR_MESSAGE_SIGNING_CANCELLED": {
      return {
        ...state,
        isMessageSigning: false,
        messageSigningError: undefined,
      };
    }
  }

  return state;
};
