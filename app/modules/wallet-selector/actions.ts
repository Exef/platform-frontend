import { browserWizzardActions } from "./browser-wizard/actions";
import { ledgerWizzardActions } from "./ledger-wizard/actions";
import { lightWizzardActions } from "./light-wizard/actions";
import { createAction, createSimpleAction } from "../actionsUtils";

import { TWalletTab } from "./reducer";

const actions = {
  connected: () => createSimpleAction("WALLET_SELECTOR_CONNECTED"),
  messageSigning: () => createSimpleAction("WALLET_SELECTOR_MESSAGE_SIGNING"),
  messageSigningCancelled: () => createSimpleAction("WALLET_SELECTOR_MESSAGE_SIGNING_CANCELLED"),
  messageSigningError: (errorMessage: string) =>
    createAction("WALLET_SELECTOR_MESSAGE_SIGNING_ERROR", { errorMessage }),
};

export const walletActions = {
  ...browserWizzardActions,
  ...ledgerWizzardActions,
  ...lightWizzardActions,
  ...actions,
};
