const getUserAndOpponentScores = (username, winner, loser) => {
  const user = winner.name === username ? winner : loser;
  const opponent = winner.name === username ? loser : winner;
  return [user, opponent];
};

module.exports = { getUserAndOpponentScores };
