import { createAction } from "../actionsUtils";
import { IUserData } from "../../lib/api/UsersApi";

export const authActions = {
  loadJWT: (jwt: string) => createAction("AUTH_LOAD_JWT", { jwt }),
  loadUser: (user: IUserData) => createAction("AUTH_LOAD_USER", { user }),
};
