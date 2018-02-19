import { appRoutes } from "../AppRouter";

const parentRoutePath = appRoutes.register;

export const walletRoutes = {
  light: parentRoutePath + "/light",
  browser: parentRoutePath + "/browser",
  ledger: parentRoutePath + "/ledger",
};
