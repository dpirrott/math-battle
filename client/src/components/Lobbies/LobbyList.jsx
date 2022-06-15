import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import "./LobbyCss.css";

export const LobbyList = ({ socket, username, errorMsg }) => {
  const [allRoomsData, setAllRoomsData] = useState(null);
  const [lobbyCards, setLobbyCards] = useState(null);
  const gameNumbers = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (socket) {
      socket.on("update rooms", (updatedRooms) => {
        setAllRoomsData(updatedRooms);
      });
      socket.emit("request updated rooms");
    }
  }, [socket]);

  useEffect(() => {
    if (allRoomsData) {
      setLobbyCards(gameRooms(allRoomsData));
    }
  }, [allRoomsData]);

  const gameRooms = () => {
    const allRoomsDataArr = Object.values(allRoomsData);
    return allRoomsDataArr.map((room, i) => (
      <div key={i} className="lobbyCard">
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
    ));
  };

  return (
    <div>
      <header>
        <h1>Choose a room</h1>
      </header>
      <div className="d-grid gap-2 lobbyList">
        {lobbyCards}
        {errorMsg && <p>{errorMsg}</p>}
      </div>
    </div>
  );
};
