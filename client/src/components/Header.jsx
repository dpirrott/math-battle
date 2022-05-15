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
      <div className="scoreCard">
        <h2>{cookies.name}</h2>
        <h1>{score.total > 0 && score.points}</h1>
      </div>
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
      <div className="scoreCard">
        <h2>{opponentName}</h2>
        <h1>{opponentResult && opponentResult.points}</h1>
      </div>
    </div>
  );
};
