import { NavigateTo } from "../../di/setupBindings";
import { symbols } from "../../di/symbols";
import { injectableFn } from "../../middlewares/redux-injectify";
import { AppDispatch } from "../../store";
import { browserWizardFlows } from "./browser-wizard/flows";
import { ledgerWizardFlows } from "./ledger-wizard/flows";
import { lightWizardFlows } from "./light-wizard/flows";

export const walletFlows = {
  ...browserWizardFlows,
  ...ledgerWizardFlows,
  ...lightWizardFlows,
};
