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
    sound: new Audio("https://github.com/kchia/simon-says-sounds/blob/main/simon-says-sound-1.mp3?raw=true")
  },
  {
    color: "blue",
    selector: document.querySelector(".js-pad-blue"),
    sound: new Audio("https://github.com/kchia/simon-says-sounds/blob/main/simon-says-sound-2.mp3?raw=true")
  },
  {
    color: "green",
    selector: document.querySelector(".js-pad-green"),
    sound: new Audio("https://github.com/kchia/simon-says-sounds/blob/main/simon-says-sound-3.mp3?raw=true")
  },
  {
    color: "yellow",
    selector: document.querySelector(".js-pad-yellow"),
    sound: new Audio("https://github.com/kchia/simon-says-sounds/blob/main/simon-says-sound-4.mp3?raw=true")
  }
];


function startButtonHandler() {
  setLevel();
  roundCount = 1; 
  startButton.classList.add("hidden");
  statusSpan.classList.remove("hidden");
  playComputerTurn();
}
startButton.addEventListener("click", startButtonHandler);

function setLevel(level = 1) {
  switch (level) {
    case 1:
      maxRoundCount = 5;
      break;
    case 2:
      maxRoundCount = 6;
      break;
    case 3:
      maxRoundCount = 7;
      break;
    case 4:
      maxRoundCount = 8;
      break;
    default:
      return "Please enter level 1, 2, 3, or 4";
  }
  return maxRoundCount;
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
  const pad = pads.find(pad => pad.color === color);
  if (!pad) return;
  pad.sound.currentTime = 0;
  pad.sound.play();
  pad.selector.classList.add('active');
  setTimeout(() => {
    pad.selector.classList.remove('active');
  }, 300);
}

function activatePads(sequence) {
  let delay = 0;
  sequence.forEach((color, index) => {
    setTimeout(() => {
      activatePad(color);
    }, delay);
    delay += 600;
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
  setText(statusSpan, `Your turn: ${maxRoundCount - playerSequence.length} presses left`);
}

function padHandler(event) {
  const { color } = event.target.dataset;
  if (!color) return;
  activatePad(color);
  playerSequence.push(color);
  checkPress(color);
}

function checkPress(color) {
  const index = playerSequence.length - 1;
  const remainingPresses = computerSequence.length - playerSequence.length;
  setText(statusSpan, `Your turn: ${remainingPresses} presses left`);

  if (computerSequence[index] !== playerSequence[index]) {
    resetGame("Game Over! You made a mistake.");
    return;
  }

  if (remainingPresses === 0) {
    setTimeout(checkRound, 1000);
  }
}

function checkRound() {
  if (currentRound < totalRounds) {
    currentRound++;
    console.log(`Advanced to round ${currentRound}`);
  } else {
    console.log("Congratulations! You have completed all rounds of the game.");
   
  }
}

function endGame() {
  resetGame('Game over! You made a mistake.');
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
