import { values } from "lodash";

import { appActions } from "./app/actions";
import { authActions } from "./auth/actions";
import { dashboardActions } from "./dashboard/actions";
import { kycActions } from "./kyc/actions";
import { routingActions } from "./routing/actions";
import { signMessageModalActions } from "./signMessageModal/actions";
import { userAgentActions } from "./userAgent/actions";
import { walletActions } from "./wallet-selector/actions";
import { web3Actions } from "./web3/actions";

/** You should add new actions also here (with a namespace).*/
export const actions = {
  dashboard: dashboardActions,
  signMessageModal: signMessageModalActions,
  app: appActions,
  kyc: kycActions,
  routing: routingActions,
  wallet: walletActions,
  web3: web3Actions,
  userAgent: userAgentActions,
  auth: authActions,
};

/**
 * Merge all actions into main action object. Add new set of actions here.
 */
const allActions = {
  ...dashboardActions,
  ...signMessageModalActions,
  ...appActions,
  ...routingActions,
  ...kycActions,
  ...walletActions,
  ...web3Actions,
  ...userAgentActions,
  ...authActions,
};

/**
 * Build action union type
 */
export const returnTypeOf = <RT extends {}>(_expression: (...params: any[]) => RT): RT => {
  return ({} as any) as RT;
};

const actionList = values(allActions).map(returnTypeOf);
export type TAction = typeof actionList[number];
