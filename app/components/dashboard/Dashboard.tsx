import * as React from "react";
import { Col, Container, Row, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { UserInfo } from "./UserInfo";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { appConnect } from "../../store";
import { MessageSignModal } from "../modals/SignMessageModal";

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
