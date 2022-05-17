const socketLoad = ({
  socket,
  socketID,
  setScore,
  cookies,
  setOpponentName,
  setQuestions,
  setClock,
  setTotalTime,
  setFinish,
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
    const tempScore = JSON.parse(localStorage.getItem("score"));
    console.log("sending score:", tempScore);
    setOpponentName(name);
    socket.emit("opponentScore", { userID: socketID, ...tempScore });
  });
  socket.on("current players", (players) => {
    // For now assume only 1 opponent
    if (players.length > 0) {
      console.log("Player already in lobby: ", players[0].name);
      setOpponentName(players[0].name);
      // setOpponentResult({ points: 0 });
    }
  });
  socket.on("playerAnswer", (answer) => {
    console.log("Player answered: ", answer);
    // setOpponentAnswers((prev) => [...prev, answer]);
  });

  socket.on("game questions", (questionsList) => {
    setQuestions(questionsList);
    localStorage.setItem("questions", JSON.stringify(questionsList));
    setScore({ points: 0, correct: 0, total: 0 });
    localStorage.setItem(
      "score",
      JSON.stringify({ points: 0, correct: 0, total: 0 })
    );
  });

  socket.on("game timer", (clock, totalGameTime = false) => {
    if (totalGameTime) {
      setTotalTime(totalGameTime);
      localStorage.setItem("totalTime", JSON.stringify(totalGameTime));
    }
    setClock(clock);
  });

  socket.on("end game", () => {
    setTimerIsRunning(false);
    setClock(0);
    setFinish("Game over");
    setTotalTime(null);
    setQuestions(null);
    localStorage.removeItem("score");
    localStorage.removeItem("questions");
    localStorage.removeItem("totalTime");
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
    console.log("Points:", result.points);
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
