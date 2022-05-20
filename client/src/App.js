import "./App.css";

import Quiz from "./components/Quiz";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { useCookies } from "react-cookie";

function App() {
  const [socket, setSocket] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocket(socket);
  }, []);

  // useEffect(() => {
  //   if (cookies.name) {
  //     console.log(cookies.name);
  //   }
  // }, [cookies]);

  const enterBattle = (e) => {
    e.preventDefault();
    const nickName = e.target[0].value.trim();
    if (nickName !== "") {
      setCookie("name", nickName, { maxAge: 3600 });
    }
  };

  return (
    <div className="App">
      <h1>Math Battle</h1>
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
      </a>
    </div>
  );
}

export default App;
