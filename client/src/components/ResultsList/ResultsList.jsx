import React from "react";
import "./ResultsList.css";
import { Result } from "./Result";

const testResults = [
  {
    num: 1,
    question: "4 x 5 =",
    answer: "20",
    result: true,
  },
  {
    num: 2,
    question: "5 x 7 =",
    answer: "25",
    result: false,
  },
];

const testResults2 = [
  {
    num: 1,
    question: "4 x 5 =",
    answer: "20",
    result: true,
  },
  {
    num: 2,
    question: "5 x 7 =",
    answer: "35",
    result: true,
  },
];

export const ResultsList = ({ responses, opponentResponses }) => {
  const generateResultsList = (results) => {
    console.log("Responses:", results);
    return results.map((result, index) => {
      return (
        <li key={index}>
          <Result result={result} />
        </li>
      );
    });
  };

  return (
    <div id="resultsTableContainer">
      <ul>{generateResultsList(responses)}</ul>
      {opponentResponses && <ul>{generateResultsList(opponentResponses)}</ul>}
    </div>
  );
};
