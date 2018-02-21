import { createAction } from "../actionsUtils";

import { appRoutes } from "../../components/AppRouter";
import { kycRoutes } from "../../components/kyc/routes";

const createRoutingAction = (path: string) => createAction("GO_TO_ROUTE", { path });

export const routingActions = {
  // navigate back
  goBack: () => createAction("GO_BACK", {}),

  // default routes
  goHome: () => createRoutingAction("/"),

  //kyc routes
  goToKYCHome: () => createRoutingAction(kycRoutes.start),
  goToKYCPersonalStart: () => createRoutingAction(kycRoutes.personalStart),
  goToKYCPersonalInstantId: () => createRoutingAction(kycRoutes.personalInstantId),
  goToKYCManualVerification: () => createRoutingAction(kycRoutes.personalManualVerification),
  goToKYCManualVerificationIDUpload: () => createRoutingAction(kycRoutes.personalIDUpload),
  goToKYCPersonalDone: () => createRoutingAction(kycRoutes.personalDone),

  goToKYCCompanyStart: () => createRoutingAction(kycRoutes.companyStart),
  goToKYCCompanyDone: () => createRoutingAction(kycRoutes.companyDone),

  // dashboard
  goToDashboard: () => createRoutingAction(appRoutes.dashboard)

  // other...
};
