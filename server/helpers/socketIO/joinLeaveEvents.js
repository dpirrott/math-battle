const cursorToObject = require("../mongoDB/cursorToObject");

module.exports = (io, socket, roomsCollection) => {
  socket.on("request updated rooms", async () => {
    const gamesList = await roomsCollection.find({}).toArray();
    const gamesListObj = cursorToObject(gamesList);
    io.to(socket.id).emit("update rooms", gamesListObj);
  });

  socket.on("join room", async ({ number, username }) => {
    socket.username = username;
    console.log(`Number: ${number}, Username: ${username}`);
    socket.join(number);
    const roomData = await roomsCollection.findOne({ room: number });
    console.log(roomData);
    const playerAlreadyInRoom = roomData.connectedUsers.find((player) => player.username === username);
    if (playerAlreadyInRoom) {
      const otherUser = roomData.connectedUsers.filter((player) => player.username !== username);
      io.to(socket.id).emit("current players", { connectedUsers: otherUser, roomID: number });
      socket.broadcast.to(number).emit("new player", username);
      return;
    }
    if (roomData.connectedUsers.length < 2) {
      if (roomData.connectedUsers.length === 0) {
        //Reset game settings, fresh lobby
        roomData.gameSettings = {
          difficulty: 1,
          testDuration: 60,
          totalQuestions: 20,
        };
      }
      io.to(socket.id).emit("current players", { connectedUsers: roomData.connectedUsers, roomID: number });
      socket.broadcast.to(number).emit("new player", username);
      roomData.connectedUsers.push({ username, ready: false });
      await roomsCollection.replaceOne({ room: number }, roomData);
    } else {
      io.to(socket.id).emit("current players", {
        connectedUsers: roomData.connectedUsers,
        msg: `Room ${number} is full.`,
      });
      console.log("Room is full");
    }
    const gamesList = await roomsCollection.find({}).toArray();
    const gamesListObj = cursorToObject(gamesList);
    console.log("GamesList:", gamesListObj);
    io.emit("update rooms", gamesListObj);
  });

  socket.on("leave room", async ({ username, roomID }) => {
    try {
      socket.leave(roomID);
      const roomData = await roomsCollection.findOne({ room: roomID });
      const remainingPlayer = roomData.connectedUsers.filter((player) => player.username !== username);
      console.log(remainingPlayer);
      roomData.connectedUsers = remainingPlayer;
      await roomsCollection.replaceOne({ room: roomID }, roomData);
      const gamesList = await roomsCollection.find({}).toArray();
      const gamesListObj = cursorToObject(gamesList);
      io.emit("update rooms", gamesListObj);
      if (remainingPlayer.length === 1) {
        socket.broadcast.to(roomID).emit("player left", username);
      }
      console.log("GamesList:", gamesListObj);
    } catch (e) {
      console.log("Error:", e);
    }
  });

  socket.on("opponent disconnect", async ({ username, roomID }) => {
    console.log(`${username} has logged out.`);
    socket.broadcast.to(roomID).emit("opponent disconnect", username);
    const roomData = await roomsCollection.findOne({ room: roomID });
    const remainingPlayer = roomData.connectedUsers.filter((player) => player.username !== username);
    console.log(remainingPlayer);
    roomData.connectedUsers = remainingPlayer;
    await roomsCollection.replaceOne({ room: roomID }, roomData);
    const gamesList = await roomsCollection.find({}).toArray();
    const gamesListObj = cursorToObject(gamesList);
    io.emit("update rooms", gamesListObj);
    if (remainingPlayer.length === 1) {
      socket.broadcast.to(roomID).emit("player left", username);
    }
  });

  socket.on("disconnecting", () => {
    const currentRooms = [...socket.rooms];
    if (currentRooms.length > 1) {
      socket.broadcast.to(currentRooms[1]).emit("opponent disconnect", socket.username);
    }
    console.log(currentRooms); // the Set contains at least the socket ID
  });

  socket.on("disconnect", async (reason) => {
    const gamesList = await roomsCollection.find({}).toArray();
    const gamesListObj = cursorToObject(gamesList);
    io.emit("update rooms", gamesListObj);
    console.log(reason);
  });
};
