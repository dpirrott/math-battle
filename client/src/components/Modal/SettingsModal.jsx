import { Modal as Popup, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { DifficultyButtons } from "./DifficultyButtons";
import React, { useEffect, useState } from "react";
import RangeSlider from "react-bootstrap-range-slider";
import "./Settings.css";

export const SettingsModal = ({ handleClose, show, gameSettings, socket, roomID }) => {
  const [difficulty, setDifficulty] = useState(2);
  const [duration, setDuration] = useState(1);
  const [maxQuestions, setMaxQuestions] = useState(5);
  const difficultyDesc = {
    1: "Easy: numbers from 2 - 12",
    2: "Medium: numbers from 2 - 100",
    3: "Hard: numbers from 2 - 1000",
  };

  const handleSave = () => {
    const newSettings = {
      difficulty: difficulty,
      testDuration: duration * 60,
      totalQuestions: maxQuestions,
    };
    socket.emit("updateGameSettings", { newSettings, roomID });
    handleClose();
  };

  useEffect(() => {
    if (gameSettings) {
      setDifficulty(gameSettings.difficulty);
      setDuration(Math.round((gameSettings.testDuration * 10) / 60) / 10);
      setMaxQuestions(gameSettings.totalQuestions);
    }
  }, [gameSettings]);

  return (
    <>
      <Popup show={show} onHide={handleClose}>
        <Popup.Header closeButton>
          <Popup.Title>Game Settings</Popup.Title>
        </Popup.Header>
        <Popup.Body>
          <Form.Group>
            <h5>Difficulty (Digits)</h5>
            <DifficultyButtons value={difficulty} setValue={setDifficulty} />
            <Form.Text>{difficultyDesc[difficulty]}</Form.Text>
          </Form.Group>

          <Form.Group>
            <h5>
              <Form.Label>Test Duration (minutes)</Form.Label>
            </h5>
            <RangeSlider
              min={1}
              max={10}
              step={0.5}
              value={duration}
              onChange={(changeEvent) => setDuration(changeEvent.target.value)}
              tooltip="on"
              tooltipPlacement="top"
            />
          </Form.Group>

          <Form.Group>
            <h5>
              <Form.Label>Total Questions</Form.Label>
            </h5>
            <RangeSlider
              min={5}
              max={100}
              step={1}
              value={maxQuestions}
              onChange={(changeEvent) => setMaxQuestions(Number(changeEvent.target.value))}
              tooltip="on"
              tooltipPlacement="top"
            />
          </Form.Group>
        </Popup.Body>
        <Popup.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleSave()}>
            Save Changes
          </Button>
        </Popup.Footer>
      </Popup>
    </>
  );
};
