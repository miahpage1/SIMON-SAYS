const startButton = document.querySelector(".js-start-button");
const statusSpan = document.querySelector(".js-status");
const heading = document.querySelector(".js-heading");
const padContainer = document.querySelector(".js-pad-container");


let computerSequence = [];
let playerSequence = [];
let maxRoundCount = 0;
let roundCount = 0;


const pads = [
  {
    color: "red",
    selector: document.querySelector(".js-pad-red"),
    sound: new Audio("../assets/simon-says-sound-1.mp3"),
  },
  {
    color: "green",
    selector: document.querySelector(".js-pad-green"),
    sound: new Audio("../assets/simon-says-sound-2.mp3"),
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio("../assets/simon-says-sound-3.mp3"),
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio("../assets/simon-says-sound-4.mp3"),
  },
];



function startButtonHandler() {
  setLevel(); // Set level of the game
  roundCount = 1; // Start at round 1
  startButton.classList.add("hidden"); // Hide start button
  statusSpan.classList.remove("hidden"); // Show status
  playComputerTurn(); // Start game with computer's turn
}

function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;

  const pad = pads.find((pad) => pad.color === color);
  if (pad) {
    pad.sound.play();
    checkPress(color); // Check if the pressed pad matches the expected color in the sequence
  }
}


function setLevel(level = 1) {
  switch (level) {
    case 1:
      maxRoundCount = 8;
      break;
    case 2:
      maxRoundCount = 14;
      break;
    case 3:
      maxRoundCount = 20;
      break;
    case 4:
      maxRoundCount = 31;
      break;
    default:
      console.error("Please enter level 1, 2, 3, or 4");
      break;
  }
}

function getRandomItem(collection) {
  if (collection.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * collection.length);
  return collection[randomIndex];
}

function setText(element, text) {
  element.textContent = text;
}

function activatePad(color) {
  const pad = pads.find((pad) => pad.color === color);
  pad.selector.classList.add("activated");
  pad.sound.play();

  setTimeout(() => {
    pad.selector.classList.remove("activated");
  }, 500); // Light duration in milliseconds
}

function activatePads(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => {
      activatePad(color);
    }, index * 600); // Delay each activation by 600 milliseconds
  });
}

function playComputerTurn() {
  padContainer.classList.add("unclickable"); // Prevent player from clicking pads during computer's turn
  setText(statusSpan, "The computer's turn...");
  setText(heading, `Round ${roundCount} of ${maxRoundCount}`);

  const randomColor = getRandomItem(["red", "green", "blue", "yellow"]);
  computerSequence.push(randomColor);
  activatePads(computerSequence);

  setTimeout(() => {
    playHumanTurn(); // After showing the sequence, start the player's turn
  }, computerSequence.length * 600 + 1000); // Time to wait before player's turn starts
}

  const randomColor = getRandomItem(["red", "green", "blue", "yellow"]);
  computerSequence.push(randomColor);
  activatePads(computerSequence);

  setTimeout(() => playHumanTurn(), computerSequence.length * 600 + 1000);
}

function playHumanTurn() {
  padContainer.classList.remove("unclickable");
  setText(statusSpan, `Your turn! Repeat the sequence.`);
  setText(heading, `Round ${roundCount} of ${maxRoundCount}`);
  playerSequence = []; // Reset player's sequence

function checkPress(color) {
  playerSequence.push(color); // Add pressed color to player's sequence
  const index = playerSequence.length - 1;
  const remainingPresses = computerSequence.length - playerSequence.length;
  setText(statusSpan, `Presses left: ${remainingPresses}`);

  // Check if the pressed color matches the expected color in the sequence
  if (computerSequence[index] !== playerSequence[index]) {
    resetGame("Oops! Wrong sequence. Game over.");
    return;
  }

  // If player has completed the sequence
  if (remainingPresses === 0) {
    checkRound();
  }
}
  

function checkRound() {
  if (playerSequence.length === maxRoundCount) {
    resetGame("Congratulations! You won!");
  } else {
    roundCount++;
    setText(statusSpan, "Nice! Keep going!");
    setTimeout(() => playComputerTurn(), 1000);
  }
}

function resetGame(text) {
  alert(text);
  setText(heading, "Simon Says");
  startButton.classList.remove("hidden");
  statusSpan.classList.add("hidden");
  padContainer.classList.add("unclickable");

  computerSequence = [];
  playerSequence = [];
  roundCount = 0;
}



startButton.addEventListener("click", startButtonHandler);
padContainer.addEventListener("click", padHandler);
