const express = require("express");
const http = require("http"); // Correct import
const { Server } = require("socket.io"); // Correct import

const app = express();
const server = http.createServer(app); // Correct creation of HTTP server
const io = new Server(server); // Correct creation of Socket.IO server

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  // socket.on("revealCards", (data) => {
  //   const { firstCard, secondCard } = data;

  //   const match = firstCard === secondCard;

  //   socket.emit("revealCards", { match });
  // });

  socket.on("addText", () => {
    // Generate some sample text (you can customize this)
    console.log("hello");
    const newText = `Text added`;

    // Broadcast the added text to all other clients
    io.emit("textAdded", { text: newText });
  });

  socket.on("move", (data) => {
    // Broadcast the move to all other clients
    socket.broadcast.emit("move", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
