import React, { useState } from "react";

const Quiz = (props) => {
  const [list, setList] = useState([5, 6, 8]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formatInput = e.target[0].value.trim();
    if (formatInput === "") {
      return;
    }
    const temp = [...list];
    temp.push(formatInput);
    e.target[0].value = "";
    setList(temp);
  };

  const renderList = () => {
    const testList = list.map((number, index) => {
      console.log(`number: ${number}, index: ${index}`);
      return <li key={index}>{number}</li>;
    });
    return testList;
  };

  return (
    <div>
      <h1>Quiz</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input type={"number"}></input>
      </form>
      <ul>{renderList()}</ul>
    </div>
  );
};

export default Quiz;
