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
const { v4: uuidv4 } = require("uuid");
const { MongoClient, ServerApiVersion } = require("mongodb");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const DB_PASSWORD = process.env.DB_PASS;
const uri = `mongodb+srv://dpirrott:${DB_PASSWORD}@personalprojectsdb.i8bpvzf.mongodb.net/?retryWrites=true&w=majority`;

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
      maxAge: 1000 * 60 * 60,
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
      console.log(user);
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
});

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

  socket.on("opponent disconnect", (username) => {
    console.log(`${username} has logged out.`);
    socket.broadcast.emit("opponent disconnect", username);
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
