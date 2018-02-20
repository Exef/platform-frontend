import { createAction } from "../actionsUtils";

export const dashboardActions = {
  signDummyMessage: (message: string) => createAction("DASHBOARD_SIGN_DUMMY_MESSAGE", { message }),
}
