import { effects } from "redux-saga";

import { NavigateTo } from "../../di/setupBindings";

import { symbols } from "../../di/symbols";
import { TAction } from "../actions";
import { getDependency, neuTake } from "../sagas";

function* goBack(): Iterator<effects.Effect> {
  while (true) {
    const action: TAction = yield neuTake("GO_BACK");
    if (action.type !== "GO_BACK") {
      continue;
    }
    //@todo, add "back" route, probably need to extend the navigator dependency
  }
}

function* goToRoute(): Iterator<effects.Effect> {
  while (true) {
    const action: TAction = yield neuTake("GO_TO_ROUTE");
    if (action.type !== "GO_TO_ROUTE") {
      continue;
    }
    const navigator: NavigateTo = yield effects.call(getDependency, symbols.navigateTo);
    navigator(action.payload.path);
  }
}

export const routingSagas = function* routingSagas(): Iterator<effects.Effect> {
  yield effects.all([effects.fork(goBack), effects.fork(goToRoute)]);
};
