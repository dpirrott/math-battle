import logo from "./logo.svg";
import "./App.css";

import Quiz from "./components/Quiz";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocket(socket);
  }, [setSocket]);

  return <div className="App">{socket && <Quiz socket={socket} />}</div>;
}

export default App;
