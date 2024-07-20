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

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Set up views directory for ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Handle "send-location" event
  socket.on("send-location", (data) => {
    io.emit("receive-location", { id: socket.id, ...data });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    io.emit("user-disconnected", socket.id);
    console.log("Socket disconnected:", socket.id);
  });
});

// Route for the index page
app.get("/", (req, res) => {
  res.render("index");
});

// Define port
const PORT = process.env.PORT || 8040;

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
