const express = require("express");
const router = express.Router();

module.exports = (gamesCollection, name) => {
  router.get("/gameHistory", async (req, res) => {
    const username = req.query.username;
    try {
      const gameHistory = await gamesCollection
        .find(
          {
            "$or": [
              { "winner.name": username },
              { "loser.name": username },
              { "users": { "$elemMatch": { "name": username } } },
            ],
          })
          .project( {"_id": 0} )
          .toArray();
      console.log(gameHistory);
      res.status(200).json(gameHistory);
    } catch (e) {
      console.error("Error", e);
      res.status(500).send("Something went wrong.");
    }
  });

  return router;
};
