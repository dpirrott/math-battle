import React from "react";
import { ReactComponent as Checkmark } from "../../images/correct.svg";
import { ReactComponent as RedX } from "../../images/incorrect.svg";

export const Result = ({ result }) => {
  return (
    <div>
      <p>
        {`Q(${result.number}) ${result.question} ${result.input}`} {result.result ? <Checkmark /> : <RedX />}
      </p>
    </div>
  );
};
