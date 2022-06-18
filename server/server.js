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

const registerInGameEvents = require("./helpers/socketIO/inGameEvents");

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
    if (req.session.username === req.body.username || (!req.body.username && req.session.cookie)) {
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

    registerInGameEvents(io, socket, roomsCollection);

    socket.on("new player", (player) => {
      socket.broadcast.emit("new player", player.name);
      io.to(player.socketID).emit("current players", currentUsers);
      if (player.socketID) {
        currentUsers.push(player);
      }
      console.log(currentUsers);
    });
  });
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", PORT);
});
