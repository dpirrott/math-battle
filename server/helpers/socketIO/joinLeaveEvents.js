module.exports = (io, socket, gamesList) => {
  socket.on("join room", ({ number, username }) => {
    console.log(`Number: ${number}, Username: ${username}`);
    socket.join(number);
    const connectedUsers = gamesList[number].connectedUsers;
    if (connectedUsers.find((player) => player.username === username)) {
      const otherUser = connectedUsers.filter((player) => player.username !== username);
      io.to(socket.id).emit("current players", { connectedUsers: otherUser, roomID: number });
      socket.broadcast.to(number).emit("new player", username);
      console.log(JSON.stringify(gamesList, null, " "));
      return;
    }
    if (connectedUsers.length < 2) {
      if (connectedUsers.length === 0) {
        //Reset game settings, fresh lobby
        gamesList[number].gameSettings = {
          difficulty: 1,
          testDuration: 60,
          totalQuestions: 20,
        };
      }
      io.to(socket.id).emit("current players", { connectedUsers, roomID: number });
      socket.broadcast.to(number).emit("new player", username);
      connectedUsers.push({ username, ready: false });
      io.emit("update rooms", gamesList);
      console.log(JSON.stringify(gamesList, null, " "));
    } else {
      io.to(socket.id).emit("current players", { connectedUsers, msg: `Room ${number} is full.` });
      io.to(socket.id).emit("update rooms", gamesList);
      console.log("Room is full");
      console.log(JSON.stringify(gamesList, null, " "));
    }
  });

  socket.on("leave room", ({ username, roomID }) => {
    socket.leave(roomID);
    const remainingPlayer = gamesList[roomID].connectedUsers.filter((player) => player.username !== username);
    console.log(remainingPlayer);
    gamesList = {
      ...gamesList,
      [roomID]: { connectedUsers: remainingPlayer, gameSettings: gamesList[roomID].gameSettings },
    };
    io.emit("update rooms", gamesList);
    if (remainingPlayer.length === 1) {
      socket.broadcast.to(roomID).emit("player left", username);
    }
    console.log("GamesList:", JSON.stringify(gamesList, null, " "));
  });

  socket.on("opponent disconnect", ({ username, roomID }) => {
    console.log(`${username} has logged out.`);
    socket.broadcast.to(roomID).emit("opponent disconnect", username);
    const remainingPlayer = gamesList[roomID].connectedUsers.filter((player) => player !== username);
    console.log(remainingPlayer);
    gamesList = {
      ...gamesList,
      [roomID]: { connectedUsers: remainingPlayer, gameSettings: gamesList[roomID].gameSettings },
    };
    io.emit("update rooms", gamesList);
    if (remainingPlayer.length === 1) {
      socket.broadcast.to(roomID).emit("player left", username);
    }
  });

  socket.on("disconnecting", () => {
    const currentRooms = [...socket.rooms];
    if (currentRooms.length > 1) {
      socket.broadcast.to(currentRooms[1]).emit("opponent disconnect");
    }
    console.log(currentRooms); // the Set contains at least the socket ID
  });

  socket.on("disconnect", (reason) => {
    io.emit("update rooms", gamesList);
    console.log(reason);
  });
};
