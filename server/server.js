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
  },
}); //in case server and client run on different urls
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const DB_PASSWORD = process.env.DB_PASS;
const uri = `mongodb+srv://dpirrott:${DB_PASSWORD}@personalprojectsdb.i8bpvzf.mongodb.net/?retryWrites=true&w=majority`;
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
    } catch (e) {}
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
});

let currentUsers = [];
let gameSettings = {
  difficulty: 1,
  testDuration: 60,
  totalQuestions: 20,
};
let pauseState = false;
let endState = false;
const TOTAL_TIME = 20;

io.on("connection", (socket) => {
  console.log("client connected: ", socket.id);

  socket.join("clock-room");

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

  socket.on("opponentResponses", (responses) => {
    console.log("Opponents current responses:", responses);
    socket.broadcast.emit("opponentResponses", responses);
  });

  socket.on("requestSettings", () => {
    io.to(socket.id).emit("currentSettings", gameSettings);
  });

  socket.on("updateGameSettings", (newSettings) => {
    console.log("new settings:", newSettings);
    gameSettings = { ...newSettings };
  });

  socket.on("opponentScore", (result) => {
    console.log(result);
    socket.broadcast.emit("opponentScore", result);
  });

  socket.on("start game", () => {
    const { difficulty, testDuration, totalQuestions } = gameSettings;
    let count = testDuration;
    endState = false;
    pauseState = false;
    const questions = generateQuestions(totalQuestions, difficulty);
    io.to("clock-room").emit("game questions", questions);
    io.to("clock-room").emit("game timer", count, count);
    let timer = setInterval(() => {
      if (!pauseState) {
        count--;
      }
      if (endState) {
        clearInterval(timer);
        io.to("clock-room").emit("game timer", 0);
        io.to("clock-room").emit("finish", "Game over");
        endState = false;
      } else if (count === 0) {
        clearInterval(timer);
        io.to("clock-room").emit("game timer", count);
        io.to("clock-room").emit("finish", "Game over");
      } else {
        io.to("clock-room").emit("game timer", count);
      }
    }, 1000);
  });

  socket.on("end game", () => {
    endState = true;
    socket.broadcast.emit("end game");
  });

  socket.on("pause", () => {
    pauseState = true;
    socket.broadcast.emit("pause");
  });

  socket.on("resume", () => {
    pauseState = false;
    socket.broadcast.emit("resume");
  });

  socket.on("disconnect", (reason) => {
    console.log(reason);
    socket.broadcast.emit("opponent disconnect");
    const prevUsers = currentUsers.filter((user) => user.socketID !== socket.id);
    console.log("Remaining players:", prevUsers);
    currentUsers = prevUsers;
  });
});

setInterval(() => {
  io.to("clock-room").emit("time", new Date());
}, 1000);

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", PORT);
});
