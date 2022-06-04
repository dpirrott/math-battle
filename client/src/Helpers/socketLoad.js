const socketLoad = ({
  socket,
  socketID,
  score,
  setScore,
  cookies,
  removeCookie,
  setOpponentName,
  setGameSettings,
  setQuestions,
  setClock,
  setTotalTime,
  setFinish,
  setOpponentResult,
  setOpponentResponses,
  setTimerIsRunning,
  setDisplay,
}) => {
  socket.on("connect", () => {
    if (cookies.username) {
      // console.log("I was previously known as ", cookies.name);
      socket.emit("new player", { name: cookies.username, socketID: socket.id });
    }
  });

  socket.on("connect_error", () => {
    setTimeout(() => socket.connect(), 5000);
  });

  socket.on("new player", (name) => {
    console.log("New player joined: ", name);
    const tempScore = JSON.parse(localStorage.getItem("score")) || score;
    console.log("sending score:", tempScore);
    setOpponentName(name);
    socket.emit("opponentScore", { userID: cookies.username, ...tempScore });
  });

  socket.on("current players", (players) => {
    // For now assume only 1 opponent
    if (players.length > 0) {
      console.log("Player already in lobby: ", players[0].name);
      setOpponentName(players[0].name);
    }
  });

  socket.on("playerAnswer", (answer) => {
    console.log("Player answered: ", answer);
  });

  socket.on("currentSettings", (settings) => {
    console.log(settings);
    setGameSettings(settings);
  });

  socket.on("game questions", (questionsList) => {
    setQuestions(questionsList);
    localStorage.setItem("questions", JSON.stringify(questionsList));
    setScore({ points: 0, correct: 0, total: 0 });
    setOpponentResult({ points: 0, correct: 0, total: 0 });
    localStorage.setItem("score", JSON.stringify({ points: 0, correct: 0, total: 0 }));
  });

  socket.on("game timer", (clock, totalGameTime = false) => {
    if (totalGameTime) {
      setTotalTime(totalGameTime);
      localStorage.setItem("totalTime", JSON.stringify(totalGameTime));
    }
    setClock(clock);
  });

  socket.on("end game", () => {
    localStorage.clear();
    setTimerIsRunning(false);
    setClock(0);
    setFinish("Game over");
    setTotalTime(null);
    setQuestions(null);
  });

  socket.on("finish", () => {
    localStorage.clear();
    setTimerIsRunning(false);
    setClock(0);
    setFinish("Game over");
    setTotalTime(null);
    setQuestions(null);
  });

  socket.on("pause", () => {
    setTimerIsRunning(false);
    setDisplay("PAUSED");
  });

  socket.on("resume", () => {
    setDisplay("0");
    setTimerIsRunning(true);
  });

  socket.on("opponentResponses", (opponentResponses) => {
    setOpponentResponses(opponentResponses);
  });

  socket.on("opponentScore", (result) => {
    // console.log(result);
    // console.log("Points:", result.points);
    setOpponentResult(result);
  });

  socket.on("opponent disconnect", (username) => {
    setOpponentName(null);
    setOpponentResult(null);
    console.log(`${username} disconnected.`);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
    localStorage.clear();
  });
};

module.exports = { socketLoad };
