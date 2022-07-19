import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getUserAndOpponentScores } from "../../Helpers/getUserOpponentScores";

export const HighscoreCard = ({ game, username }) => {
  const [user, setUser] = useState({ score: { points: 0 } });
  const [opponent, setOpponent] = useState({ score: { points: 0 } });
  const { tie = false, winner, loser, gameSettings, users, game_date } = game;

  useEffect(() => {
    let tempUser;
    let tempOpponent;
    if (tie) {
      tempUser = users.find((user) => user.name === username);
      tempOpponent = users.find((user) => user.name !== username);
      setUser(tempUser);
      setOpponent(tempOpponent);
    } else {
      [tempUser, tempOpponent] = getUserAndOpponentScores(username, winner, loser);
      setUser(tempUser);
      setOpponent(tempOpponent);
    }
  }, []);

  return (
    <li>
      <div>{game_date}</div>
      <div>
        <h2>{tie ? "Tie" : winner.name === username ? "Win" : "Loss"}</h2>
        <h1>{user.score.points}</h1>
      </div>
      <div>Game status - win/score</div>
      <div>Opponent details</div>

      <button>Expand details button</button>
    </li>
  );
};
