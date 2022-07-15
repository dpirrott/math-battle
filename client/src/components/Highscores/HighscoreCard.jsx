import React from "react";

export const HighscoreCard = ({ game }) => {
  const { tie = false, winner, loser, gameSettings, users } = game;
  return (
    <li>
      <div>
        <div>User details</div>
        <div>Game status - win/score</div>
        <div>Opponent details</div>
      </div>

      <button>Expand details button</button>

      {/* {tie ? (
        <ul>
          {users.map((user, i) => (
            <li key={i}>
              `Player {i + 1} - {user.name}, score - {user.score.points}`
            </li>
          ))}
        </ul>
      ) : (
        <>
          <li>
            `Winner - {winner.name} - Score - {winner.score.points}`
          </li>
          <li>
            `Loser - {loser.name} - Score - {loser.score.points}`
          </li>
        </>
      )} */}
    </li>
  );
};
