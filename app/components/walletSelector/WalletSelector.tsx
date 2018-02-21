import * as cn from "classnames";
import * as React from "react";
import { NavLink } from "react-router-dom";
import { Col, Row } from "reactstrap";

import { appConnect } from "../../store";
import { LayoutRegisterLogin } from "../layouts/LayoutRegisterLogin";
import { WalletMessageSigner } from "./WalletMessageSigner";
import { WalletRouter } from "./WalletRouter";
import { walletRoutes } from "./walletRoutes";
import * as styles from "./WalletSelector.module.scss";

interface IStateProps {
  isMessageSigning: boolean;
}

export const WalletSelectorComponent: React.SFC<IStateProps> = ({ isMessageSigning }) => (
  <LayoutRegisterLogin>
    {isMessageSigning ? (
      <WalletMessageSigner />
    ) : (
      <>
        <Row>
          <Col
            className={cn(
              "d-flex flex-column flex-md-row justify-content-center mt-3 mb-5",
              styles.walletChooser,
            )}
          >
            <NavLink
              className={cn("mb-3 mb-md-0", styles.wallet)}
              to={walletRoutes.light}
              data-test-id="wallet-selector-light"
              data-text="use Neufund wallet"
            >
              use Neufund wallet
            </NavLink>
            <NavLink
              className={cn("mb-3 mb-md-0", styles.wallet)}
              to={walletRoutes.browser}
              data-test-id="wallet-selector-browser"
              data-text="use existing wallet"
            >
              use existing wallet
            </NavLink>
            <NavLink
              className={cn("mb-3 mb-md-0", styles.wallet)}
              to={walletRoutes.ledger}
              data-test-id="wallet-selector-ledger"
              data-text="use nano ledger"
            >
              use nano ledger
            </NavLink>
          </Col>
        </Row>
        <Row>
          <Col>
            <WalletRouter />
          </Col>
        </Row>
      </>
    )}
  </LayoutRegisterLogin>
);

export const WalletSelector = appConnect<IStateProps>({
  stateToProps: s => ({
    isMessageSigning: s.walletSelector.isMessageSigning,
  }),
})(WalletSelectorComponent);
