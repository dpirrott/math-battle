import React from "react";
import { Timer } from "./Timer/Timer";

export const Header = ({
  cookies,
  score,
  opponentName,
  opponentResult,
  clock,
  finish,
  setFinish,
  timerIsRunning,
  onPause,
  onResume,
  setTimerIsRunning,
  totalTime,
}) => {
  return (
    <div id="header">
      <div className="scoreCard user">
        <h2>{cookies.username}</h2>

        <div className="questionScoreContainer">
          <div className="questionContainer">
            <h3>Question</h3>
            <h1>{score.total}</h1>
          </div>
          <div className="scoreContainer">
            <h3>Score</h3>
            <h1>{score.points}</h1>
          </div>
        </div>
      </div>
      {totalTime && (
        <Timer
          clock={clock}
          finish={finish}
          setFinish={setFinish}
          onPause={onPause}
          onResume={onResume}
          timerIsRunning={timerIsRunning}
          setTimerIsRunning={setTimerIsRunning}
          totalTime={totalTime}
        />
      )}

      <div className="scoreCard opponent">
        <h2>{opponentName || "Waiting for opponent..."}</h2>
        <h1>{opponentResult && opponentResult.points}</h1>
      </div>
    </div>
  );
};
