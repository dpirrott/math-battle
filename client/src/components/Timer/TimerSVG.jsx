import React from "react";

/**
 * This file was apart of the internal workings of React-SVG-Timer npm module.
 * I originally wanted to use their timer directly, then realized I needed to make modifications in order
 * to get it working for my particular purpose.
 */

export const TimerSVG = (props) => {
  // prettier-ignore
  const { clickStart, countdownColor, displayCountdown, draw, innerColor, outerColor, timerIsRunning, timerText } = props
  return (
    <svg
      version="1.1"
      baseProfile="tiny"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      viewBox="0 0 140 175"
    >
      {/* Outer circle */}
      <circle cx="70" cy="70" r="60.75" fill={outerColor} />

      {/* Countdown circle */}
      <circle cx="70" cy="70" r="59.75" fill={countdownColor} />

      {/* The black circle that covers the Color as the timer counts down */}
      <path d={draw} fill={outerColor} />

      {/* Inner circle that the play/pause button sits on */}
      <circle cx="70" cy="70" r="48" fill={innerColor} stroke={outerColor} />

      {/* Play / Pause button icons */}
      <g id="playButton" opacity={timerIsRunning ? 0 : 1}>
        <path d="M 55 50 L 55 91 L 95 69 L 55 50" fill={outerColor} />
      </g>

      <g id="pauseButton" opacity={timerIsRunning ? 1 : 0}>
        <rect
          x="53"
          y="53"
          height="36"
          width="13"
          rx="0"
          ry="0"
          fill={outerColor}
        />
        <rect
          x="74"
          y="53"
          height="36"
          width="13"
          rx="0"
          ry="0"
          fill={outerColor}
        />
      </g>

      {/* Hitbox for play/pause button */}
      <circle
        cx="70"
        cy="70"
        r="48"
        opacity="0"
        style={{ cursor: "pointer", WebkitTapHighlightColor: "rgba(0,0,0,0)" }}
        onClick={clickStart}
      />

      {/* Timer countdown text */}
      {displayCountdown ? (
        <text
          x="70"
          y="165"
          textAnchor="middle"
          style={{ fill: countdownColor, fontSize: "28px" }}
        >
          {timerText}
        </text>
      ) : null}
    </svg>
  );
};
