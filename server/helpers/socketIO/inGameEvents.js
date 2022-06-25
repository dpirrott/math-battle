const { generateQuestions } = require("../generateQuestions");
const cursorToObject = require("../mongoDB/cursorToObject");
const { clearInterval } = require("timers");

module.exports = (io, socket, roomsCollection) => {
  socket.on("opponentResponses", ({ responses, roomID }) => {
    console.log("Opponents current responses:", responses);
    socket.broadcast.to(roomID).emit("opponentResponses", responses);
  });

  socket.on("requestSettings", async (roomID) => {
    const gamesList = await roomsCollection.find({}).toArray();
    const gamesListObj = cursorToObject(gamesList);
    io.to(roomID).emit("currentSettings", gamesListObj[roomID].gameSettings);
  });

  socket.on("updateGameSettings", async ({ newSettings, roomID }) => {
    try {
      console.log("new settings:", newSettings);
      await roomsCollection.updateOne({ room: roomID }, { $set: { gameSettings: { ...newSettings } } });
      const gamesList = await roomsCollection.find({}).toArray();
      const gamesListObj = cursorToObject(gamesList);
      socket.broadcast.to(roomID).emit("updateRooms", gamesListObj);
    } catch (e) {
      console.log("Error:", e);
    }
  });

  socket.on("opponentScore", ({ score, roomID }) => {
    console.log(score);
    socket.broadcast.to(roomID).emit("opponentScore", score);
  });

  socket.on("player ready", async ({ username, roomID, playerReady }) => {
    // Update users ready status in gamesList
    let roomData = await roomsCollection.findOne({ room: roomID });
    const connectedUsers = roomData.connectedUsers;
    console.log(`username ${username}, playerReady ${playerReady}`);
    connectedUsers.find((user, i) => {
      if (user.username === username) {
        roomData.connectedUsers[i].ready = playerReady;
        const specificUserReady = `connectedUsers.${i}.ready`;
        roomsCollection.updateOne({ room: roomID }, { $set: { [specificUserReady]: playerReady } });
        return true;
      }
    });
    console.log(roomData.connectedUsers);
    const readyCount = roomData.connectedUsers.filter((user) => user.ready === true).length;
    console.log("ReadyCount:", readyCount);

    // Let opponent know ready status of current user
    socket.broadcast.to(roomID).emit("opponent ready", { opponentReady: playerReady });

    if (readyCount > 1) {
      const { difficulty, testDuration, totalQuestions } = roomData.gameSettings;
      let count = 3;
      roomData.gameStatus.endState = false;
      roomData.gameStatus.pauseState = false;
      roomData.gameStatus.preGameState = true;
      await roomsCollection.replaceOne({ room: roomID }, roomData);
      const questions = generateQuestions(totalQuestions, difficulty);
      io.to(roomID).emit("pre game countdown", count);

      let timer = setInterval(async () => {
        try {
          roomData = await roomsCollection.findOne({ room: roomID });
          if (!roomData.gameStatus.pauseState) {
            count--;
          }
          if (roomData.gameStatus.preGameState && count > 0) {
            io.to(roomID).emit("pre game countdown", count);
          } else if (roomData.gameStatus.preGameState && count === 0) {
            roomsCollection.updateOne({ room: roomID }, { $set: { "gameStatus.preGameState": false } });
            roomData.gameStatus.preGameState = false;
            count = testDuration;
            io.to(roomID).emit("pre game finished");
            io.to(roomID).emit("game questions", questions);
            io.to(roomID).emit("game timer", count, count);
          }
          if (roomData.gameStatus.endState) {
            clearInterval(timer);
            io.to(roomID).emit("game timer", 0);
            io.to(roomID).emit("finish", "Game over");
            roomsCollection.updateOne({ room: roomID }, { $set: { "gameStatus.endState": false } });
            roomsCollection.updateOne({ room: roomID }, { $set: { "gameStatus.pauseState": false } });
          } else if (count === 0) {
            clearInterval(timer);
            io.to(roomID).emit("game timer", count);
            io.to(roomID).emit("end game");
          } else if (!roomData.gameStatus.preGameState) {
            io.to(roomID).emit("game timer", count);
          }
        } catch (e) {
          console.log("Timer error", e);
        }
      }, 1000);
    }
  });

  socket.on("request ready status", async ({ roomID, username }) => {
    try {
      const roomData = await roomsCollection.findOne({ room: roomID });
      const otherPlayer = roomData.connectedUsers.filter((user) => {
        console.log(`user.username: ${user.username}, username: ${username}`);
        return user.username !== username;
      });
      console.log("Otherplayer:", otherPlayer);
      if (otherPlayer.length > 0) {
        const user = roomData.connectedUsers.filter((user) => user.username === username);
        console.log("USER:", user);
        io.to(socket.id).emit("opponent ready", { opponentReady: otherPlayer[0].ready, userReady: user[0].ready });
      }
    } catch (e) {
      console.log("Error:", e);
    }
  });

  socket.on("end game", async (roomID) => {
    try {
      io.to(roomID).emit("end game");
      await roomsCollection.updateOne({ room: roomID }, { $set: { "gameStatus.endState": true } });
    } catch (e) {
      console.log("Error:", e);
    }
  });

  socket.on("pause", async (roomID) => {
    try {
      io.to(roomID).emit("pause");
      await roomsCollection.updateOne({ room: roomID }, { $set: { "gameStatus.pauseState": true } });
    } catch (e) {
      console.log("Error:", e);
    }
  });

  socket.on("resume", async (roomID) => {
    try {
      io.to(roomID).emit("resume");
      await roomsCollection.updateOne({ room: roomID }, { $set: { "gameStatus.pauseState": false } });
    } catch (e) {
      console.log("Error:", e);
    }
  });
};
