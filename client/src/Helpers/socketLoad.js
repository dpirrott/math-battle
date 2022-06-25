const socketLoad = ({
  socket,
  socketID,
  score,
  setScore,
  cookies,
  removeCookie,
  roomID,
  setRoomID,
  setOpponentReady,
  setOpponentName,
  setPlayerReady,
  setGameSettings,
  setQuestions,
  setClock,
  setTotalTime,
  setFinish,
  setOpponentResult,
  setOpponentResponses,
  setPreGameCount,
  setTimerIsRunning,
  setDisplay,
}) => {
  socket.on("connect", () => {
    const roomIDCached = JSON.parse(localStorage.getItem("roomID"));
    console.log(`cookies:${cookies}, cookies.username:${cookies.username}`);
    if (cookies && roomIDCached) {
      // console.log("I was previously known as ", cookies.name);
      setRoomID(roomIDCached);
      socket.emit("join room", { username: cookies.username, number: Number(roomIDCached) });
    }
  });

  socket.on("player left", (username) => {
    console.log(`${username} has left the room.`);
    setOpponentName(null);
    setOpponentResult(null);
    setFinish(null);
  });

  socket.on("connect_error", () => {
    setTimeout(() => socket.connect(), 5000);
  });

  socket.on("new player", (name) => {
    console.log("New player joined: ", name);
    const tempScore = JSON.parse(localStorage.getItem("score")) || score;
    console.log("sending score:", tempScore);
    setOpponentName(name);
    setOpponentReady(false);
    setPlayerReady(false);
    setOpponentResult({ points: 0, correct: 0, total: 0 });
    socket.emit("opponentScore", { score: { userID: cookies.username, ...tempScore }, roomID });
  });

  socket.on("currentSettings", (settings) => {
    console.log(settings);
    setGameSettings(settings);
  });

  socket.on("game questions", (questionsList) => {
    setQuestions(questionsList);
    localStorage.setItem("questions", JSON.stringify(questionsList));
    setScore({ points: 0, correct: 0, total: 0 });
    setFinish(null);
    setPreGameCount(null);
    setDisplay("0");
    setTimerIsRunning(true);
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

  socket.on("pre game countdown", (count) => {
    setPreGameCount(count);
  });

  socket.on("pre game finished", () => {
    setPreGameCount(null);
  });

  socket.on("end game", () => {
    localStorage.clear();
    setTimerIsRunning(false);
    setPlayerReady(false);
    setClock(0);
    setFinish("Game over");
    setTotalTime(null);
    setQuestions(null);
  });

  // socket.on("finish", () => {
  //   localStorage.clear();
  //   setTimerIsRunning(false);
  //   setClock(0);
  //   setFinish("Game over");
  //   setTotalTime(null);
  //   setQuestions(null);
  // });

  socket.on("pause", () => {
    setTimerIsRunning(false);
    setDisplay("PAUSED");
  });

  socket.on("resume", () => {
    setDisplay("0");
    setTimerIsRunning(true);
  });

  socket.on("opponent ready", ({ opponentReady, userReady = null }) => {
    setOpponentReady(opponentReady);
    if (userReady) {
      setPlayerReady(userReady);
    }
  });

  socket.on("opponentResponses", (opponentResponses) => {
    setOpponentResponses(opponentResponses);
  });

  socket.on("opponentScore", (score) => {
    setOpponentResult(score);
  });

  socket.on("opponent disconnect", (username) => {
    setOpponentName(null);
    setOpponentResult(null);
    console.log(`${username} disconnected.`);
  });

  socket.on("disconnect", () => {
    socket.emit("opponent disconnect", { username: cookies.username, roomID });
    console.log("Disconnected");
    localStorage.clear();
  });
};

module.exports = { socketLoad };
