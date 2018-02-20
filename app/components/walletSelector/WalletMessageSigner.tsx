import * as React from "react";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { appConnect } from "../../store";
import { compose } from "redux";
import { MessageSignPrompt } from "../signing/MessageSignPrompt";
import { Button } from "reactstrap";
import { actions } from "../../modules/actions";

interface IStateProps {
  errorMsg?: string;
}

interface IDispatchProps {
  cancelSigning: () => void;
}

export const MessageSignerComponent: React.SFC<IStateProps & IDispatchProps> = ({
  errorMsg,
  cancelSigning,
}) => (
  <>
    <MessageSignPrompt />
    {errorMsg ? <p>{errorMsg}</p> : <LoadingIndicator />}
    <Button color="secondary" onClick={cancelSigning}>
      Cancel
    </Button>
  </>
);

export const WalletMessageSigner = compose(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      errorMsg: state.walletSelector.messageSigningError,
    }),
    dispatchToProps: dispatch => ({
      cancelSigning: () => dispatch(actions.wallet.messageSigningCancelled()),
    }),
  }),
)(MessageSignerComponent);
