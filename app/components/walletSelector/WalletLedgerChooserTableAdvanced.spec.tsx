import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { AccountRow, WalletLedgerChooserTableAdvanced } from "./WalletLedgerChooserTableAdvanced";

import { tid } from "../../../test/testUtils";

const defaultProps = () => ({
  loading: false,
  accounts: [
    {
      address: "0x6C1086C292a7E1FdF66C68776eA972038467A370",
      derivationPath: "44'/60'/0'/0",
      balanceETH: "1.6495",
      balanceNEU: "0",
    },
    {
      address: "0xB2A0e2688c5A82bEEe6818F5a3D206680FdFD75d",
      derivationPath: "44'/60'/0'/1",
      balanceETH: "0",
      balanceNEU: "0",
    },
    {
      address: "0xa13D14DA39529761a6C45F4f556700735E0774a8",
      derivationPath: "44'/60'/0'/2",
      balanceETH: "0",
      balanceNEU: "0",
    },
    {
      address: "0x3cC2ef578f6Eb7ff63f9CA8f5a54cfe40339256A",
      derivationPath: "44'/60'/0'/3",
      balanceETH: "1.6495",
      balanceNEU: "0",
    },
  ],
  handleAddressChosen: spy(),
  hasPreviousAddress: true,
  showPrevAddresses: spy(),
  showNextAddresses: spy(),
  onDerivationPathPrefixChange: spy(),
  onDerivationPathPrefixError: spy(),
  advanced: true,
  handleAdvanced: spy(),
});

describe("<WalletLedgerChooserTableAdvanced />", () => {
  it("should render all provided accounts", () => {
    const props = defaultProps();
    const component = shallow(<WalletLedgerChooserTableAdvanced {...props} />);
    expect(component.find(AccountRow)).to.be.length(props.accounts.length);
    component.find(AccountRow).forEach((row, index) => {
      expect(
        row.equals(
          <AccountRow
            ledgerAccount={props.accounts[index]}
            handleAddressChosen={props.handleAddressChosen}
          />,
        ),
      ).to.be.true;
    });
  });

  it("should show / hide previous address button regarding hasPreviousAddress property", () => {
    const propsWithPrevAddr = defaultProps();
    const componentWithPrevAddr = shallow(
      <WalletLedgerChooserTableAdvanced {...propsWithPrevAddr} />,
    );
    const propsWithoutPrevAddr = {
      ...defaultProps(),
      hasPreviousAddress: false,
    };
    const componentWithoutPrevAddr = shallow(
      <WalletLedgerChooserTableAdvanced {...propsWithoutPrevAddr} />,
    );
    expect(componentWithPrevAddr.find(tid("btn-previous"))).to.be.length(1);
    expect(componentWithoutPrevAddr.find(tid("btn-previous"))).to.be.length(0);
  });

  it("should call correct click handlers for prev button", () => {
    const props = defaultProps();
    const component = shallow(<WalletLedgerChooserTableAdvanced {...props} />);
    component.find(tid("btn-previous")).simulate("click");
    expect(props.showPrevAddresses).to.be.calledOnce;
  });

  it("should call correct click handlers for next button", () => {
    const props = defaultProps();
    const component = shallow(<WalletLedgerChooserTableAdvanced {...props} />);
    component.find(tid("btn-next")).simulate("click");
    expect(props.showNextAddresses).to.be.calledOnce;
  });

  describe("<AccountRow />", () => {
    it("should render correct account data and handle click", () => {
      const props = defaultProps();
      const account = props.accounts[0];
      const accountRow = shallow(
        <AccountRow ledgerAccount={account} handleAddressChosen={props.handleAddressChosen} />,
      );

      const renderedDerivationPath = accountRow.find(tid("account-derivation-path"));
      expect(renderedDerivationPath.text()).to.be.eq(account.derivationPath);
      const renderedAddress = accountRow.find(tid("account-address"));
      expect(renderedAddress.text()).to.be.eq(account.address);
      const renderedBalanceETH = accountRow.find(tid("account-balance-eth"));
      expect(renderedBalanceETH.text()).to.be.eq(account.balanceETH + " ETH");
      const renderedBalanceNEU = accountRow.find(tid("account-balance-neu"));
      expect(renderedBalanceNEU.text()).to.be.eq(account.balanceNEU + " NEU");

      accountRow.find(tid("button-select")).simulate("click");
      expect(props.handleAddressChosen).to.be.calledOnce;
    });
  });
});
