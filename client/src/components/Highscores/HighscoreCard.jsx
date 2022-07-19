import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getUserAndOpponentScores } from "../../Helpers/getUserOpponentScores";

export const HighscoreCard = ({ game, username }) => {
  const [user, setUser] = useState({ score: { points: 0 } });
  const [opponent, setOpponent] = useState({ score: { points: 0 } });
  const [dateTime, setDateTime] = useState({
    date: "",
    time: "",
  });
  const { tie = false, winner, loser, gameSettings, users, game_date } = game;

  useEffect(() => {
    const datetime = new Date(game_date).toLocaleString("en-CA", {
      timeZone: "Canada/Pacific",
    });
    const date = datetime.slice(0, 10);
    const time = datetime.slice(12, 17) + " " + datetime.slice(-4, datetime.length);
    console.log(`datetime: ${datetime}, date: ${date}, time: ${time}`);
    setDateTime({
      date,
      time,
    });
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
    <li
      className="matchCardContainer"
      style={{ backgroundColor: `${tie ? "grey" : winner.name === username ? "green" : "red"}` }}
    >
      <div>
        <h3>{dateTime.date}</h3>
        <p>{dateTime.time}</p>
      </div>
      <div>
        <h2>{tie ? "Tie" : winner.name === username ? "Win" : "Loss"}</h2>
        <h1>{`${user.score.points} - ${opponent.score.points}`}</h1>
      </div>
      <div>
        <h3>Vs.</h3>
        <h1>{opponent.name}</h1>
      </div>

      {/* <button>Expand details button</button> */}
    </li>
  );
};
