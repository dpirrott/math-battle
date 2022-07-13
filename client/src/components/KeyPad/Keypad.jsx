import "./KeyPad.css";

export const KeyPad = ({ display, setDisplay, question, handleSubmit }) => {
  const handleClickNum = (e) => {
    if (display === "0" || (display[0] === "0" && display[1] !== ".")) {
      setDisplay([e.target.id]);
    } else {
      setDisplay((prev) => [...prev, e.target.id]);
    }
  };

  const handleClickSpecial = (e) => {
    switch (e.target.id) {
      case "delete":
        if (display === "DISPLAY" || (display.length === 2 && display[0] === "-")) {
          setDisplay("0");
        } else if (display.length === 1) {
          setDisplay("0");
        } else {
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
        setDisplay((prev) => String(prev.join("") * -1).split(""));
        break;

      case "dot":
        if (display === "DISPLAY" || display[0] === "0") {
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

  return (
    <div className="container">
      <div className="row" id="displayContainer">
        {question && (
          <p id="question">
            <span title="questionNumber">{`Q#${question.number}`}</span>
            <span title="question">
              {display === "PAUSED" ? "(?? x ??) =" : `${question.question}`}
            </span>
          </p>
        )}
        <p title="mainDisplayText" id="display">
          {display}
        </p>
      </div>

      <div className="row">
        <button
          disabled={display === "PAUSED"}
          onClick={(e) => handleClickSpecial(e)}
          className="row-item"
          id="delete"
        >
          Del
        </button>
        <button
          disabled={display === "PAUSED"}
          onClick={(e) => handleClickSpecial(e)}
          className="row-item"
          id="submit"
        >
          Submit
        </button>
      </div>

      <div className="row">
        <button
          disabled={display === "PAUSED"}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="7"
        >
          7
        </button>
        <button
          disabled={display === "PAUSED"}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="8"
        >
          8
        </button>
        <button
          disabled={display === "PAUSED"}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="9"
        >
          9
        </button>
      </div>

      <div className="row">
        <button
          disabled={display === "PAUSED"}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="4"
        >
          4
        </button>
        <button
          disabled={display === "PAUSED"}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="5"
        >
          5
        </button>
        <button
          disabled={display === "PAUSED"}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="6"
        >
          6
        </button>
      </div>

      <div className="row">
        <button
          disabled={display === "PAUSED"}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="1"
        >
          1
        </button>
        <button
          disabled={display === "PAUSED"}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="2"
        >
          2
        </button>
        <button
          disabled={display === "PAUSED"}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="3"
        >
          3
        </button>
      </div>

      <div className="row">
        <button
          disabled={display === "PAUSED"}
          onClick={(e) => handleClickSpecial(e)}
          className="row-item number"
          id="dot"
        >
          .
        </button>
        <button
          disabled={display === "PAUSED"}
          onClick={(e) => handleClickNum(e)}
          className="row-item number"
          id="0"
        >
          0
        </button>
        <button
          disabled={display === "PAUSED"}
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
