import { useState } from "react";

import "./KeyPad.css";

export const KeyPad = () => {
  const handleClick = (e) => {
    console.log(e.target.id);
  };

  return (
    <div className="container">
      <div className="row" id="displayContainer">
        <p id="display">DISPLAY</p>
      </div>

      <div className="row">
        <button className="row-item" id="delete">
          Del
        </button>
        <button className="row-item" id="submit">
          Submit
        </button>
      </div>

      <div className="row">
        <button
          onClick={(e) => handleClick(e)}
          className="row-item number"
          id="7"
        >
          7
        </button>
        <button
          onClick={(e) => handleClick(e)}
          className="row-item number"
          id="8"
        >
          8
        </button>
        <button
          onClick={(e) => handleClick(e)}
          className="row-item number"
          id="9"
        >
          9
        </button>
      </div>

      <div className="row">
        <button
          onClick={(e) => handleClick(e)}
          className="row-item number"
          id="4"
        >
          4
        </button>
        <button
          onClick={(e) => handleClick(e)}
          className="row-item number"
          id="5"
        >
          5
        </button>
        <button
          onClick={(e) => handleClick(e)}
          className="row-item number"
          id="6"
        >
          6
        </button>
      </div>

      <div className="row">
        <button
          onClick={(e) => handleClick(e)}
          className="row-item number"
          id="1"
        >
          1
        </button>
        <button
          onClick={(e) => handleClick(e)}
          className="row-item number"
          id="2"
        >
          2
        </button>
        <button
          onClick={(e) => handleClick(e)}
          className="row-item number"
          id="3"
        >
          3
        </button>
      </div>

      <div className="row">
        <button className="row-item number" id="dot">
          .
        </button>
        <button className="row-item number" id="0">
          0
        </button>
        <button className="row-item operation" id="neg">
          (-)
        </button>
      </div>
    </div>
  );
};
