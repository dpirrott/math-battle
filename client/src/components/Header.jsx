import React from "react";
import { Timer } from "./Timer";

export const Header = ({ clock, setFinish }) => {
  return (
    <div id="header">
      <div className="scoreCard">
        <h2>Dfish</h2>
        <h1>75pts</h1>
      </div>
      <Timer clock={clock} setFinish={setFinish} />
      <div className="scoreCard">
        <h2>Opponent</h2>
        <h1>100pts</h1>
      </div>
    </div>
  );
};
