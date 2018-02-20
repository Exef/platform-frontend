import { IUserData } from "../../lib/api/UsersApi";
import { AppReducer } from "../../store";

export interface IAuthState {
  user?: IUserData;
  jwt?: string;
}

const authInitialState: IAuthState = {};

export const authReducer: AppReducer<IAuthState> = (
  state = authInitialState,
  action,
): IAuthState => {
  switch (action.type) {
    case "AUTH_LOAD_USER":
      return {
        ...state,
        user: action.payload.user,
      };
    case "AUTH_LOAD_JWT":
      return {
        ...state,
        jwt: action.payload.jwt,
      };
  }

  return state;
};
