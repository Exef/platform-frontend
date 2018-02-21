import { IUserData } from "../../lib/api/UsersApi";
import { createAction } from "../actionsUtils";

export const authActions = {
  loadJWT: (jwt: string) => createAction("AUTH_LOAD_JWT", { jwt }),
  loadUser: (user: IUserData) => createAction("AUTH_LOAD_USER", { user }),
};
