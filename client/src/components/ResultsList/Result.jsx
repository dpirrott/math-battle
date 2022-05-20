import React from "react";
import {ReactComponent as Checkmark} from '../../images/correct.svg'

export const Result = ({ result }) => {
  return (
    <div>
      <p>{`Q(${result.number}) ${result.question} ${result.input}`} <Checkmark /></p>

    </div>
  );
};
