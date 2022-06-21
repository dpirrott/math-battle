import React from "react";
import "./Header.css";

export const Header = ({ cookies, roomID }) => {
  return (
    <div className="headerContainer">
      {!cookies.username && <h1 className="headerText">Math Battle</h1>}
      {!roomID && cookies.username && <h1 className="headerText">Choose a room</h1>}
      {roomID && <button></button>}
    </div>
  );
};
