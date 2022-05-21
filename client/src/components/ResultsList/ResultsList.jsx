import React from "react";
import "./ResultsList.css";
import { Result } from "./Result";

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

  const joinOpponentAnswer = (myResults, opponentResults) => {
    const myLength = myResults.length;
    const oppLength = opponentResults.length;
    const tableLength = myLength > oppLength ? myLength : oppLength;
    const mergedArr = [];
    let tempObj;
    for (let i = 0; i < tableLength; i++) {
      tempObj = {};
      if (myResults[i]) {
        tempObj = {
          number: myResults[i].number,
          question: myResults[i].question,
          myInput: myResults[i].input,
          myResult: myResults[i].result,
        };
      } else {
        tempObj = {
          number: opponentResults[i].number,
          question: opponentResults[i].question,
          myInput: "",
          myResult: "",
        };
      }
      if (opponentResults[i]) {
        tempObj = { ...tempObj, oppInput: opponentResults[i].input, oppResult: opponentResults[i].result };
      } else {
        tempObj = { ...tempObj, oppInput: "", oppResult: "" };
      }
      mergedArr.push(tempObj);
    }
    console.log(mergedArr);
    return mergedArr;
  };

  const generateResultsTable = (responses, opponentResponses) => {
    const combinedArray = joinOpponentAnswer(responses, opponentResponses);
    const tableResults = combinedArray.map(({ number, question, myInput, myResult, oppInput, oppResult }) => {
      return (
        <tr>
          <td>{number}</td>
          <td>{question}</td>
          <td>{myInput && `${myInput} ${myResult}`}</td>
          <td>{oppInput && `${oppInput} ${oppResult}`}</td>
        </tr>
      );
    });
    return tableResults;
  };

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
        <tbody>{opponentResponses && generateResultsTable(responses, opponentResponses)}</tbody>
      </table>
      {/*
      <ul>{generateResultsList(responses)}</ul>
      {opponentResponses && <ul>{generateResultsList(opponentResponses)}</ul>} */}
    </div>
  );
};
