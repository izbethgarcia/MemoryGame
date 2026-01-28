
const board = document.getElementById("gameBoard");
const movesText = document.getElementById("moves");
const timeText = document.getElementById("time");
const message = document.getElementById("message");
const difficulty = document.getElementById("difficulty");
const restart = document.getElementById("restart");


let cards = [];
let firstCard = null;
let secondCard = null;
let moves = 0;
let matches = 0;
let time = 0;
let timer;



function createCards(pairCount) {
  const symbols = ["❤️","💖","💘","💕","💝","🌹","😍","😘","💌","🥰","💞","😻"];
  let chosen = symbols.slice(0, pairCount);

  let result = chosen.concat(chosen).map(symbol => {
    return { symbol: symbol, matched: false };
  });

  return result.sort(() => Math.random() - 0.5);
}


function drawBoard(columns) {
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${columns}, 80px)`;

  for (let i = 0; i < cards.length; i++) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.dataset.index = i;
    cardDiv.addEventListener("click", flip);
    board.appendChild(cardDiv);
  }
}


function flip(event) {
  const index = event.target.dataset.index;
  const card = cards[index];

  if (card.matched || event.target.classList.contains("flipped")) {
    return;
  }

  event.target.textContent = card.symbol;
  event.target.classList.add("flipped");

  if (firstCard === null) {
    firstCard = { card, element: event.target };
  } else {
    secondCard = { card, element: event.target };
    moves++;
    movesText.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  if (firstCard.card.symbol === secondCard.card.symbol) {
    firstCard.card.matched = true;
    secondCard.card.matched = true;
    firstCard.element.classList.add("matched");
    secondCard.element.classList.add("matched");
    matches++;
    resetTurn();

    if (matches === cards.length / 2) {
      endGame();
    }
  } else {
    setTimeout(() => {
      firstCard.element.textContent = "";
      secondCard.element.textContent = "";
      firstCard.element.classList.remove("flipped");
      secondCard.element.classList.remove("flipped");
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
}


function startTimer() {
  clearInterval(timer);
  time = 0;
  timeText.textContent = time;

  timer = setInterval(() => {
    time++;
    timeText.textContent = time;
  }, 1000);
}

function endGame() {
  clearInterval(timer);
  message.textContent = "🎉 Game Over!";
}


function startGame() {
  moves = 0;
  matches = 0;
  movesText.textContent = 0;
  message.textContent = "";

  let pairs = 8;
  let columns = 4;

  if (difficulty.value === "medium") {
    pairs = 10;
    columns = 5;
  }

  if (difficulty.value === "hard") {
    pairs = 12;
    columns = 6;
  }

  cards = createCards(pairs);
  drawBoard(columns);
  startTimer();
}

restart.addEventListener("click", startGame);
difficulty.addEventListener("change", startGame);

startGame();