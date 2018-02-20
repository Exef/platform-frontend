import * as React from "react";
import { Col, Container, Row } from "reactstrap";
import { appConnect } from "../store";

export const Home: React.SFC = () => (
  <Container>
    <Row className="mt-3">
      <Col>
        <h2 data-test-id="homepage-title">Home</h2>
      </Col>
    </Row>
  </Container>
);

