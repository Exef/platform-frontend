import * as React from "react";
import { WalletType } from "../../modules/web3/types";
import { appConnect } from "../../store";
import { selectConnectedWeb3State } from "../../modules/web3/reducer";

interface IStateProps {
  walletType: WalletType;
}

export const BrowserWalletMessageSignPrompt: React.SFC = () => (
  <div className="text-center">
    <h1>Confirm your wallet ownership</h1>
    <p>Please confirm on selected existing wallet that you will be using it for Neufund platform</p>
  </div>
);

// this get more complicated when light wallet is locked
export const LightWalletMessageSignPrompt: React.SFC = () => (
  <div className="text-center">
    <h1>Confirm your wallet ownership</h1>
    <p>Please confirm on selected existing wallet that you will be using it for Neufund platform</p>
  </div>
);

export const LedgerWalletMessageSignPrompt: React.SFC = () => (
  <div className="text-center">
    <h1>Confirm you Ledger Ownership</h1>
    <p>
      Please confirm on your Nano Ledger that you are an owner of the device by clicking on the
      right button
    </p>
  </div>
);

export const MessageSignPromptComponent: React.SFC<IStateProps> = ({ walletType }) => {
  switch (walletType) {
    case WalletType.BROWSER:
      return <BrowserWalletMessageSignPrompt />;
    case WalletType.LEDGER:
      return <LedgerWalletMessageSignPrompt />;
    default:
      return <LightWalletMessageSignPrompt />
  }
};

export const MessageSignPrompt = appConnect<IStateProps>({
  stateToProps: s => ({
    walletType: selectConnectedWeb3State(s.web3State).type,
  }),
})(MessageSignPromptComponent);
