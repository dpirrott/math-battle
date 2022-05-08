const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const { clearInterval } = require("timers");
const { generateQuestions } = require("./helpers/generateQuestions");
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
}); //in case server and client run on different urls

let currentUsers = [];

io.on("connection", (socket) => {
  console.log("client connected: ", socket.id);

  socket.join("clock-room");

  socket.on("new player", (player) => {
    socket.broadcast.emit("new player", player.name);
    io.to(player.socketID).emit("current players", currentUsers);
    if (player.socketID) {
      currentUsers.push(player);
    }
    console.log(currentUsers);
  });

  socket.on("playerAnswer", (answer) => {
    console.log("Player answered: ", answer);
    socket.broadcast.emit("playerAnswer", answer);
  });

  socket.on("opponentScore", (result) => {
    console.log(result);
    socket.broadcast.emit("opponentScore", result);
  });

  socket.on("start game", () => {
    let count = 3600;
    io.to("clock-room").emit("game timer", count);
    const questions = generateQuestions(60);
    io.to("clock-room").emit("game questions", questions);
    let timer = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(timer);
        io.to("clock-room").emit("game timer", count);
        io.to("clock-room").emit("finish", "Game over");
      } else {
        io.to("clock-room").emit("game timer", count);
      }
    }, 1000);
  });

  socket.on("disconnect", (reason) => {
    console.log(reason);
    socket.broadcast.emit("opponent disconnect");
    const prevUsers = currentUsers.filter(
      (user) => user.socketID !== socket.id
    );
    console.log("Remaining players:", prevUsers);
    currentUsers = prevUsers;
  });
});

setInterval(() => {
  io.to("clock-room").emit("time", new Date());
}, 1000);

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", PORT);
});
