import React, { useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import "./Highscores.css";
import { HighscoreCard } from "../Highscores/HighscoreCard";
import { useEffect } from "react";

export const Highscores = ({ setViewHighScore, username }) => {
  const [displayHistoryData, setDisplayHistoryData] = useState(null);

  const loadGameHistory = async () => {
    const history = await axios.get("/gameHistory", { params: { username } });
    console.log(history.data);
    const listHistoryData = history.data.map((game, i) => {
      return <HighscoreCard key={i} game={game} username={username} />;
    });
    setDisplayHistoryData(listHistoryData);
  };

  const deleteGameHistory = async () => {
    await axios.get("deleteGames");
    setDisplayHistoryData([]);
  };

  useEffect(() => {
    loadGameHistory();
  }, []);

  return (
    <div>
      <Button onClick={() => setViewHighScore(false)}>Return to Rooms</Button>
      {/* <Button onClick={() => deleteGameHistory()}>Delete game history</Button> */}

      <div className="highScoreTabs">
        <button>Personal</button>
        <button>Global</button>
      </div>

      <div className="personalScoresContainer">
        <h1 className="userTitle">{username}</h1>

        <div className="scoreSummaryContainer">
          <div className="summaryContainer endSummary">
            <div className="summaryCard">
              <h1>60</h1>
              <h2>Games</h2>
            </div>
          </div>
          <div className="summaryContainer">
            <div className="summaryCard">
              <h1>50</h1>
              <h2>Wins</h2>
            </div>
          </div>
          <div className="summaryContainer endSummary">
            <div className="summaryCard">
              <h1>75.5</h1>
              <h2>SPM</h2>
            </div>
          </div>
        </div>

        <h1 className="matchHistoryTitle">Match History</h1>
        <p className="historySubTitle">Press game for more details</p>
        <ul>{displayHistoryData}</ul>
      </div>
    </div>
  );
};
