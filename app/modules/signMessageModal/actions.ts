import { createAction, createSimpleAction } from "../actionsUtils";

export const signMessageModalActions = {
  show: () => createSimpleAction("SIGN_MESSAGE_MODAL_SHOW"),
  hide: () => createSimpleAction("SIGN_MESSAGE_MODAL_HIDE"),
  signingError: (errorMsg: string) => createAction("SIGN_MESSAGE_MODAL_SHOW_ERROR", { errorMsg }),
};
