import React, { useEffect, useState } from "react";
import { Form, FormControl } from "react-bootstrap";

const Quiz = (props) => {
  const [list, setList] = useState([]);
  const [question, setQuestion] = useState({});
  const [responses, setResponses] = useState([]);
  const [score, setScore] = useState({
    points: 0,
    total: 0,
  });
  // const [question, setQuestion] = useState({
  //   question: "",
  //   answer: "",
  // });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formatInput = e.target[0].value.trim();

    if (formatInput === "") {
      return;
    }

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

  useEffect(() => {});

  useEffect(() => {
    renderQuestion();
  }, [responses]);

  return (
    <div>
      <h1>Quiz</h1>
      <h3>Question {responses.length + 1}</h3>
      <h2>{question.question}</h2>

      <Form onSubmit={(e) => handleSubmit(e)}>
        <FormControl type="number" />
      </Form>
      <h3>Score: {score.total > 0 && `${score.points} / ${score.total}`}</h3>
      <ul>{renderAnswers()}</ul>
    </div>
  );
};

export default Quiz;
