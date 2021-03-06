import { symbols } from "../../di/symbols";
import { NotificationCenter } from "../../lib/dependencies/NotificationCenter";
import { injectableFn } from "../../middlewares/redux-injectify";
import { AppDispatch } from "../../store";
import { actions } from "../actions";

export const web3Flows = {
  personalWalletDisconnected: injectableFn(
    (dispatch: AppDispatch, notificationCenter: NotificationCenter) => {
      dispatch(actions.web3.personalWalletDisconnected());
      notificationCenter.error("Web3 disconnected!");
    },
    [symbols.appDispatch, symbols.notificationCenter],
  ),
};
