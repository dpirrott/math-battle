import React from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import { HighscoreCard } from "../Highscores/HighscoreCard";

export const Highscores = ({ setViewHighScore, username }) => {
  const [displayHistoryData, setDisplayHistoryData] = useState(null);

  const loadGameHistory = async () => {
    const history = await axios.get("/gameHistory", { params: { username } });
    const listHistoryData = history.data.map((game, i) => {
      return <HighscoreCard key={i} game={game} />;
    });
    setDisplayHistoryData(listHistoryData);
  };

  return (
    <div>
      <Button onClick={() => setViewHighScore(false)}>Return to Rooms</Button>

      <Button onClick={() => loadGameHistory()} variant="secondary">
        Game History
      </Button>

      {displayHistoryData && <ul>{displayHistoryData}</ul>}
    </div>
  );
};
