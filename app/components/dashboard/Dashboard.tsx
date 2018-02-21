import * as React from "react";
import { Col, Container, Row } from "reactstrap";
import { MessageSignModal } from "../modals/SignMessageModal";
import { UserInfo } from "./UserInfo";

export const Dashboard = () => (
  <Container>
    <MessageSignModal />
    <Row className="mt-3">
      <Col>
        <h2>Dashboard</h2>
        <UserInfo />
      </Col>
    </Row>
  </Container>
);
