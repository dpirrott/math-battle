import { useState } from "react";
import NumPad from "react-numpad";
import "./KeyPad.css";

export const KeyPad = () => {
  const [showSubmit, setShowSubmit] = useState(false);
  return (
    <>
      <NumPad.Number
        onChange={(value) => {
          console.log("value", value);
        }}
        label={"Total"}
        placeholder={"my placeholder"}
        value={100}
        decimal={2}
        showSubmit={true}
      >
        <button onClick={() => setShowSubmit(true)}>Click me!</button>
      </NumPad.Number>
      {showSubmit && <button className="enterAnswer">Sumbit!</button>}
    </>
  );
};
