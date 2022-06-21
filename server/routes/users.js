const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

module.exports = (usersCollection) => {
  router.post("/register", async (req, res) => {
    try {
      const { username, password, passwordConf } = req.body;
      if (!username || !password || !passwordConf) {
        return res.status(400).send("All fields must be populated.");
      } else if (password !== passwordConf) {
        return res.status(400).send("Password fields do not match.");
      }
      // generate salt to hash password
      const salt = await bcrypt.genSalt(10);
      // now we set user password to hashed password
      const hash = await bcrypt.hash(password, salt);
      const result = await usersCollection.insertOne({ username, password: hash });
      console.log(result);
      res.status(200).send("Successfully added user to db.");
    } catch (e) {
      console.error("Error", e);
      res.status(500).send("Something went wrong.");
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).send("All fields must be populated.");
      }
      const user = await usersCollection.findOne({ username: username });
      if (user) {
        const verifyPassword = await bcrypt.compare(password, user.password);
        if (verifyPassword) {
          req.session.username = username;
          // console.log(req);
          res.status(200).send("Valid password");
        } else {
          return res.status(400).send("Invalid password");
        }
      } else {
        res.status(401).send("User not found.");
      }
    } catch (e) {
      console.error("Error", e);
      res.status(500).send("Something went wrong.");
    }
  });

  router.post("/logout", (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.log("Failed to logout.");
          return res.status(400).json({ msg: "Something went wrong with logout." });
        }
        return res.status(200).json({ msg: "Successfully logged out." });
      });
    } catch (e) {
      console.log("Failed to logout.");
      return res.status(400).json({ msg: "Something went wrong with logout." });
    }
  });

  router.get("/clearUsersDB", async (req, res) => {
    try {
      const result = await usersCollection.deleteMany({});
      console.log(result);
      res.status(200).send("Users collection successfully cleared!");
    } catch (e) {
      console.log(e);
    }
  });

  router.post("/validUsername", (req, res) => {
    // console.log("req.session.cookie: ", req.session.cookie);
    // console.log("req.session.username: ", req.session.username);
    // console.log("browser cookie.username:", req.body.username);
    if (req.session.username === req.body.username || (!req.body.username && req.session.cookie)) {
      return res.json({ username: req.session.username });
    } else {
      req.session.destroy();
      res.clearCookie("connect.sid");
      return res.status(400).json({ msg: "Access denied. Please login.", username: "" });
    }
  });

  return router;
};
