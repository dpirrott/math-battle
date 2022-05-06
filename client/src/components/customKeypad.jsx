import { useState } from "react";

import "./KeyPad.css";

export const KeyPad = () => {
  return (
    <div class="container">
      <div class="row" id="displayContainer">
        <p id="display">DISPLAY</p>
      </div>

      <div class="row">
        <button class="row-item" id="delete">
          Del
        </button>
        <button class="row-item" id="submit">
          Submit
        </button>
      </div>

      <div class="row">
        <button class="row-item number" id="7">
          7
        </button>
        <button class="row-item number" id="8">
          8
        </button>
        <button class="row-item number" id="9">
          9
        </button>
      </div>

      <div class="row">
        <button class="row-item number" id="4">
          4
        </button>
        <button class="row-item number" id="5">
          5
        </button>
        <button class="row-item number" id="6">
          6
        </button>
      </div>

      <div class="row">
        <button class="row-item number" id="1">
          1
        </button>
        <button class="row-item number" id="2">
          2
        </button>
        <button class="row-item number" id="3">
          3
        </button>
      </div>

      <div class="row">
        <button class="row-item number" id="dot">
          .
        </button>
        <button class="row-item number" id="0">
          0
        </button>
        <button class="row-item operation" id="neg">
          (-)
        </button>
      </div>
    </div>
  );
};
