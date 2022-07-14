const { generateQuestions } = require("../generateQuestions");
const cursorToObject = require("../mongoDB/cursorToObject");
const { clearInterval } = require("timers");

module.exports = (io, socket, roomsCollection, gamesCollection) => {
  socket.on("opponentResponses", ({ responses, roomID }) => {
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
      await roomsCollection.updateOne(
        { room: roomID },
        { $set: { gameSettings: { ...newSettings } } }
      );
      const gamesList = await roomsCollection.find({}).toArray();
      const gamesListObj = cursorToObject(gamesList);
      io.to(roomID).emit("currentSettings", gamesListObj[roomID].gameSettings);
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
    connectedUsers.find((user, i) => {
      if (user.username === username) {
        roomData.connectedUsers[i].ready = playerReady;
        const specificUserReady = `connectedUsers.${i}.ready`;
        roomsCollection.updateOne({ room: roomID }, { $set: { [specificUserReady]: playerReady } });
        return true;
      }
    });
    let readyCount = roomData.connectedUsers.filter((user) => user.ready === true).length;
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
          if (roomData.gameStatus.preGameState) {
            readyCount = roomData.connectedUsers.filter((user) => user.ready === true).length;
            console.log("ReadyCount:", readyCount);

            if (readyCount < 2) {
              clearInterval(timer);
              io.to(roomID).emit("pre game finished");
              await roomsCollection.updateOne(
                { room: roomID },
                { $set: { "gameStatus.preGameState": false } }
              );
              return;
            }

            io.to(roomID).emit("pre game countdown", count);

            if (count === 0) {
              roomsCollection.updateOne(
                { room: roomID },
                { $set: { "gameStatus.preGameState": false } }
              );
              roomData.gameStatus.preGameState = false;
              count = testDuration;
              io.to(roomID).emit("pre game finished");
              io.to(roomID).emit("game questions", {
                questions,
                gameSettings: roomData.gameSettings,
              });
              io.to(roomID).emit("game timer", count, count);
            }
          }
          if (roomData.gameStatus.endState) {
            clearInterval(timer);
            io.to(roomID).emit("game timer", 0);
            io.to(roomID).emit("finish", "Game over");
            roomsCollection.updateOne({ room: roomID }, { $set: { "gameStatus.endState": false } });
            roomsCollection.updateOne(
              { room: roomID },
              { $set: { "gameStatus.pauseState": false } }
            );
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
        io.to(socket.id).emit("opponent ready", {
          opponentReady: otherPlayer[0].ready,
          userReady: user[0].ready,
        });
      }
    } catch (e) {
      console.log("Error:", e);
    }
  });

  socket.on("player finished", async ({ roomID, username }) => {
    // Update users finish status in gamesList
    let roomData = await roomsCollection.findOne({ room: roomID });
    const connectedUsers = roomData.connectedUsers;
    console.log(`username ${username}, finished: true`);
    connectedUsers.find((user, i) => {
      if (user.username === username) {
        roomData.connectedUsers[i].finish = true;
        const specificUserFinished = `connectedUsers.${i}.finish`;
        roomsCollection.updateOne({ room: roomID }, { $set: { [specificUserFinished]: true } });
        return true;
      }
    });
    console.log(roomData.connectedUsers);
    let finishCount = roomData.connectedUsers.filter((user) => user.finish === true).length;
    console.log("FinishCount:", finishCount);

    if (finishCount > 1) {
      roomData.connectedUsers = connectedUsers.map((user) => {
        return { ...user, finish: false, ready: false };
      });
      roomData.gameStatus.endState = true;
      console.log(roomData);
      try {
        io.to(roomID).emit("end game");
        await roomsCollection.replaceOne({ room: roomID }, roomData);
      } catch (e) {
        console.log("Error:", e);
      }
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

  socket.on("store game details", async ({ gameDetails, roomID }) => {
    try {
      if (!gameDetails.gameSettings) {
        const roomData = await roomsCollection.findOne({ room: roomID });
        gameDetails = {
          ...gameDetails,
          gameSettings: roomData.gameSettings,
        };
      }
      console.log(gameDetails);
      gamesCollection.insertOne(gameDetails);
    } catch (e) {
      console.log("Error", e);
    }
  });

  socket.on("pause", async (roomID) => {
    try {
      io.to(roomID).emit("pause");
      await roomsCollection.updateOne(
        { room: roomID },
        { $set: { "gameStatus.pauseState": true } }
      );
    } catch (e) {
      console.log("Error:", e);
    }
  });

  socket.on("resume", async (roomID) => {
    try {
      io.to(roomID).emit("resume");
      await roomsCollection.updateOne(
        { room: roomID },
        { $set: { "gameStatus.pauseState": false } }
      );
    } catch (e) {
      console.log("Error:", e);
    }
  });
};
