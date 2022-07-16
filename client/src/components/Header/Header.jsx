import React from "react";
import "./Header.css";
import Button from "react-bootstrap/Button";

export const Header = ({ cookies, roomID, handleLeaveRoom, inGame, endGame, viewHighScores }) => {
  return (
    <div className="headerContainer">
      {!cookies.username && <h1 className="headerText">Math Battle</h1>}

      {viewHighScores && <h1 className="headerText">Leaderboards</h1>}
      {!roomID && cookies.username && !viewHighScores && (
        <h1 className="headerText">Choose a room</h1>
      )}
      {roomID && cookies.username && !inGame && (
        <Button variant="danger" className="headerBtn" onClick={() => handleLeaveRoom()}>
          Leave room
        </Button>
      )}
      {inGame && (
        <Button variant="danger" className="headerBtn" onClick={() => endGame()}>
          End Game
        </Button>
      )}
    </div>
  );
};
