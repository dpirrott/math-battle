import React from "react";
import Button from "react-bootstrap/Button";
import "./LobbyCss.css";

export const LobbyList = ({ socket, username, errorMsg }) => {
  const gameNumbers = [1, 2, 3, 4, 5];

  const gameRooms = () => {
    return gameNumbers.map((number) => (
      <div key={number} className="lobbyCard">
        <Button
          className="joinBtn"
          size="lg"
          onClick={() => {
            socket.emit("join room", { number, username });
          }}
        >{`Room ${number}`}</Button>

        <div className="playerVsPlayerCard">
          <p>Waiting for player...</p>
          <div className="versusCircle">
            <h3>Vs.</h3>
          </div>
          <p>Waiting for player...</p>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <header>
        <h1>Choose a room</h1>
      </header>
      <div className="d-grid gap-2 lobbyList">
        {gameRooms()}
        {errorMsg && <p>{errorMsg}</p>}
      </div>
    </div>
  );
};
