import React, { useEffect, useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";

const Quiz = ({ socket, cookies }) => {
  const [question, setQuestion] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [responses, setResponses] = useState([]);
  const [score, setScore] = useState({
    points: 0,
    total: 0,
  });
  const [socketID, setSocketID] = useState(null);
  const [opponentAnswers, setOpponentAnswers] = useState([]);
  const [opponentResult, setOpponentResult] = useState(null);

  const [clock, setClock] = useState("Infinity");
  const [finish, setFinish] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log(socket.id);
    });
    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 5000);
    });
    socket.on("new player", (arg) => {
      console.log("New player joined: ", arg);
    });
    socket.on("playerAnswer", (answer) => {
      console.log("Player answered: ", answer);
      setOpponentAnswers((prev) => [...prev, answer]);
    });

    socket.on("game questions", (questionsList) => {
      setQuestions(questionsList);
    });

    socket.on("game timer", (clock) => {
      setClock(clock);
    });

    socket.on("finish", (msg) => {
      setFinish(msg);
      setClock("Infinity");
      setQuestions(null);
      setQuestion(null);
    });

    socket.on("opponentScore", (result) => {
      console.log(result);
      setOpponentResult(result);
    });

    socket.on("disconnect", () => console.log("Disconnected"));
  }, [socket]);

  const startGame = () => {
    socket.emit("start game");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formatInput = e.target[0].value.trim();

    if (formatInput === "") {
      return;
    }

    socket.emit("playerAnswer", formatInput);

    // console.log(
    //   `typeof formatInput: ${typeof formatInput} --- typeof question.answer: ${typeof question.answer}`
    // );

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

  const renderQuestion = () => {
    const retrievedQuestion = questions[responses.length];
    setQuestion(retrievedQuestion);
  };

  // const renderOpponentAnswers = () => {
  //   const oppAnswers = opponentAnswers.map((answer, index) => {
  //     // console.log(`number: ${number}, index: ${index}`);
  //     return <li key={index}>{answer}</li>;
  //   });
  //   return oppAnswers;
  // };

  useEffect(() => {
    if (questions) {
      setFinish(null);
      renderQuestion();
    }
  }, [questions, responses]);

  useEffect(() => {
    if (questions) {
      setScore({
        points: 0,
        total: 0,
      });
      setResponses([]);
    }
  }, [questions]);

  useEffect(() => {
    if (finish) {
      socket.emit("opponentScore", { userID: socketID, ...score });
    }
  }, [finish]);

  useEffect(() => {
    socket.emit("new player", cookies.name);
  }, [cookies]);

  return (
    <div>
      <h2>"{cookies.name}"</h2>
      {!setFinish && (
        <h2>
          Time remaining: {clock} {}
        </h2>
      )}

      {finish ? (
        <h2>{finish}</h2>
      ) : (
        question && (
          <div>
            <h3>Question {responses.length + 1}</h3>
            <h2>{question.question}</h2>
          </div>
        )
      )}

      {questions && (
        <Form onSubmit={(e) => handleSubmit(e)}>
          <FormControl type="number" />
        </Form>
      )}
      <Button onClick={() => startGame()}>Start</Button>

      {score.total > 0 && <h3>Score: {`${score.points} / ${score.total}`}</h3>}
      {opponentResult && (
        <h4>
          {opponentResult.userID} score:{" "}
          {`${opponentResult.points} / ${opponentResult.total}`}
        </h4>
      )}
      {/* <ul>{renderAnswers()}</ul> */}
      {/* <ul>{opponentAnswers && renderOpponentAnswers()}</ul> */}
    </div>
  );
};

export default Quiz;
