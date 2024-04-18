const express = require("express");
const mysql = require("mysql");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL Connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "memory game", // Changed to match database name
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log("Connected to database as id " + connection.threadId);
});

// Middleware to parse request body

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve HTML file
app.get("/formular", (req, res) => {
  res.sendFile(__dirname + "/formulär.html");
});

// Handle sign-up POST request
app.post("/formular/signup", (req, res) => {
  const { username, password } = req.body;

  // Insert user into database
  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  connection.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error("Error signing up user: " + err.message);
      // Handle the error, maybe show an error message on the sign-up page
      res.status(500).send("Error signing up user");
      return;
    }
    console.log("User signed up successfully");
    // Redirect to the sign-up success page
    res.redirect("/success");
  });
});

// Route for sign-up success page
app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Correct creation of HTTP server
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'public' directory
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("revealCards", (data) => {
    const { firstCard, secondCard } = data;

    const match = firstCard === secondCard;

    socket.emit("revealCards", { match });
  });

  socket.on("revealCards", (data) => {
    setTimeout(() => {
      firstCard.classList.remove("selected");
      secondCard.classList.remove("selected");
      if (data.match) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
      } else {
        // If cards don't match, flip them back after a delay
        setTimeout(() => {
          firstCard.classList.remove("selected");
          secondCard.classList.remove("selected");
          firstCard.textContent = "";
          secondCard.textContent = "";
        }, 1000);
      }
      firstCard = null;
      secondCard = null;
    }, 1000);
  });

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

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
