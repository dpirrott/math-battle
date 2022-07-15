import React from "react";
import { Button } from "react-bootstrap";

export const Highscores = ({ setViewHighScore }) => {
  return (
    <div>
      <Button onClick={() => setViewHighScore(false)}>Return to Rooms</Button>
    </div>
  );
};
