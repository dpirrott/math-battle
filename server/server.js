const express = require("express");
const socketIo = require("socket.io");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const bodyParser = require("body-parser");
const http = require("http");
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

  const usersRoutes = require("./routes/users");
  app.use("/", usersRoutes(usersCollection));

  resetRoomCollection(roomsCollection);

  io.on("connection", (socket) => {
    console.log("client connected: ", socket.id);
    registerJoinLeaveEvents(io, socket, roomsCollection);
    registerInGameEvents(io, socket, roomsCollection);
  });
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Server running on Port ", PORT);
});
