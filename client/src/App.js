import "./App.css";

import Quiz from "./components/Quiz";
import { LobbyList } from "./components/Lobbies/LobbyList";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";
import { Footer } from "./components/Footer";
import axios from "axios";

function App() {
  const [socket, setSocket] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [roomID, setRoomID] = useState(null);
  const [opponentName, setOpponentName] = useState(null);

  // Login operations
  const [showLogin, setShowLogin] = useState(false);
  const handleShowLogin = () => {
    setShowLogin(true);
  };
  const handleLogin = (username, password) => {
    // console.log({ username, pass, passConf });
    return axios.post("/login", { username, password }, { withCredentials: true });
  };

  // Register operations
  const [showRegister, setShowRegister] = useState(false);
  const handleShowRegister = () => {
    setShowRegister(true);
  };
  const handleRegister = (username, password, passwordConf) => {
    return axios.post("http://localhost:5000/register", { username, password, passwordConf });
  };

  const handleLeaveRoom = () => {
    console.log("Left the room");
    console.log(roomID);
    socket.emit("leave room", { username: cookies.username, roomID: roomID });
    setRoomID(null);
    localStorage.clear("roomID");
  };

  useEffect(() => {
    const socket = io("http://localhost:5000");
    const roomIDCached = JSON.parse(localStorage.getItem("roomID"));
    setRoomID(roomIDCached);
    if (cookies.username) {
      axios
        .post("/validUsername", { username: cookies.username }, { withCredentials: true })
        .then((res) => {
          console.log(res.data.username);
          setCookie("username", res.data.username, { maxAge: 3600 });
        })
        .catch((err) => {
          console.log(err.response.data.msg);
          removeCookie("username", { path: "/" });
        });
    }
    setSocket(socket);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("current players", ({ connectedUsers, msg, roomID }) => {
        const roomIDCached = JSON.parse(localStorage.getItem("roomID"));
        roomID = roomIDCached || roomID;
        if (roomID) {
          setRoomID(roomID);
          localStorage.setItem("roomID", roomID);
          console.log(connectedUsers);
          setOpponentName(connectedUsers.length > 0 ? connectedUsers[0] : null);
          console.log(
            `Joined room: ${roomID}, Current user in room: ${connectedUsers.length > 0 ? connectedUsers[0] : "empty"}`
          );
        } else {
          console.log(msg);
        }
      });
    }
  }, [socket]);

  return (
    <div className="App">
      {socket && cookies.username ? (
        <>
          {roomID ? (
            <Quiz
              socket={socket}
              cookies={cookies}
              removeCookie={removeCookie}
              handleLeaveRoom={handleLeaveRoom}
              opponentName={opponentName}
              setOpponentName={setOpponentName}
              roomID={roomID}
              setRoomID={setRoomID}
            />
          ) : (
            <LobbyList socket={socket} username={cookies.username} />
          )}
        </>
      ) : (
        <>
          <Button onClick={() => handleShowLogin()}>Login</Button>
          <Button onClick={() => handleShowRegister()}>Register</Button>
          <Login show={showLogin} setShow={setShowLogin} login={handleLogin} setCookie={setCookie} />
          <Register show={showRegister} setShow={setShowRegister} register={handleRegister} />
        </>
      )}
      <Footer />
    </div>
  );
}

export default App;
