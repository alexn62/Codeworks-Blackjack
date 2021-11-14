const NUMBER_OF_DECKS = 4;

let userCards = [];
let playerScore = 0;
let dealerCards = [];
let dealerScore = 0;
let deck = [];
let dealerSecondCard;

let money = 100;
const BET = 10;

const resetCards = () => {
  deck = Array.from({ length: 52 * NUMBER_OF_DECKS }, (_, i) => {
    let newCard = {
      color:
        i < (52 * NUMBER_OF_DECKS) / 4
          ? "hearts"
          : i < (52 * NUMBER_OF_DECKS) / 2
          ? "spades"
          : i < (52 * NUMBER_OF_DECKS) / 2 + (52 * NUMBER_OF_DECKS) / 4
          ? "diamonds"
          : "clubs",
    };
    if ((i % 13) + 1 === 1) {
      newCard["symbol"] = "A";
      newCard["val"] = 11;
    } else if ((i % 13) + 1 === 11) {
      newCard["symbol"] = "J";
      newCard["val"] = 10;
    } else if ((i % 13) + 1 === 12) {
      newCard["symbol"] = "Q";
      newCard["val"] = 10;
    } else if ((i % 13) + 1 === 13) {
      newCard["symbol"] = "K";
      newCard["val"] = 10;
    } else {
      //   newCard["symbol"] = "A";
      newCard["symbol"] = ((i % 13) + 1).toString();
      //   newCard["val"] = 11;
      newCard["val"] = (i % 13) + 1;
    }
    return newCard;
  });
};

const drawFromDeck = () => {
  let random = Math.floor(Math.random() * deck.length);
  let drawnCard = deck[random];
  deck.splice(random, 1);
  return drawnCard;
};

const createCard = (card) => {
  let cornerVal = $("<div>");
  cornerVal.text(card.symbol);
  cornerVal.addClass(
    `cornerval ${
      card.color === "hearts" || card.color === "diamonds" ? "red" : "black"
    }`
  );

  let centerVal = $("<div>");
  centerVal.text(card.symbol);
  centerVal.addClass(
    `centerval ${
      card.color === "hearts" || card.color === "diamonds" ? "red" : "black"
    }`
  );

  let cornerValBottom = $("<div>");
  cornerValBottom.text(card.symbol);
  cornerValBottom.addClass(
    `cornervalbottom ${
      card.color === "hearts" || card.color === "diamonds" ? "red" : "black"
    }`
  );

  let color = $("<div>");
  color.text(
    card.color === "hearts"
      ? "♥"
      : card.color === "diamonds"
      ? "♦"
      : card.color === "spades"
      ? "♠"
      : "♣"
  );
  color.addClass(
    `cornerval ${
      card.color === "hearts" || card.color === "diamonds" ? "red" : "black"
    }`
  );
  let color2 = $("<div>");
  color2.text(
    card.color === "hearts"
      ? "♥"
      : card.color === "diamonds"
      ? "♦"
      : card.color === "spades"
      ? "♠"
      : "♣"
  );
  color2.addClass(
    `cornervalbottom ${
      card.color === "hearts" || card.color === "diamonds" ? "red" : "black"
    }`
  );

  const cardEl = $("<div>")
    .addClass("card")
    .append(cornerVal)
    .append(color)
    .append(centerVal)
    .append(color2)
    .append(cornerValBottom);
  return cardEl;
};

const disableButtons = () => {
  $("#hit").prop("disabled", true);
  $("#stand").prop("disabled", true);
};

const hit = () => {
  const newCard = drawFromDeck();
  const card = createCard(newCard);
  $("#playerCards").append(card);
  userCards.push(newCard);
  let acesCount = 0;

  for (const el of userCards) {
    if (el.symbol === "A") {
      acesCount++;
    }
  }

  let userScore = [userCards.reduce((a, b) => a + b.val, 0)];

  if (userCards.length === 2 && userScore[0] === 21) {
    $("#userScore").text("Blackjack - You win!");
    setTimeout(() => {
      alert("BLACKJACK You win!!");
      money += 2 * BET;
      $("#money").text(money);
    }, 1);
    disableButtons();
    return;
  }

  for (let i = 1; i <= acesCount; i++) {
    userScore.push(userScore[0] - 10 * i);
  }

  let scores = userScore.filter((el) => el <= 21);
  playerScore =
    scores.length < 1 ? Math.min(...userScore) : Math.max(...scores);

  $("#userScore").text(
    `${scores.length < 1 ? Math.min(...userScore) : scores.join(" or ")}`
  );

  if (Math.min(...userScore) > 21) {
    setTimeout(() => {
      alert("You bust");
      money -= BET;
      $("#money").text(money);
    }, 1);
    disableButtons();
  }
};

const dealerDraw = (first = false) => {
  const newCard = drawFromDeck();
  const card = createCard(newCard);
  $("#dealerCards").append(card);
  dealerCards.push(newCard);
  let acesCount = 0;

  for (const el of dealerCards) {
    if (el.symbol === "A") {
      acesCount++;
    }
  }

  let dealerScore = [dealerCards.reduce((a, b) => a + b.val, 0)];

  if (dealerCards.length === 2 && dealerScore[0] === 21) {
    $("#dealerScore").text("Blackjack - You lose :(");
    setTimeout(() => {
      alert("BLACKJACK You lose :9");
      money -= BET;
      $("#money").text(money);
    }, 1);
    disableButtons();
    return;
  }

  for (let i = 1; i <= acesCount; i++) {
    dealerScore.push(dealerScore[0] - 10 * i);
  }

  let scores = dealerScore.filter((el) => el <= 21);

  $("#dealerScore").text(
    `${scores.length < 1 ? Math.min(...dealerScore) : scores.join(" or ")}`
  );

  if (Math.min(...dealerScore) > 21) {
    setTimeout(() => {
      alert("Dealer bust");
      money += BET;
      $("#money").text(money);
    }, 1);
    disableButtons();
    return;
  }
  if (Math.min(...dealerScore) < 17 && first === false) {
    setTimeout(() => {
      dealerDraw();
    }, 1000);
  }
  if (Math.min(...dealerScore) >= 17) {
    setTimeout(() => {
      alert(
        `${
          Math.min(...dealerScore) == playerScore
            ? "Draw"
            : Math.min(...dealerScore) < playerScore
            ? "You win"
            : "You lose"
        }`
      );
    }, 1);
    disableButtons();
    Math.min(...dealerScore) == playerScore
      ? (money += 0)
      : Math.min(...dealerScore) < playerScore
      ? (money += BET)
      : money - +BET;
    $("#money").text(money);

    return;
  }
};

let hitBtn = document.getElementById("hit");
hitBtn.addEventListener("click", hit);

const resetGame = () => {
  $("#playerCards").empty();
  $("#dealerCards").empty();
  resetCards();
  userCards = [];
  userScore = 0;
  dealerCards = [];
  dealerScore = 0;
  $("#userScore").text(userScore);
  $("#dealerScore").text(dealerScore);
  $("#money").text(money);

  $("#hit").prop("disabled", false);
  $("#stand").prop("disabled", false);
  dealerDraw(true);
  hit();
  hit();
};

let resetBtn = document.getElementById("reset");
resetBtn.addEventListener("click", resetGame);

const stand = () => {
  $("#hit").prop("disabled", true);
  $("#stand").prop("disabled", true);
  dealerDraw(false);
};

let standBtn = document.getElementById("stand");
standBtn.addEventListener("click", stand);

// initialize game

resetGame();
