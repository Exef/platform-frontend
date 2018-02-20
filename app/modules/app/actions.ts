import { createAction, createSimpleAction } from "../actionsUtils";

export const appActions = {
  init: () => createSimpleAction("APP_INIT"),
};
