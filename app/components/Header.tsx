import * as React from "react";
import { NavLink } from "react-router-dom";
import {
  Col,
  Collapse,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  Row,
} from "reactstrap";
import { appConnect } from "../store";
import * as styles from "./Header.module.scss";

type IHeaderProps = IUnAuthProps | IAuthProps;

interface IUnAuthProps {
  isAuthorized: false;
}

interface IAuthProps {
  isAuthorized: true;
  name: string;
  balanceEuro: number;
  balanceNeu: number;
}

interface IHeaderState {
  isOpen: boolean;
}

interface IReducedHTML {
  className?: string;
}

interface IAuthorized {
  balanceEuro: number;
  balanceNeu: number;
  name: string;
  toggle: () => void;
  isOpen: boolean;
}

export const NeufundBrand: React.SFC<IReducedHTML> = props => {
  //TODO: change to HiResImage once a three size assets logo is provided
  const image = require("!file-loader?publicPath=/!../assets/img/" + "header/social_logo" + ".png");
  return (
    <Row>
      <img src={image} className={styles.brand} alt="" />
      <div className={`${styles.title} pl-3 align-self-center font-weight-bold ${props.className}`}>
        Neufund Platform
      </div>
    </Row>
  );
};

export const Authorized: React.SFC<IAuthorized> = ({
  name,
  balanceEuro,
  balanceNeu,
  toggle,
  isOpen,
}) => {
  return (
    <div>
      <Navbar expand="sm" dark className={`${styles.authorizedNavbar}`}>
        <Col sm={{ size: 12 }} className="mt-2">
          <Row className="d-flex justify-content-between mb-md-3">
            <Col lg={{ size: 3 }}>
              <NavbarBrand>
                <NeufundBrand className="text-white" />
              </NavbarBrand>
            </Col>
            <NavbarToggler onClick={toggle} data-test-id="button-toggle" />
            <Col sm={{ size: 2 }} className="align-self-center d-none d-lg-block">
              <div className={styles.miniHeader}>Account balance</div>
              <div className={styles.text} data-test-id="eur-balance">
                nEUR {balanceEuro}
              </div>
            </Col>
            <Col sm={{ size: 3 }} lg={{ size: 2 }} className="align-self-center d-none d-md-block">
              <div className={styles.miniHeader}>Neumark balance</div>
              <div className={styles.text} data-test-id="neu-balance">
                NEU {balanceNeu}
              </div>
            </Col>
            <Col sm={{ size: 2 }} className="align-self-center d-none d-lg-block">
              <div className={styles.miniHeader}>Alert</div>
              <div className={styles.text}>Fund your account</div>
            </Col>
            <Col
              lg={{ size: 2 }}
              sm={{ size: 3, offset: 1 }}
              className="align-self-center d-none d-sm-block"
            >
              <Row className="d-flex justify-content-end">
                <div className={`${styles.text} align-self-center`}>{name}</div>
                <Col sm={{ size: 3 }}>
                  <i className="fa fa-lg fa-user text-white" aria-hidden="true" />
                </Col>
              </Row>
            </Col>
          </Row>
          {/* <Separator /> */}
          <Row className={`${styles.separator} mt-md-2 pt-md-2`}>
            <Col sm="12">
              <Collapse isOpen={isOpen} navbar>
                <Col sm={{ offset: 1 }}>
                  <NavLink
                    className={styles.text}
                    to="/"
                    exact
                    activeClassName={`${styles.active} font-weight-bold`}
                  >
                    Homepage
                  </NavLink>
                </Col>
                <Col>
                  <NavLink
                    className={styles.text}
                    to="/dashboard"
                    activeClassName={`${styles.active} font-weight-bold`}
                  >
                    Dashboard
                  </NavLink>
                </Col>
                <Col>
                  <NavLink
                    className={styles.text}
                    to="/portfolio"
                    activeClassName={`${styles.active} font-weight-bold`}
                  >
                    Portfolio
                  </NavLink>
                </Col>
                <Col sm="3">
                  <NavLink
                    className={styles.text}
                    to="/info"
                    activeClassName={`${styles.active} font-weight-bold`}
                  >
                    Public Info
                  </NavLink>
                </Col>
                <Col sm={{ size: 1, offset: 1 }}>
                  <div
                    color="link"
                    className="fa fa-lg fa-cog text-white"
                    aria-hidden="true"
                    onClick={() => {
                      alert("settings button clicked!");
                    }}
                  />
                </Col>
              </Collapse>
            </Col>
          </Row>
        </Col>
      </Navbar>
    </div>
  );
};

export const UnAuthorized: React.SFC<{}> = () => {
  return (
    <div>
      <Container>
        <Navbar expand="sm" className={styles.unAuthorizedNavbar}>
          <NavbarBrand>
            <NeufundBrand />
          </NavbarBrand>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink to="/login">Login</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </Container>
    </div>
  );
};

export class HeaderComponent extends React.Component<IHeaderProps, IHeaderState> {
  constructor(props: IHeaderProps) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render(): React.ReactNode {
    return this.props.isAuthorized ? (
      <Authorized
        balanceEuro={this.props.balanceEuro}
        balanceNeu={this.props.balanceNeu}
        name={this.props.name}
        toggle={this.toggle}
        isOpen={this.state.isOpen}
      />
    ) : (
      <UnAuthorized />
    );
  }
}

export const Header = appConnect<IHeaderProps>({
  stateToProps: state => {
    // relying on web3state connected is temporary
    if (state.web3State.connected) {
      return {
        isAuthorized: true,
        name: "Marcin Rodulfix",
        balanceEuro: 0,
        balanceNeu: 0,
      };
    } else {
      return {
        isAuthorized: false,
      };
    }
  },
  options: {
    pure: false,
  },
})(HeaderComponent);
