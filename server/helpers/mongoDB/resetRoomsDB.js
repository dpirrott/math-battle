module.exports = async (roomsCollection) => {
  try {
    // Remove any lingering room data from previous server instance
    await roomsCollection.deleteMany({});

    for (let i = 1; i <= 5; i++) {
      await roomsCollection.insertOne({
        room: i,
        connectedUsers: [],
        gameStatus: { endState: false, pauseState: false },
        gameSettings: { difficulty: 1, testDuration: 60, totalQuestions: 20 },
      });
    }
    // console.log(result);
  } catch (e) {
    console.log(e);
  }
};
