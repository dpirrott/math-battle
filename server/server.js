const express = require("express");
const bcrypt = require("bcrypt");
const socketIo = require("socket.io");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const bodyParser = require("body-parser");
const http = require("http");
const { clearInterval } = require("timers");
const { generateQuestions } = require("./helpers/generateQuestions");
const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  },
}); //in case server and client run on different urls

const registerJoinLeaveEvents = require("./helpers/socketIO/joinLeaveEvents");

const { MongoClient, ServerApiVersion } = require("mongodb");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { json } = require("body-parser");
const DB_PASSWORD = process.env.DB_PASS;
const uri = `mongodb+srv://dpirrott:${DB_PASSWORD}@personalprojectsdb.i8bpvzf.mongodb.net/?retryWrites=true&w=majority`;
const resetRoomCollection = require("./helpers/mongoDB/resetRoomsDB");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  next();
});

let currentUsers = [];
app.set("trust proxy", 1); // trust first proxy

app.use(
  session({
    secret: "nothing to see here folks",
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
    cookie: {
      maxAge: 1000 * 120 * 60,
      sameSite: "lax",
      secure: false,
    },
    store: MongoStore.create({
      mongoUrl: uri,
      ttl: 60 * 60,
      autoRemove: "native",
    }),
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  if (err) return console.error(err);
  console.log("Connected to Database");
  const db = client.db("mentalMathBattle");
  const usersCollection = db.collection("users");
  const roomsCollection = db.collection("rooms");

  resetRoomCollection(roomsCollection);

  app.post("/register", async (req, res) => {
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

  app.post("/login", async (req, res) => {
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

  app.post("/logout", (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.log("Failed to logout.");
          return res.status(400).json({ msg: "Something went wrong with logout." });
        }
        const prevUsers = currentUsers.filter((user) => user.name !== req.body.username);
        console.log("Remaining players:", prevUsers);
        currentUsers = prevUsers;
        return res.status(200).json({ msg: "Successfully logged out." });
      });
    } catch (e) {
      console.log("Failed to logout.");
      return res.status(400).json({ msg: "Something went wrong with logout." });
    }
  });

  app.get("/clearUsersDB", async (req, res) => {
    try {
      const result = await usersCollection.deleteMany({});
      console.log(result);
      res.status(200).send("Users collection successfully cleared!");
    } catch (e) {
      console.log(e);
    }
  });

  app.post("/validUsername", (req, res) => {
    // console.log("req.session.cookie: ", req.session.cookie);
    // console.log("req.session.username: ", req.session.username);
    // console.log("browser cookie.username:", req.body.username);
    if (req.session.username === req.body.username) {
      return res.json({ username: req.session.username });
    } else if (!req.body.username && req.session.cookie) {
      // console.log("Testing req.session.username", req.session.username);
      return res.json({ username: req.session.username });
    } else {
      req.session.destroy();
      res.clearCookie("connect.sid");
      return res.status(400).json({ msg: "Access denied. Please login.", username: "" });
    }
  });

  //SocketIO events
  io.on("connection", (socket) => {
    console.log("client connected: ", socket.id);

    registerJoinLeaveEvents(io, socket, roomsCollection);

    // console.log(socket);

    // socket.on("join room", ({ number, username }) => {
    //   console.log(`Number: ${number}, Username: ${username}`);
    //   socket.join(number);
    //   const connectedUsers = gamesList[number].connectedUsers;
    //   if (connectedUsers.find((player) => player.username === username)) {
    //     const otherUser = connectedUsers.filter((player) => player.username !== username);
    //     io.to(socket.id).emit("current players", { connectedUsers: otherUser, roomID: number });
    //     socket.broadcast.to(number).emit("new player", username);
    //     console.log(JSON.stringify(gamesList, null, " "));
    //     return;
    //   }
    //   if (connectedUsers.length < 2) {
    //     if (connectedUsers.length === 0) {
    //       //Reset game settings, fresh lobby
    //       gamesList[number].gameSettings = {
    //         difficulty: 1,
    //         testDuration: 60,
    //         totalQuestions: 20,
    //       };
    //     }
    //     io.to(socket.id).emit("current players", { connectedUsers, roomID: number });
    //     socket.broadcast.to(number).emit("new player", username);
    //     connectedUsers.push({ username, ready: false });
    //     io.emit("update rooms", gamesList);
    //     console.log(JSON.stringify(gamesList, null, " "));
    //   } else {
    //     io.to(socket.id).emit("current players", { connectedUsers, msg: `Room ${number} is full.` });
    //     io.to(socket.id).emit("update rooms", gamesList);
    //     console.log("Room is full");
    //     console.log(JSON.stringify(gamesList, null, " "));
    //   }
    // });

    // socket.on("leave room", ({ username, roomID }) => {
    //   socket.leave(roomID);
    //   const remainingPlayer = gamesList[roomID].connectedUsers.filter((player) => player.username !== username);
    //   console.log(remainingPlayer);
    //   gamesList = {
    //     ...gamesList,
    //     [roomID]: { connectedUsers: remainingPlayer, gameSettings: gamesList[roomID].gameSettings },
    //   };
    //   io.emit("update rooms", gamesList);
    //   if (remainingPlayer.length === 1) {
    //     socket.broadcast.to(roomID).emit("player left", username);
    //   }
    //   console.log("GamesList:", JSON.stringify(gamesList, null, " "));
    // });

    socket.on("request updated rooms", () => {
      io.to(socket.id).emit("update rooms", gamesList);
    });

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

    socket.on("opponentResponses", ({ responses, roomID }) => {
      console.log("Opponents current responses:", responses);
      socket.broadcast.to(roomID).emit("opponentResponses", responses);
    });

    socket.on("requestSettings", (roomID) => {
      io.to(roomID).emit("currentSettings", gamesList[roomID].gameSettings);
    });

    socket.on("updateGameSettings", ({ newSettings, roomID }) => {
      console.log("new settings:", newSettings);
      gamesList[roomID].gameSettings = { ...newSettings };
    });

    socket.on("opponentScore", ({ score, roomID }) => {
      console.log(score);
      socket.broadcast.to(roomID).emit("opponentScore", score);
    });

    socket.on("player ready", ({ username, roomID, playerReady }) => {
      // Update users ready status in gamesList
      const connectedUsers = gamesList[roomID].connectedUsers;
      const user = connectedUsers.find((user, i) => {
        if (user.username === username) {
          gamesList[roomID].connectedUsers[i].ready = playerReady;
          return true;
        }
      });
      const readyCount = connectedUsers.filter((user) => user.ready === true).length;

      console.log(JSON.stringify(gamesList, null, " "));
      console.log("readyCount", readyCount);

      if (readyCount > 1) {
        const { difficulty, testDuration, totalQuestions } = gamesList[roomID].gameSettings;
        let count = testDuration;
        gamesList[roomID].gameStatus.endState = false;
        gamesList[roomID].gameStatus.pauseState = false;
        const questions = generateQuestions(totalQuestions, difficulty);
        io.to(roomID).emit("game questions", questions);
        io.to(roomID).emit("game timer", count, count);
        let timer = setInterval(() => {
          if (!gamesList[roomID].gameStatus.pauseState) {
            count--;
          }
          if (gamesList[roomID].gameStatus.endState) {
            clearInterval(timer);
            io.to(roomID).emit("game timer", 0);
            io.to(roomID).emit("finish", "Game over");
            endState = false;
          } else if (count === 0) {
            clearInterval(timer);
            io.to(roomID).emit("game timer", count);
            io.to(roomID).emit("end game");
          } else {
            io.to(roomID).emit("game timer", count);
          }
        }, 1000);
      }
    });

    socket.on("end game", (roomID) => {
      gamesList[roomID].gameStatus.endState = true;
      io.to(roomID).emit("end game");
    });

    socket.on("pause", (roomID) => {
      gamesList[roomID].gameStatus.pauseState = true;
      io.to(roomID).emit("pause");
    });

    socket.on("resume", (roomID) => {
      gamesList[roomID].gameStatus.pauseState = false;
      io.to(roomID).emit("resume");
    });

    // socket.on("opponent disconnect", ({ username, roomID }) => {
    //   console.log(`${username} has logged out.`);
    //   socket.broadcast.to(roomID).emit("opponent disconnect", username);
    //   const remainingPlayer = gamesList[roomID].connectedUsers.filter((player) => player !== username);
    //   console.log(remainingPlayer);
    //   gamesList = {
    //     ...gamesList,
    //     [roomID]: { connectedUsers: remainingPlayer, gameSettings: gamesList[roomID].gameSettings },
    //   };
    //   io.emit("update rooms", gamesList);
    //   if (remainingPlayer.length === 1) {
    //     socket.broadcast.to(roomID).emit("player left", username);
    //   }
    // });

    // socket.on("disconnecting", () => {
    //   const currentRooms = [...socket.rooms];
    //   if (currentRooms.length > 1) {
    //     socket.broadcast.to(currentRooms[1]).emit("opponent disconnect");
    //   }
    //   console.log(currentRooms); // the Set contains at least the socket ID
    // });

    // socket.on("disconnect", (reason) => {
    //   io.emit("update rooms", gamesList);
    //   console.log(reason);
    // });
  });
});

let gamesList = {
  1: {
    connectedUsers: [],
    gameSettings: {
      difficulty: 1,
      testDuration: 60,
      totalQuestions: 20,
    },
    gameStatus: {
      endState: false,
      pauseState: false,
      // timerCount,
    },
  },
  2: {
    connectedUsers: [],
    gameSettings: {
      difficulty: 1,
      testDuration: 60,
      totalQuestions: 20,
    },
    gameStatus: {
      endState: false,
      pauseState: false,
      // timerCount,
    },
  },
  3: {
    connectedUsers: [],
    gameSettings: {
      difficulty: 1,
      testDuration: 60,
      totalQuestions: 20,
    },
    gameStatus: {
      endState: false,
      pauseState: false,
      // timerCount,
    },
  },
  4: {
    connectedUsers: [],
    gameSettings: {
      difficulty: 1,
      testDuration: 60,
      totalQuestions: 20,
    },
    gameStatus: {
      endState: false,
      pauseState: false,
      // timerCount,
    },
  },
  5: {
    connectedUsers: [],
    gameSettings: {
      difficulty: 1,
      testDuration: 60,
      totalQuestions: 20,
    },
    gameStatus: {
      endState: false,
      pauseState: false,
      // timerCount,
    },
  },
};

// setInterval(() => {
//   io.to("clock-room").emit("time", new Date());
// }, 1000);

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", PORT);
});
