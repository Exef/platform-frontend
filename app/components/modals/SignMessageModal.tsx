import * as React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { appConnect } from "../../store";
import { LoadingIndicator } from "../shared/LoadingIndicator";

interface IProps {
  isOpen: boolean;
  errorMsg?: string;
}

const MessageSignModalComponent: React.SFC<IProps> = props => (
  <Modal isOpen={props.isOpen}>
    <ModalHeader>Message Signing!</ModalHeader>
    <ModalBody>
      Confirm message on your signer!
      <p>{props.errorMsg}</p>
    </ModalBody>
    <ModalFooter>
      <LoadingIndicator />
    </ModalFooter>
  </Modal>
);

export const MessageSignModal = appConnect<IProps>({
  stateToProps: s => ({
    isOpen: s.signMessageModal.isOpen,
    errorMsg: s.signMessageModal.errorMsg,
  }),
})(MessageSignModalComponent);
