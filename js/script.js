// Get values from localStorage
const playerName = localStorage.getItem("playername");
const score = localStorage.getItem("score");
const currentGame = localStorage.getItem("score"); // current deck, players and computer deck, and player and computer count

// Getting dom elements
const playerNameElement = document.querySelector("#playername");
const playerCount = document.querySelector("#playerCount");
const computerCount = document.querySelector("#computerCount");

// Playbuttons
const hitButton = document.querySelector("#hitButton");
const standButton = document.querySelector("#standButton");
const dealButton = document.querySelector("#dealButton");

// Scoreboard
const wins = document.querySelector("#playername");
const draws = document.querySelector("#playername");
const losses = document.querySelector("#playername");

const setup = () => {
  // set playername
  playerNameElement.textContent = playerName;
};

// Hit: pick a random card from the deck
// Stand: you don't pick a card and the computer can play
// Deal: you restart that session

// store initial deck of card in an array
// Hearts, Spades, Clubs, Diamond : 1 - 13
// How do we pick a radom card from the deck
// get the current lenght of the deck and pick a random number in that range. get the card at that index.
// remove the card at that index.

// Add the card to the user stack and calculate user count.

setup();
