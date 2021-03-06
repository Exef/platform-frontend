import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import * as sinon from "sinon";
import { tid } from "../../test/testUtils";
import { Authorized, HeaderComponent, UnAuthorized } from "./Header";

const defaultProps = () => ({
  name: "moe",
  balanceEuro: 0,
  balanceNeu: 0,
});

describe("<Header />", () => {
  describe("<Header />", () => {
    it("should render UnAuthorized Navbar", () => {
      const component = shallow(<HeaderComponent isAuthorized={false} />);
      expect(component.find(UnAuthorized)).to.have.length(1);
      expect(component.contains(<UnAuthorized />));
    });
    it("should render Authorized Navbar", () => {
      const props = { ...defaultProps(), toggle: sinon.spy(), isOpen: false };
      const component = shallow(<HeaderComponent isAuthorized={true} {...props} />);
      expect(component.find(Authorized)).to.have.length(1);
      expect(component.contains(<Authorized {...props} />));
    });
  });
  describe("<Authorized />", () => {
    it("should call callback", () => {
      const toggle = sinon.spy();
      const component = shallow(<Authorized {...defaultProps()} toggle={toggle} isOpen={false} />);
      component.find(tid("button-toggle")).simulate("click");
      expect(toggle).to.be.calledOnce;
    });
  });
});
