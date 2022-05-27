import "./App.css";

import Quiz from "./components/Quiz";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";

function App() {
  const [socket, setSocket] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  // Login operations
  const [showLogin, setShowLogin] = useState(false);
  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => {
    setShowLogin(true);
  };

  // Register operations
  const [showRegister, setShowRegister] = useState(false);
  const handleCloseRegister = () => setShowRegister(false);
  const handleShowRegister = () => {
    setShowRegister(true);
  };
  const handleRegister = (username, pass, passConf) => {};

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocket(socket);
  }, []);

  const enterBattle = (e) => {
    e.preventDefault();
    const nickName = e.target[0].value.trim();
    if (nickName !== "") {
      setCookie("name", nickName, { maxAge: 3600 });
    }
  };

  return (
    <div className="App">
      {/* <h1>Math Battle</h1>
      {socket &&
        (!cookies.name ? (
          <div>
            <h4>Enter your nickname:</h4>
            <Form onSubmit={(e) => enterBattle(e)}>
              <FormControl type="text" />
              <Button type="submit">Submit</Button>
            </Form>
          </div>
        ) : (
          <Quiz socket={socket} cookies={cookies} removeCookie={removeCookie} />
        ))}
      <a target="_blank" href="https://icons8.com/icon/81146/done">
        Checkmark
      </a>
      ,{" "}
      <a target="_blank" href="https://icons8.com/icon/63688/cancel">
        Cancel
      </a>{" "}
      icon by{" "}
      <a target="_blank" href="https://icons8.com">
        Icons8
      </a> */}
      <Button onClick={() => handleShowLogin()}>Login</Button>
      <Button onClick={() => handleShowRegister()}>Register</Button>
      <Login handleClose={handleCloseLogin} show={showLogin} />
      <Register handleClose={handleCloseRegister} show={showRegister} register={handleRegister} />
    </div>
  );
}

export default App;
