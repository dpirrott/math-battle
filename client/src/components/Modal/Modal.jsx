import { Modal as Popup, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { DifficultyButtons } from "./DifficultyButtons";
import React, { useState } from "react";
import RangeSlider from "react-bootstrap-range-slider";

export const Modal = ({ handleClose, show }) => {
  const [value, setValue] = useState(0);
  return (
    <>
      <Popup show={show} onHide={handleClose}>
        <Popup.Header closeButton>
          <Popup.Title>Game Settings</Popup.Title>
        </Popup.Header>
        <Popup.Body>
          <Form.Group>
            <h4>Difficulty (Digits)</h4>
            <DifficultyButtons />
          </Form.Group>

          <Form.Group>
            <Form.Label>Test Duration</Form.Label>
            <RangeSlider
              min="1"
              max="10"
              step="0.5"
              value={value}
              onChange={(changeEvent) => setValue(changeEvent.target.value)}
            />
          </Form.Group>
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
