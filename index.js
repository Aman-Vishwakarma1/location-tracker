const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");
const cors = require("cors"); // Add cors middleware

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Allow requests from your Vercel deployment URL
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://location-tracker3-l9aswq5rq-amanvishwakarma1s-projects.vercel.app/"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// Use cors middleware with options
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8040;

app.get("/", (req, res) => {
  res.render("index");
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
