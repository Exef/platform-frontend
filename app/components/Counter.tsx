import * as React from "react";
import { Row, Col, Button } from "reactstrap";
import { connect } from "react-redux";
import { IAppState } from "../store";
import {
  counterIncrementAction,
  counterDecrementAction,
  explicitCounterAsyncAction,
} from "../modules/counter/index";

interface ICounterStateProps {
  value: number;
}

interface ICounterDispatchProps {
  countUp: () => void;
  countDown: () => void;
  countAsync: () => void;
}

export const CounterSFC: React.SFC<ICounterStateProps & ICounterDispatchProps> = props => (
  <div>
    <Row>
      <Col>
        <h2>{props.value}</h2>
        <Button color="success" onClick={props.countUp}>
          +
        </Button>{" "}
        <Button color="danger" onClick={props.countDown}>
          -
        </Button>{" "}
        <Button color="warning" onClick={props.countAsync}>
          ASYNC +-
        </Button>
      </Col>
    </Row>
  </div>
);

export const Counter = connect<ICounterStateProps, ICounterDispatchProps, {}, IAppState>(
  state => ({ value: state.counterState.value }),
  dispatch => ({
    countUp: () => dispatch(counterIncrementAction({ by: 1 })),
    countDown: () => dispatch(counterDecrementAction()),
    countAsync: () => dispatch(explicitCounterAsyncAction as any),
  }),
)(CounterSFC);
