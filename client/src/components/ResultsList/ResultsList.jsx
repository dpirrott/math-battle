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

  const generateResultsTable = (myResults, opponentResults) => {};

  return (
    <div id="resultsTableContainer">
      <table>
        <thead>
          <tr>
            <th>Number</th>
            <th>Question</th>
            <th>My result</th>
            <th>Opponent result</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      {/*
      <ul>{generateResultsList(responses)}</ul>
      {opponentResponses && <ul>{generateResultsList(opponentResponses)}</ul>} */}
    </div>
  );
};
