const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const cors = require("cors"); // Add cors middleware

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Use cors middleware
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));

io.on("connection", (socket) => {
  console.log("Socket On");
  socket.on("send-location", (data) => {
    io.emit("recieve-location", { id: socket.id, ...data });
  });
  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 8040; // Use environment variable for port

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
