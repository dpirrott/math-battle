import React from "react";

export const Result = ({ result }) => {
  return (
    <p>{`Q(${result.number}) ${result.question} ${result.input} - ${
      result.result ? "Correct" : "incorrect"
    }`}</p>
  );
};
