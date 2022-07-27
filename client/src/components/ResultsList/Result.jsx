import React from "react";
import { ReactComponent as Checkmark } from "../../images/correct.svg";
import { ReactComponent as RedX } from "../../images/incorrect.svg";

export const Result = ({ result }) => {
  const { number, question, myInput, myResult, oppInput, oppResult } = result;
  return (
    <tr key={number}>
      <td className="questionNumber">{number}.</td>
      <td>{question}</td>
      <td className="tableResponse">
        {myInput ? `${myInput} ` : "--"}
        {myInput && (myResult ? <Checkmark /> : <RedX />)}
      </td>
      <td className="tableResponse">
        {oppInput ? `${oppInput} ` : "--"}
        {oppInput && (oppResult ? <Checkmark /> : <RedX />)}
      </td>
    </tr>
  );
};
