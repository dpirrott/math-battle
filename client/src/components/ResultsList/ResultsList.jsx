import React from "react";
import "./ResultsList.css";
import { Result } from "./Result";

export const ResultsList = ({ responses, opponentResponses, opponentName, cookies }) => {
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
        tempObj = {
          ...tempObj,
          oppInput: opponentResults[i].input,
          oppResult: opponentResults[i].result,
        };
      } else {
        tempObj = { ...tempObj, oppInput: "", oppResult: "" };
      }
      mergedArr.push(tempObj);
    }
    return mergedArr;
  };

  const generateResultsTable = (responses, opponentResponses) => {
    const combinedArray = joinOpponentAnswer(responses, opponentResponses);
    const tableResults = combinedArray.map((result, i) => {
      return <Result key={i} result={result} />;
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
            <th>{cookies.username}</th>
            <th>{opponentName}</th>
          </tr>
        </thead>
        <tbody>{opponentResponses && generateResultsTable(responses, opponentResponses)}</tbody>
      </table>
    </div>
  );
};
