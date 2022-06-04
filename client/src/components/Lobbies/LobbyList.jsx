import React from "react";
import Button from "react-bootstrap/Button";

export const LobbyList = ({ socket }) => {
  const gameNumbers = [1, 2, 3, 4, 5];

  const gameRooms = () => {
    return gameNumbers.map((number) => (
      <Button key={number} size="lg" onClick={() => socket.emit("join room", number)}>{`Room ${number}`}</Button>
    ));
  };

  return <div className="d-grid gap-2">{gameRooms()}</div>;
};
