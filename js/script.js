// Get values from localStorage
const playerName = localStorage.getItem("playername");
let score = JSON.parse(localStorage.getItem("score"));
let currentGame = JSON.parse(localStorage.getItem("currentGame")); // current deck, players and computer deck, and player and computer count
let result = localStorage.getItem("result");

// Getting dom elements
const playerNameElement = document.querySelector("#playername");
const playerCountElement = document.querySelector("#playerCount");
const computerCountElement = document.querySelector("#computerCount");
const playerBoard = document.querySelector("#player-board");
const computerBoard = document.querySelector("#computer-board");
const modal = document.querySelector("#modal");
const resultElement = document.querySelector("#result");
const exitButton = document.querySelector("#exit");

// Playbuttons
const hitButton = document.querySelector("#hitButton");
const standButton = document.querySelector("#standButton");
const dealButton = document.querySelector("#dealButton");

// Scoreboard
const winsElements = document.querySelectorAll(".wins");
const drawsElements = document.querySelectorAll(".draws");
const lossesElements = document.querySelectorAll(".losses");

// sounds
const swish = new Audio("../assets/sounds/swish.mp3");
const cash = new Audio("../assets/sounds/cash.mp3");
const aww = new Audio("../assets/sounds/aww.mp3");
const applause = new Audio("../assets/sounds/applause.mp3");

let currentDeck,
  player,
  computer,
  playerCount,
  playerDeck,
  computerCount,
  computerDeck,
  wins,
  draws,
  losses;

function getInitalDeck() {
  let deck = [];
  let shapes = ["H", "D", "S", "C"];
  let values = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  values.forEach((value) => {
    shapes.forEach((shape) => {
      deck.push(`${value}${shape}`);
    });
  });

  return deck;
}

function closeModal() {
  modal.classList.remove("show");
}

function setCurrentGame() {
  if (currentGame) {
    playerCount = currentGame.player.count;
    playerDeck = currentGame.player.deck;
    computerCount = currentGame.computer.count;
    computerDeck = currentGame.computer.deck;
    currentDeck = currentGame.deck;
  } else {
    playerCount = 0;
    playerDeck = [];
    computerCount = 0;
    computerDeck = [];
    currentDeck = getInitalDeck();
    currentGame = {
      player: {
        count: playerCount,
        deck: playerDeck,
      },
      computer: {
        count: computerCount,
        deck: computerDeck,
      },
      deck: currentDeck,
    };
  }

  playerCountElement.textContent = playerCount;
  if (playerCount === "BUST!") {
    playerCountElement.classList.add("bust");
  }
  computerCountElement.textContent = computerCount;
  if (computerCount === "BUST!") {
    computerCountElement.classList.add("bust");
  }

  // populate screen with card
  playerDeck.forEach((card) => addCard(card, "player", false));
  computerDeck.forEach((card) => addCard(card, "computer", false));
}

function setScores() {
  wins = wins ? wins : score?.wins ?? 0;
  draws = draws ? draws : score?.draws ?? 0;
  losses = losses ? losses : score?.losses ?? 0;

  winsElements.forEach((element) => (element.textContent = wins));
  drawsElements.forEach((element) => (element.textContent = draws));
  lossesElements.forEach((element) => (element.textContent = losses));
}

function setup() {
  // set playername
  playerNameElement.textContent = playerName;

  // setCurrentGame
  setCurrentGame();

  // set scores
  setScores();
}

function getCardValue(card, player) {
  let value = card[0];
  if (["J", "K", "Q"].includes(value) || card.includes("10")) {
    value = 10;
  } else if (value === "A") {
    if (player === "player") {
      value = playerCount + 11 > 21 ? 1 : 11;
    } else {
      value = computerCount + 11 > 21 ? 1 : 11;
    }
  } else {
    value = Number(value);
  }

  return value;
}

function disablePlayerEvents() {
  hitButton.disabled = true;
  standButton.disabled = true;
  dealButton.disabled = true;
}
function enablePlayerEvents() {
  hitButton.disabled = false;
  standButton.disabled = false;
  dealButton.disabled = false;
}

function getRandomCard() {
  // get random card from current deck
  let randomIndex = Math.floor(Math.random() * currentDeck.length);
  let randomCard = currentDeck[randomIndex];
  currentDeck = currentDeck.filter((_, index) => index !== randomIndex);

  return randomCard;
}

function updateState(card, player) {
  // Populate card to screen

  // update user count and deck
  let randomCardValue = getCardValue(card, player);

  if (player === "player") {
    playerCount += randomCardValue;
    playerDeck.push(card);

    if (playerCount > 21) {
      playerCount = "BUST!";
      playerCountElement.classList.add("bust");

      disablePlayerEvents();
      setTimeout(() => {
        stand();
      }, 500);
    }
    playerCountElement.textContent = playerCount;
  } else {
    computerCount += randomCardValue;
    computerDeck.push(card);

    if (computerCount > 21) {
      computerCount = "BUST!";
      computerCountElement.classList.add("bust");
    }
    computerCountElement.textContent = computerCount;
  }
}

function evaluateWinner() {
  if (playerCount === computerCount) {
    result = "draw";
    draws++;
  } else if (
    (playerCount === "BUST!" && Boolean(Number(computerCount))) ||
    computerCount > playerCount
  ) {
    result = "lose";
    losses++;
  } else if (
    (computerCount === "BUST!" && Boolean(Number(playerCount))) ||
    computerCount < playerCount
  ) {
    result = "win";
    wins++;
  }
  setScores();
  localStorage.setItem("score", JSON.stringify({ wins, draws, losses }));
  localStorage.setItem("result", result);
  if (result === "win") {
    resultElement.textContent = "YOU WON!";
    resultElement.className = "win";
    applause.play();
  } else if (result === "lose") {
    resultElement.textContent = "YOU LOST!";
    resultElement.className = "lose";
    aww.play();
  } else {
    resultElement.textContent = "DRAW!";
    resultElement.className = "draw";
  }

  modal.classList.add("show");
}

function updateLocalStore() {
  const currentGame = {
    player: {
      count: playerCount,
      deck: playerDeck,
    },
    computer: {
      count: computerCount,
      deck: computerDeck,
    },
    deck: currentDeck,
  };
  localStorage.setItem("currentGame", JSON.stringify(currentGame));
}

function hit() {
  const card = getRandomCard();
  addCard(card, "player", true);
  updateState(card, "player");
  updateLocalStore();
}

async function stand() {
  disablePlayerEvents();

  const computerPlayLoop = await setInterval(() => {
    const card = getRandomCard();
    addCard(card, "computer", true);
    updateState(card, "computer");
    if (
      playerCount === "BUST!" ||
      computerCount > playerCount ||
      computerCount === "BUST!" ||
      (computerCount === playerCount && computerCount > 16)
    ) {
      clearInterval(computerPlayLoop);
      updateLocalStore();
      // Evaluate winner

      setTimeout(() => {
        evaluateWinner();
      }, 500);
    }
  }, 1500);
}

function deal() {
  // Clear cards on screen
  playerDeck = [];
  computerDeck = [];
  currentDeck = getInitalDeck();
  result = "";
  localStorage.setItem("result", result);

  playerCount = 0;
  playerCountElement.textContent = 0;
  playerCountElement.classList.remove("bust");
  computerCount = 0;
  computerCountElement.textContent = 0;
  computerCountElement.classList.remove("bust");

  updateLocalStore();
  enablePlayerEvents();
  clearScreen();
}

setup();

function addCard(card, player, playSound = true) {
  let imageName = "";
  let shape = card.slice(-1);
  let value = card.slice(0, -1);

  if (shape === "H") imageName += "hearts";
  else if (shape === "D") imageName += "diamond";
  else if (shape === "S") imageName += "spade";
  else imageName += "club";
  imageName += value;

  const cardImage = document.createElement("img");
  cardImage.src = `../assets/images/cards/${imageName}.png`;

  const wrap = document.createElement("div");
  wrap.classList.add("card");
  wrap.appendChild(cardImage);

  if (player === "player") {
    playerBoard.appendChild(wrap);
  } else {
    computerBoard.appendChild(wrap);
  }

  // if (playSound) {
  // }
  swish.play();
  console.log("playing swish");
}

function clearScreen() {
  playerBoard.replaceChildren();
  computerBoard.replaceChildren();
}

hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
dealButton.addEventListener("click", deal);
modal.addEventListener("click", () => {
  closeModal();
  deal();
});
exitButton.addEventListener("click", (e) => {
  e.stopPropagation();
  location.assign("/");
});

if (result) deal();

function preloadImages() {
  const allCards = getInitalDeck();
  allCards.forEach(async (card) => {
    let imageName = "";
    let shape = card.slice(-1);
    let value = card.slice(0, -1);

    if (shape === "H") imageName += "hearts";
    else if (shape === "D") imageName += "diamond";
    else if (shape === "S") imageName += "spade";
    else imageName += "club";
    imageName += value;

    const cardImage = document.createElement("img");
    cardImage.src = `../assets/images/cards/${imageName}.png`;
    cardImage.onload = () => {};
  });
}

preloadImages();
