import { neuTake } from "../sagas";
import { TAction } from "../actions";
import { Web3Manager } from "../../lib/web3/Web3Manager";
import { effects } from "redux-saga";
import { messageSign } from "../signMessageModal/sagas";

function* signDummyMessage(): Iterator<any> {
  while (true) {
    const signMessageAction: TAction = yield neuTake("DASHBOARD_SIGN_DUMMY_MESSAGE");
    if (signMessageAction.type !== "DASHBOARD_SIGN_DUMMY_MESSAGE") {
      continue;
    }
    const message = signMessageAction.payload.message;

    const signed = yield messageSign(message);

    console.log("signed: ", signed);
  }
}

export const dashboardSagas = function*(): Iterator<effects.Effect> {
  yield effects.all([effects.fork(signDummyMessage)]);
};
