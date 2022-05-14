import React, { useEffect, useState } from "react";
import { ReactSvgTimer } from "./ReactSvgTimer";
import "../KeyPad/KeyPad.css";

export const Timer = ({
  clock,
  setFinish,
  onPause,
  onResume,
  timerIsRunning,
  setTimerIsRunning,
}) => {
  let [resetRequested, setResetRequested] = useState(false);
  let [timerIsComplete, setTimerIsComplete] = useState(false);
  let [logMilliseconds, setLogMilliseconds] = useState(true);
  const [duration, setDuration] = useState(0);

  const onComplete = (status) => {
    setTimerIsComplete(status);
    onResetRequest();
    setFinish("Game over");
  };

  const onReset = () => {
    setResetRequested(false);
  };

  const timerValue = (value) => {
    // if (logMilliseconds) {
    //   console.log(value);
    // }
    return value;
  };

  const onResetRequest = () => {
    setResetRequested(true);
  };

  useEffect(() => {
    setDuration(clock * 1000);
  }, [clock]);

  return (
    <div id="timerBox">
      <ReactSvgTimer
        timerCount={3600}
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
