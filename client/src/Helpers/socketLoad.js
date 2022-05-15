const socketLoad = ({
  socket,
  cookies,
  setOpponentName,
  setQuestions,
  setClock,
  setTotalTime,
  setFinish,
  setQuestion,
  setOpponentResult,
  setTimerIsRunning,
  setDisplay,
}) => {
  socket.on("connect", () => {
    console.log(socket.id);
    if (cookies.name) {
      console.log("I was previously known as ", cookies.name);
      socket.emit("new player", { name: cookies.name, socketID: socket.id });
    }
  });
  socket.on("connect_error", () => {
    setTimeout(() => socket.connect(), 5000);
  });
  socket.on("new player", (name) => {
    console.log("New player joined: ", name);
    setOpponentName(name);
    setOpponentResult({ points: 0 });
  });
  socket.on("current players", (players) => {
    // For now assume only 1 opponent
    if (players.length > 0) {
      console.log("Player already in lobby: ", players[0].name);
      setOpponentName(players[0].name);
      setOpponentResult({ points: 0 });
    }
  });
  socket.on("playerAnswer", (answer) => {
    console.log("Player answered: ", answer);
    // setOpponentAnswers((prev) => [...prev, answer]);
  });

  socket.on("game questions", (questionsList) => {
    setQuestions(questionsList);
  });

  socket.on("game timer", (clock, totalGameTime = false) => {
    if (totalGameTime) {
      setTotalTime(totalGameTime);
    }
    setClock(clock);
  });

  socket.on("end game", () => {
    setTimerIsRunning(false);
    setClock(0);
    setFinish("Game over");
    setTotalTime(null);
  });

  socket.on("pause", () => {
    setTimerIsRunning(false);
    setDisplay("PAUSED");
  });

  socket.on("resume", () => {
    setDisplay("0");
    setTimerIsRunning(true);
  });

  socket.on("opponentScore", (result) => {
    console.log(result);
    setOpponentResult(result);
  });

  socket.on("opponent disconnect", () => {
    setOpponentName(null);
    setOpponentResult(null);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });
};

module.exports = { socketLoad };
