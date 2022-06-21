import React from "react";
import Button from "react-bootstrap/Button";

export const LobbyCard = ({ i, room, socket, username }) => {
  return (
    <div className="lobbyCard">
      <Button
        className="joinBtn"
        size="lg"
        onClick={() => {
          socket.emit("join room", { number: i + 1, username });
        }}
      >{`Room ${i + 1}`}</Button>

      <div className="playerVsPlayerCard">
        <p>{(room.connectedUsers[0] && room.connectedUsers[0].username) || "Waiting for player..."}</p>
        <div className="versusCircle">
          <h3>Vs.</h3>
        </div>
        <p>{(room.connectedUsers[1] && room.connectedUsers[1].username) || "Waiting for player..."}</p>
      </div>
    </div>
  );
};
