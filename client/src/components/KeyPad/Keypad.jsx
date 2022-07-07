import { useEffect, useState } from "react";

import "./KeyPad.css";

export const KeyPad = ({ display, setDisplay, question, handleSubmit }) => {
  const [paused, setPaused] = useState(false);
  const handleClickNum = (e) => {
    if (display === "DISPLAY" || display === "0") {
      setDisplay([e.target.id]);
    } else {
      setDisplay((prev) => [...prev, e.target.id]);
    }
    console.log(e.target.id);
  };

  const handleClickSpecial = (e) => {
    switch (e.target.id) {
      case "delete":
        if (display === "DISPLAY" || (display.length === 2 && display[0] === "-")) {
          setDisplay("0");
        } else if (display !== "0") {
          setDisplay((prev) => prev.slice(0, prev.length - 1));
        }
        break;

      case "submit":
        if (display[display.length - 1] === ".") {
          handleSubmit(display.slice(0, display.length - 1));
          setDisplay("0");
          break;
        }
        handleSubmit(display);
        setDisplay("0");
        break;

      case "neg":
        if (display === "0" || display === "DISPLAY") {
          break;
        }
        setDisplay((prev) => {
          return String(prev.join("") - 2 * prev.join("")).split("");
        });
        break;

      case "dot":
        if (display === "DISPLAY" || (display[0] === "0" && display.length === 1)) {
          setDisplay(["0", "."]);
        } else if (display.includes(".")) {
          break;
        } else {
          setDisplay((prev) => [...prev, "."]);
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (display.length === 0) {
      setDisplay("0");
    }
    if (display.length > 1 && display[0] === "0" && display[1] !== ".") {
      setDisplay((prev) => prev.slice(1));
    }
    if (display === "PAUSED" && paused === false) {
      setPaused(true);
    } else if (display === "0" && paused === true) {
      setPaused(false);
    }
  }, [display]);

  return (
    <div className="container">
      <div className="row" id="displayContainer">
        {question && (
          <p id="question">
            <span>{`Q#${question.number}`}</span>
            <span>{paused ? "(?? x ??) =" : `${question.question}`}</span>
          </p>
        )}
        <p id="display">{display}</p>
      </div>

      <div className="row">
        <button
          disabled={paused}
          onClick={(e) => handleClickSpecial(e)}
          className="row-item"
          id="delete"
        >
          Del
        </button>
        <button
          disabled={paused}
          onClick={(e) => handleClickSpecial(e)}
          className="row-item"
          id="submit"
        >
          Submit
        </button>
      </div>

      <div className="row">
        <button
          disabled={paused}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="7"
        >
          7
        </button>
        <button
          disabled={paused}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="8"
        >
          8
        </button>
        <button
          disabled={paused}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="9"
        >
          9
        </button>
      </div>

      <div className="row">
        <button
          disabled={paused}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="4"
        >
          4
        </button>
        <button
          disabled={paused}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="5"
        >
          5
        </button>
        <button
          disabled={paused}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="6"
        >
          6
        </button>
      </div>

      <div className="row">
        <button
          disabled={paused}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="1"
        >
          1
        </button>
        <button
          disabled={paused}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="2"
        >
          2
        </button>
        <button
          disabled={paused}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="3"
        >
          3
        </button>
      </div>

      <div className="row">
        <button
          disabled={paused}
          onClick={(e) => handleClickSpecial(e)}
          className="row-item number"
          id="dot"
        >
          .
        </button>
        <button
          disabled={paused}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="0"
        >
          0
        </button>
        <button
          disabled={paused}
          onClick={(e) => handleClickSpecial(e)}
          className="row-item operation"
          id="neg"
        >
          (-)
        </button>
      </div>
    </div>
  );
};
