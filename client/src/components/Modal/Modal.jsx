import { Modal as Popup, Button } from "react-bootstrap";
import { DifficultyButtons } from "./DifficultyButtons";

export const Modal = ({ handleClose, show }) => {
  return (
    <>
      <Popup show={show} onHide={handleClose}>
        <Popup.Header closeButton>
          <Popup.Title>Game Settings</Popup.Title>
        </Popup.Header>
        <Popup.Body>
          <h4>Difficulty (Digits)</h4>
          <DifficultyButtons />
        </Popup.Body>
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
