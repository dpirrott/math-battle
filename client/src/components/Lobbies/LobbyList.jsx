import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { LobbyCard } from "./LobbyCard";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "./LobbyCss.css";
import { Highscores } from "../Highscores/Highscores";

export const LobbyList = ({
  socket,
  username,
  errorMsg,
  handleLeaveRoom,
  roomID,
  removeCookie,
  setFinish,
  viewHighScores,
  setViewHighScores,
}) => {
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
        removeCookie("username", { path: "/", secure: true, sameSite: "none" });
      })
      .catch((err) => console.log("Logout error:", err));
  };

  return (
    <div>
      {!viewHighScores && (
        <>
          <Button className="logout" variant="danger" onClick={() => handleLogout()}>
            Logout
          </Button>
          <Button
            className="highscoreBtn"
            variant="primary"
            onClick={() => setViewHighScores(true)}
          >
            Highscores
          </Button>

          <div className="d-grid gap-2 lobbyList">
            {lobbyCards}
            {errorMsg && <p>{errorMsg}</p>}
          </div>
        </>
      )}

      {viewHighScores && <Highscores setViewHighScore={setViewHighScores} username={username} />}
    </div>
  );
};
