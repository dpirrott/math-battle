import React from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

export const Highscores = ({ setViewHighScore, username }) => {
  const loadGameHistory = async () => {
    const historyData = await axios.get("/gameHistory", { params: { username } });
    console.log(historyData);
  };

  return (
    <div>
      <Button onClick={() => setViewHighScore(false)}>Return to Rooms</Button>

      <Button onClick={() => loadGameHistory()} variant="secondary">
        Game History
      </Button>
    </div>
  );
};
