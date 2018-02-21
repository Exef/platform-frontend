import { browserWizardFlows } from "./browser-wizard/flows";
import { ledgerWizardFlows } from "./ledger-wizard/flows";
import { lightWizardFlows } from "./light-wizard/flows";

export const walletFlows = {
  ...browserWizardFlows,
  ...ledgerWizardFlows,
  ...lightWizardFlows,
};
