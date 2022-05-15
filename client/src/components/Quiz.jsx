import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { socketLoad } from "../Helpers/socketLoad";
import { Header } from "./Header";
import { KeyPad } from "./KeyPad/Keypad";

const Quiz = ({ socket, cookies }) => {
  const [question, setQuestion] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [responses, setResponses] = useState([]);
  const [score, setScore] = useState({
    correct: 0,
    total: 0,
  });
  const [socketID, setSocketID] = useState(null);
  const [opponentName, setOpponentName] = useState(null);
  const [opponentResult, setOpponentResult] = useState(null);

  const [clock, setClock] = useState(0);
  const [totalTime, setTotalTime] = useState(null);
  const [finish, setFinish] = useState(null);
  const [display, setDisplay] = useState("DISPLAY");
  const [timerIsRunning, setTimerIsRunning] = useState(false);

  // Set-up socket event listeners
  useEffect(() => {
    if (socket && cookies.name) {
      socketLoad({
        socket,
        cookies,
        setOpponentName,
        setQuestions,
        setClock,
        setTotalTime,
        setFinish,
        setQuestion,
        setOpponentResult,
        setTimerIsRunning,
        setDisplay,
      });
    }
  }, [socket, cookies.name]);

  const startGame = () => {
    socket.emit("start game");
    setOpponentResult(null);
    setFinish(null);
    setDisplay("0");
    setTimerIsRunning(true);
    socket.emit("resume");
  };

  const endGame = () => {
    socket.emit("end game");
    setTimerIsRunning(false);
    setClock(0);
    setFinish("Game over");
    setTotalTime(null);
  };

  const pause = () => {
    socket.emit("pause");
    setDisplay("PAUSED");
  };

  const resume = () => {
    socket.emit("resume");
    setDisplay("0");
  };

  const handleSubmit = () => {
    const formatInput = display.join("");

    if (formatInput === "") {
      return;
    }

    socket.emit("playerAnswer", formatInput);

    const result = Number(formatInput) === question.answer;
    console.log(result);

    if (result) {
      setScore((prev) => {
        return {
          correct: prev.correct + 1,
          total: prev.total + 1,
          points: Math.round(
            ((prev.correct + 1) / (prev.total + 1)).toFixed(1) *
              (prev.correct + 1) *
              10
          ),
        };
      });
    } else {
      setScore((prev) => {
        return {
          ...prev,
          total: prev.total + 1,
          points: Math.round(
            (prev.correct / (prev.total + 1)).toFixed(1) * prev.correct * 10
          ),
        };
      });
    }

    const response = {
      ...question,
      input: formatInput,
      result: result,
    };

    setDisplay("0");

    setResponses((prev) => [...prev, response]);
  };

  // const renderAnswers = () => {
  //   const testList = responses.map(
  //     ({ question, answer, input, result }, index) => {
  //       // console.log(`number: ${number}, index: ${index}`);
  //       return (
  //         <li key={index}>{`${question} = ${input} - ${
  //           result ? "correct" : `incorrect (answer = ${answer})`
  //         }`}</li>
  //       );
  //     }
  //   );
  //   return testList;
  // };

  // const renderOpponentAnswers = () => {
  //   const oppAnswers = opponentAnswers.map((answer, index) => {
  //     // console.log(`number: ${number}, index: ${index}`);
  //     return <li key={index}>{answer}</li>;
  //   });
  //   return oppAnswers;
  // };

  useEffect(() => {
    const renderQuestion = () => {
      const retrievedQuestion = questions[responses.length];
      setQuestion(retrievedQuestion);
    };

    if (questions) {
      if (finish) {
        setFinish(null);
      }
      renderQuestion();
    }
  }, [questions, responses]);

  useEffect(() => {
    if (questions) {
      setScore({
        correct: 0,
        total: 0,
      });
      setResponses([]);
    }
  }, [questions]);

  useEffect(() => {
    if (finish) {
      setClock(0);
      setQuestions(null);
      setQuestion(null);
    }

    socket.emit("opponentScore", { userID: socketID, ...score });
  }, [finish, score, socket, socketID]);

  useEffect(() => {
    if (socketID) {
      socket.emit("new player", { name: cookies.name, socketID: socketID });
    }
  }, [cookies, socket, socketID]);

  useEffect(() => {
    setSocketID(socket.id);
  }, [socket]);

  return (
    <div>
      <h2>
        "{cookies.name}"{" "}
        {opponentName
          ? `Vs. "${opponentName}"`
          : "--> waiting for opponent to join..."}
      </h2>

      {finish && <h2>{finish}</h2>}

      {clock === 0 ? (
        <Button onClick={() => startGame()}>Start</Button>
      ) : (
        <Button onClick={() => endGame()}>End Game</Button>
      )}
      <Header
        cookies={cookies}
        score={score}
        opponentName={opponentName}
        opponentResult={opponentResult}
        clock={clock}
        finish={finish}
        setFinish={setFinish}
        timerIsRunning={timerIsRunning}
        setTimerIsRunning={setTimerIsRunning}
        totalTime={totalTime}
        onPause={() => pause()}
        onResume={() => resume()}
      />
      {/* <Timer /> */}
      {questions && (
        <KeyPad
          display={display}
          setDisplay={setDisplay}
          question={question}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Quiz;
