import "./App.css";

import Quiz from "./components/Quiz";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Login } from "./components/Login/Login";

function App() {
  const [socket, setSocket] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  // Modal show/hide operations
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    // socket.emit("requestSettings");
    setShow(true);
  };

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
      <Button onClick={() => handleShow()}>Login</Button>
      <Login handleClose={handleClose} show={show} />
    </div>
  );
}

export default App;
