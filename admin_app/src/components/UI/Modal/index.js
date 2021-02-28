import React from "react";
import { Modal, Button } from "react-bootstrap";

const NewModal = (props) => {
  return (
    <Modal size={props.size} show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.modalTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        {props.buttons ? (
          props.buttons.map((btn, index) => {
            return (
              <Button key={index} variant={btn.color} onClick={btn.onClick}>
                {btn.label}
              </Button>
            );
          })
        ) : (
          <Button variant="primary"
          {...props}
          style={{backgroundColor:'#333'}}
           onClick={props.onSubmit}
           className="btn-sm">
             Save
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default NewModal;
