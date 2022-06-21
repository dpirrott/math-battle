import React from "react";
import "./Header.css";
import Button from "react-bootstrap/Button";

export const Header = ({ cookies, roomID, handleLeaveRoom }) => {
  return (
    <div className="headerContainer">
      {!cookies.username && <h1 className="headerText">Math Battle</h1>}
      {!roomID && cookies.username && <h1 className="headerText">Choose a room</h1>}
      {roomID && (
        <Button variant="danger" className="headerBtn" onClick={() => handleLeaveRoom()}>
          Leave room
        </Button>
      )}
    </div>
  );
};
