import React, { useState } from "react";
import ReactSvgTimer from "react-svg-timer";
import "./KeyPad.css";

export const Timer = () => {
  let [resetRequested, setResetRequested] = useState(false);
  let [timerIsComplete, setTimerIsComplete] = useState(false);
  let [logMilliseconds, setLogMilliseconds] = useState(true);

  const onComplete = (status) => {
    setTimerIsComplete(status);
    onResetRequest();
  };

  const onReset = () => {
    setResetRequested(false);
  };

  const timerValue = (value) => {
    if (logMilliseconds) {
      console.log(value);
    }
  };

  const onResetRequest = () => {
    setResetRequested(true);
  };

  return (
    <div id="timerBox">
      <ReactSvgTimer
        timerCount={60}
        countdownColor="#00ffa8"
        innerColor="#fff"
        outerColor="#000"
        resetTimer={onReset}
        completeTimer={onComplete}
        resetTimerRequested={resetRequested}
        timerDuration={timerValue}
        displayCountdown={true}
      />
    </div>
  );
};
