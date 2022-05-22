import { Modal as Popup, Button } from "react-bootstrap";

export const Modal = ({ handleClose, show }) => {
  return (
    <>
      <Popup show={show} onHide={handleClose}>
        <Popup.Header closeButton>
          <Popup.Title>Game Settings</Popup.Title>
        </Popup.Header>
        <Popup.Body>Woohoo, you're reading this text in a Popup!</Popup.Body>
        <Popup.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Popup.Footer>
      </Popup>
    </>
  );
};
