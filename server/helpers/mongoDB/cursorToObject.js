const cursorToObject = (gamesListArr) => {
  const newObj = {};
  gamesListArr.forEach((room) => {
    newObj[room.room] = {
      connectedUsers: room.connectedUsers,
      gameStatus: room.gameStatus,
      gameSettings: room.gameSettings,
    };
  });
  return newObj;
};

module.exports = cursorToObject;
