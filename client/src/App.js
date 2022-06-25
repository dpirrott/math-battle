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
import { Header } from "./components/Header/Header";

function App() {
  const [socket, setSocket] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [roomID, setRoomID] = useState(null);
  const [opponentName, setOpponentName] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [inGame, setInGame] = useState(false);

  // Quiz state variables
  const [clock, setClock] = useState(0);
  const [totalTime, setTotalTime] = useState(null);
  const [finish, setFinish] = useState(null);
  const [timerIsRunning, setTimerIsRunning] = useState(false);
  const [questions, setQuestions] = useState(null);

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
    setFinish(null);
    localStorage.clear("roomID");
  };

  const endGame = () => {
    socket.emit("end game", roomID);
    setTimerIsRunning(false);
    setClock(0);
    setFinish("Game over");
    setTotalTime(null);
    setQuestions(null);
    localStorage.clear();
  };

  useEffect(() => {
    const socket = io("http://localhost:5000");
    const roomIDCached = JSON.parse(localStorage.getItem("roomID"));
    if (cookies.username) {
      setRoomID(roomIDCached);
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
    } else {
      localStorage.clear();
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
          setOpponentName(connectedUsers.length > 0 ? connectedUsers[0].username : null);
          setErrorMsg(null);
          console.log(
            `Joined room: ${roomID}, Current user in room: ${
              connectedUsers.length > 0 ? connectedUsers[0].username : "empty"
            }`
          );
        } else {
          console.log(msg);
          setErrorMsg(msg);
        }
      });
    }
  }, [socket]);

  return (
    <div className="App">
      <Header cookies={cookies} roomID={roomID} handleLeaveRoom={handleLeaveRoom} inGame={inGame} endGame={endGame} />
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
              setInGame={setInGame}
              clock={clock}
              setClock={setClock}
              finish={finish}
              setFinish={setFinish}
              totalTime={totalTime}
              setTotalTime={setTotalTime}
              timerIsRunning={timerIsRunning}
              setTimerIsRunning={setTimerIsRunning}
              questions={questions}
              setQuestions={setQuestions}
            />
          ) : (
            <LobbyList
              socket={socket}
              username={cookies.username}
              errorMsg={errorMsg}
              handleLeaveRoom={handleLeaveRoom}
              roomID={roomID}
              removeCookie={removeCookie}
            />
          )}
        </>
      ) : (
        <div className="landingPageContent">
          <Button className="landingPageBtn login" onClick={() => handleShowLogin()}>
            Login
          </Button>
          <Button className="landingPageBtn register" onClick={() => handleShowRegister()}>
            Register
          </Button>
          <Login show={showLogin} setShow={setShowLogin} login={handleLogin} setCookie={setCookie} />
          <Register show={showRegister} setShow={setShowRegister} register={handleRegister} />
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
