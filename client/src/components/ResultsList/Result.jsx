import React from "react";

export const Result = ({ result }) => {
  return (
    <p>{`Q(${result.num}) ${result.question} ${result.answer} - ${
      result.result ? "Correct" : "incorrect"
    }`}</p>
  );
};
