// Get values from localStorage
const playerName = localStorage.getItem("playername");
let score = JSON.parse(localStorage.getItem("score"));
let currentGame = JSON.parse(localStorage.getItem("currentGame")); // current deck, players and computer deck, and player and computer count

console.log("currentGame", currentGame);

// Getting dom elements
const playerNameElement = document.querySelector("#playername");
const playerCountElement = document.querySelector("#playerCount");
const computerCountElement = document.querySelector("#computerCount");

// Playbuttons
const hitButton = document.querySelector("#hitButton");
const standButton = document.querySelector("#standButton");
const dealButton = document.querySelector("#dealButton");

// Scoreboard
const winsElement = document.querySelector("#wins");
const drawsElement = document.querySelector("#draws");
const lossesElement = document.querySelector("#losses");

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
    "1",
    "2",
    "3",
    "4",
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
  computerCountElement.textContent = computerCount;

  // populate screen with card
}

function setScores() {
  wins = score?.wins ?? 0;
  draws = score?.draws ?? 0;
  losses = score?.losses ?? 0;

  winsElement.textContent = wins;
  drawsElement.textContent = draws;
  lossesElement.textContent = losses;
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
  // dealButton.disabled = true;
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
      }, 2000);
    }
    playerCountElement.textContent = playerCount;
  } else {
    console.log();
    computerCount += randomCardValue;
    computerDeck.push(card);

    if (computerCount > 21) {
      computerCount = "BUST!";
      computerCountElement.classList.add("bust");
    }
    computerCountElement.textContent = computerCount;
  }
}

let result;

function evaluateWinner() {
  if (playerCount === computerCount) {
    result = "draw";
    draws++;
    drawsElement.textContent = draws;
  } else if (
    (playerCount === "BUST!" && Boolean(Number(computerCount))) ||
    computerCount > playerCount
  ) {
    result = "lose";
    losses++;
    lossesElement.textContent = losses;
  } else if (
    (computerCount === "BUST!" && Boolean(Number(playerCount))) ||
    computerCount < playerCount
  ) {
    result = "win";
    wins++;
    winsElement.textContent = wins;
  }
  localStorage.setItem("score", JSON.stringify({ wins, draws, losses }));
  console.log(result);
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
  console.log("currentGame", currentGame);
  localStorage.setItem("currentGame", JSON.stringify(currentGame));
}

function hit() {
  const card = getRandomCard();
  updateState(card, "player");
  updateLocalStore();
}

async function stand() {
  console.log("running stand>>>");
  disablePlayerEvents();

  const computerPlayLoop = await setInterval(() => {
    const card = getRandomCard();
    updateState(card, "computer");
    console.log("computer picked>>>", card);
    if (
      playerCount === "BUST!" ||
      computerCount > playerCount ||
      computerCount === "BUST!" ||
      (computerCount === playerCount && computerCount > 16)
    ) {
      clearInterval(computerPlayLoop);
      updateLocalStore();
      // Evaluate winner
      evaluateWinner();
    }
  }, 1500);

  // const card = getRandomCard();
  // updateState(card, "computer");
  // let loopCount = 0;
  // while (
  //   computerCount !== "BUST!" &&
  //   (computerCount < playerCount || computerCount < 17) &&
  //   playerCount !== "BUST!" &&
  //   loopCount < 10
  // ) {
  //   console.log("computer picked>>>", computerCount);
  //   setTimeout(() => {
  //     const card = getRandomCard();
  //     updateState(card, "computer");
  //     console.log("computer picked>>>", card);
  //   }, 1500);
  //   loopCount++;
  // }
}

function deal() {
  console.log("deal clicked>>>>");
  // Clear cards on screen
  playerDeck = [];
  computerDeck = [];
  currentDeck = getInitalDeck();

  playerCount = 0;
  playerCountElement.textContent = 0;
  computerCount = 0;
  computerCountElement.textContent = 0;

  updateLocalStore();
  enablePlayerEvents();
}

// Hit: pick a random card from the deck
// Stand: you don't pick a card and the computer can play
// Deal: you restart that session

// store initial deck of card in an array
// Hearts, Spades, Clubs, Diamond : 1 - 14
// How do we pick a radom card from the deck
// get the current lenght of the deck and pick a random number in that range. get the card at that index.
// remove the card at that index.

// Add the card to the user stack and calculate user count.

setup();

hitButton.addEventListener("click", hit);
standButton.addEventListener("click", stand);
dealButton.addEventListener("click", deal);
