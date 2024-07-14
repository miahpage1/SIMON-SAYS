/**
 * DOM SELECTORS
 */
const startButton = document.querySelector(".js-start-button");
const statusSpan = document.querySelector(".js-status");
const heading = document.querySelector(".js-heading");
const padContainer = document.querySelector(".js-pad-container");

/**
 * VARIABLES
 */
let computerSequence = [];
let playerSequence = [];
let maxRoundCount = 0;
let roundCount = 0;

/**
 * The `pads` array contains pad objects for each colored pad.
 * Each pad object includes `color`, `selector`, and `sound`.
 */
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

startButton.addEventListener("click", startButtonHandler);
padContainer.addEventListener("click", padHandler);

/**
 * EVENT HANDLERS
 */

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
    checkPress(color);
  }
}

/**
 * HELPER FUNCTIONS
 */

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
  }, 500);
}

function activatePads(sequence) {
  sequence.forEach((color, index) => {
    setTimeout(() => {
      activatePad(color);
    }, index * 600);
  });
}

function playComputerTurn() {
  padContainer.classList.add("unclickable");
  setText(statusSpan, "The computer's turn...");
  setText(heading, `Round ${roundCount} of ${maxRoundCount}`);

  const randomColor = getRandomItem(["red", "green", "blue", "yellow"]);
  computerSequence.push(randomColor);
  activatePads(computerSequence);

  setTimeout(() => playHumanTurn(), computerSequence.length * 600 + 1000);
}

function playHumanTurn() {
  padContainer.classList.remove("unclickable");
  setText(statusSpan, `Your turn! Repeat the sequence.`);
  setText(heading, `Round ${roundCount} of ${maxRoundCount}`);
  playerSequence = [];
}

function checkPress(color) {
  playerSequence.push(color);
  const index = playerSequence.length - 1;
  const remainingPresses = computerSequence.length - playerSequence.length;
  setText(statusSpan, `Presses left: ${remainingPresses}`);

  if (computerSequence[index] !== playerSequence[index]) {
    resetGame("Oops! Wrong sequence. Game over.");
    return;
  }

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
