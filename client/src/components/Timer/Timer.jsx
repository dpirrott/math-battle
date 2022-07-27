import React, { useEffect, useState } from "react";
import { ReactSvgTimer } from "./ReactSvgTimer";
import "../KeyPad/KeyPad.css";

export const Timer = ({
  clock,
  finish,
  setFinish,
  onPause,
  onResume,
  timerIsRunning,
  setTimerIsRunning,
  totalTime,
}) => {
  let [resetRequested, setResetRequested] = useState(false);
  const [duration, setDuration] = useState(0);

  const onComplete = (status) => {
    onResetRequest();
    setFinish("Game over");
  };

  const onReset = () => {
    setResetRequested(false);
  };

  const timerValue = (value) => {
    return value;
  };

  const onResetRequest = () => {
    setResetRequested(true);
  };

  useEffect(() => {
    if (clock === 0 && totalTime) {
      setDuration(totalTime * 1000);
    } else {
      setDuration(clock * 1000);
    }
  }, [clock, totalTime]);

  useEffect(() => {
    if (finish === "Game over" && totalTime) {
      setDuration(totalTime * 1000);
    }
  }, [finish, totalTime]);

  return (
    <div id="timerBox">
      <ReactSvgTimer
        timerCount={totalTime || 60}
        countdownColor="#fff"
        innerColor="#fff"
        outerColor="#000"
        resetTimer={onReset}
        completeTimer={onComplete}
        resetTimerRequested={resetRequested}
        timerDuration={timerValue}
        displayCountdown={true}
        duration={duration}
        setDuration={setDuration}
        onPause={onPause}
        onResume={onResume}
        timerIsRunning={timerIsRunning}
        setTimerIsRunning={setTimerIsRunning}
      />
    </div>
  );
};
