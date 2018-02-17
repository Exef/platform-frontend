import * as React from "react";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";

import { flows } from "../modules/flows";
import { Web3Manager } from "../modules/web3/Web3Manager";
import { injectableFn } from "../redux-injectify";
import { AppDispatch } from "../store";
import { symbols } from "../symbols";
import { AppRouter } from "./AppRouter";
import { LoadingIndicator } from "./shared/LoadingIndicator";

const appInitAction = injectableFn(
  async (web3Manager: Web3Manager, dispatch: AppDispatch) => {
    dispatch(flows.userAgent.detectUserAgent);
    await web3Manager.initialize();
  },
  [symbols.web3Manager, symbols.appDispatch],
);

interface IInitializationDispatchProps {
  appInitAction: Function;
}

interface IInitializationState {
  isInitialized: boolean;
  errored: boolean;
  errorMsg?: string;
}

class AppComponent extends React.Component<IInitializationDispatchProps, IInitializationState> {
  constructor(props: IInitializationDispatchProps) {
    super(props);

    this.state = {
      isInitialized: false,
      errored: false,
    };
  }

  async componentDidMount(): Promise<void> {
    try {
      await this.props.appInitAction();
      this.setState({
        isInitialized: true,
      });
    } catch (e) {
      this.setState({
        isInitialized: false,
        errored: true,
        errorMsg: e.message,
      });
    }
  }

  render(): React.ReactNode {
    if (this.state.errored) {
      return <h1>Critical error occured: {this.state.errorMsg}</h1>;
    }

    if (!this.state.isInitialized) {
      return <LoadingIndicator />;
    }

    return (
      <div>
        <ToastContainer />
        <AppRouter />
      </div>
    );
  }
}

export const App = connect<{}, IInitializationDispatchProps>(
  undefined,
  dispatch => ({
    appInitAction: () => dispatch(appInitAction),
  }),
  undefined,
  { pure: false }, // we need this because of:https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
)(AppComponent);
