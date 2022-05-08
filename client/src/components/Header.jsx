import React from "react";
import { Timer } from "./Timer";

export const Header = () => {
  return (
    <div id="header">
      <div className="scoreCard">
        <h2>Dfish</h2>
      </div>
      <Timer />
      <div className="scoreCard">
        <h2>Opponent</h2>
      </div>
    </div>
  );
};
