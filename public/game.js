const socket = io();
const board = document.getElementById("tiles");
let firstCard = null;
let secondCard = null;
let turn = 0;

// Function to shuffle array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to create card elements
function createCard(value) {
  const card = document.createElement("div");
  card.className = "card";
  card.textContent = value;
  card.addEventListener("click", () => {
    if (turn === 0 && !card.classList.contains("selected")) {
      firstCard = card;
      card.classList.add("selected");
      turn = 1;
    } else if (
      turn === 1 &&
      card !== firstCard &&
      !card.classList.contains("selected")
    ) {
      secondCard = card;
      card.classList.add("selected");
      turn = 0;
      // Emit the chosen cards to the server
      socket.emit("revealCards", {
        firstCard: firstCard.textContent,
        secondCard: secondCard.textContent,
      });
    }
  });
  return card;
}

// Function to initialize the game
function initGame() {
  const values = [
    "A",
    "A",
    "B",
    "B",
    "C",
    "C",
    "D",
    "D",
    "E",
    "E",
    "F",
    "F",
    "G",
    "G",
    "H",
    "H",
  ];
  shuffle(values);
  values.forEach((value) => {
    const card = createCard(value);
    board.appendChild(card);
  });
}

// socket.on("revealCards", (data) => {
//   setTimeout(() => {
//     firstCard.classList.remove("selected");
//     secondCard.classList.remove("selected");
//     if (data.match) {
//       firstCard.classList.add("matched");
//       secondCard.classList.add("matched");
//     } else {
//       // If cards don't match, flip them back after a delay
//       setTimeout(() => {
//         firstCard.classList.remove("selected");
//         secondCard.classList.remove("selected");
//         firstCard.textContent = "";
//         secondCard.textContent = "";
//       }, 1000);
//     }
//     firstCard = null;
//     secondCard = null;
//   }, 1000);
// });

socket.on("move", (data) => {
  // Handle move event received from the server
  // Update the game state accordingly
});

// Add listener for textAdded event (if needed)
socket.on("textAdded", (data) => {
  // Handle text added event received from the server
  // Update the UI or game state accordingly
});



initGame();
