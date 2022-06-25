import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { LobbyCard } from "./LobbyCard";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "./LobbyCss.css";

export const LobbyList = ({ socket, username, errorMsg, handleLeaveRoom, roomID, removeCookie }) => {
  const [allRoomsData, setAllRoomsData] = useState(null);
  const [lobbyCards, setLobbyCards] = useState(null);

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
    } else {
      socket.emit("request updated rooms");
    }
  }, [allRoomsData]);

  const gameRooms = () => {
    const allRoomsDataArr = Object.values(allRoomsData);
    return allRoomsDataArr.map((room, i) => (
      <LobbyCard key={i} i={i} room={room} socket={socket} username={username} />
    ));
  };

  const handleLogout = () => {
    axios
      .post("/logout", { username: username })
      .then((res) => {
        console.log(res.data.msg);
        socket.emit("opponent disconnect", { username: username, roomID });
        handleLeaveRoom();
        localStorage.clear();
        removeCookie("username", { path: "/" });
      })
      .catch((err) => console.log("Logout error:", err));
  };

  return (
    <div>
      <Button className="logout" variant="danger" onClick={() => handleLogout()}>
        Logout
      </Button>
      <div className="d-grid gap-2 lobbyList">
        {lobbyCards}
        {errorMsg && <p>{errorMsg}</p>}
      </div>
    </div>
  );
};
