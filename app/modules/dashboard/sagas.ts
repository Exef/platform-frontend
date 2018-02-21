import { effects } from "redux-saga";
import { TAction } from "../actions";
import { neuTake } from "../sagas";
import { messageSign } from "../signMessageModal/sagas";

function* signDummyMessage(): Iterator<any> {
  while (true) {
    const signMessageAction: TAction = yield neuTake("DASHBOARD_SIGN_DUMMY_MESSAGE");
    if (signMessageAction.type !== "DASHBOARD_SIGN_DUMMY_MESSAGE") {
      continue;
    }
    const message = signMessageAction.payload.message;

    const signed = yield messageSign(message);

    // this is just for demo purposes
    // tslint:disable-next-line
    console.log("signed: ", signed);
  }
}

export const dashboardSagas = function*(): Iterator<effects.Effect> {
  yield effects.all([effects.fork(signDummyMessage)]);
};
