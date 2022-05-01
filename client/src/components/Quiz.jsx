import React, { useEffect, useState } from "react";
import { Form, FormControl } from "react-bootstrap";

const Quiz = (props) => {
  const [list, setList] = useState([]);
  const [question, setQuestion] = useState({});
  const [responses, setResponses] = useState([]);
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
            result ? "correct" : "incorrect"
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
      <p>
        Question: {question.question}, answer: {question.answer}
      </p>

      <Form onSubmit={(e) => handleSubmit(e)}>
        <FormControl type="number" />
      </Form>
      <ul>{renderAnswers()}</ul>
    </div>
  );
};

export default Quiz;
