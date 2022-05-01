import React, { useEffect, useState } from "react";
import { Form, FormControl } from "react-bootstrap";
import { io } from "socket.io-client";

const Quiz = ({ socket }) => {
  const [question, setQuestion] = useState({});
  const [responses, setResponses] = useState([]);
  const [score, setScore] = useState({
    points: 0,
    total: 0,
  });
  const [socketID, setSocketID] = useState(null);
  const [opponentAnswers, setOpponentAnswers] = useState([]);

  const [time, setTime] = useState("fetching");

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log(socket.id);
    });
    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 5000);
    });
    socket.on("time", (data) => setTime(data));
    socket.on("new player", (arg) => {
      return console.log("New player joined: ", arg);
    });
    socket.on("playerAnswer", (answer) => {
      console.log("Player answered: ", answer);
    });

    socket.on("disconnect", () => setTime("server disconnected"));
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formatInput = e.target[0].value.trim();

    if (formatInput === "") {
      return;
    }

    // socket.emit("playerAnswer", formatInput);

    const result = formatInput == question.answer;
    console.log(result);

    if (result) {
      setScore((prev) => {
        return { points: prev.points + 1, total: prev.total + 1 };
      });
    } else {
      setScore((prev) => {
        return { ...prev, total: prev.total + 1 };
      });
    }

    const response = {
      ...question,
      input: formatInput,
      result: result,
    };

    e.target[0].value = "";

    setResponses((prev) => [...prev, response]);
  };

  const renderAnswers = () => {
    const testList = responses.map(
      ({ question, answer, input, result }, index) => {
        // console.log(`number: ${number}, index: ${index}`);
        return (
          <li key={index}>{`${question} = ${input} - ${
            result ? "correct" : `incorrect (answer = ${answer})`
          }`}</li>
        );
      }
    );
    return testList;
  };

  const renderQuestion = () => {
    const x = Math.ceil(Math.random() * 11 + 1);
    const y = Math.ceil(Math.random() * 11 + 1);
    const ans = x * y;
    setQuestion({ question: `${x} x ${y}`, answer: ans });
  };

  const renderOpponentAnswers = () => {
    const oppAnswers = opponentAnswers.map((answer, index) => {
      // console.log(`number: ${number}, index: ${index}`);
      return <li key={index}>{answer}</li>;
    });
    return oppAnswers;
  };

  useEffect(() => {
    if (score.total !== 0) {
      socket.emit("playerAnswer", { ...score, userID: socketID });
    }
  }, [score]);

  useEffect(() => {
    renderQuestion();
  }, [responses]);

  return (
    <div>
      <h1>Quiz ---- Time: {time}</h1>
      <h3>Question {responses.length + 1}</h3>
      <h2>{question.question}</h2>

      <Form onSubmit={(e) => handleSubmit(e)}>
        <FormControl type="number" />
      </Form>
      <h3>Score: {score.total > 0 && `${score.points} / ${score.total}`}</h3>
      {/* <ul>{renderAnswers()}</ul> */}
      <ul>{opponentAnswers && renderOpponentAnswers()}</ul>
    </div>
  );
};

export default Quiz;
