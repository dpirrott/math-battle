import "./App.css";

import Quiz from "./components/Quiz";
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

  // Login operations
  const [showLogin, setShowLogin] = useState(false);
  const handleShowLogin = () => {
    setShowLogin(true);
  };
  const handleLogin = (username, password) => {
    // console.log({ username, pass, passConf });
    return axios.post("http://localhost:5000/login", { username, password });
  };

  // Register operations
  const [showRegister, setShowRegister] = useState(false);

  const handleShowRegister = () => {
    setShowRegister(true);
  };
  const handleRegister = (username, password, passwordConf) => {
    // console.log({ username, pass, passConf });
    return axios.post("http://localhost:5000/register", { username, password, passwordConf });
  };

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocket(socket);
  }, []);

  // const enterBattle = (username) => {
  //   if (username !== "") {
  //     setCookie("name", nickName, { maxAge: 3600 });
  //   }
  // };

  return (
    <div className="App">
      {socket && cookies.username ? (
        <Quiz socket={socket} cookies={cookies} removeCookie={removeCookie} />
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
