const NUMBER_OF_DECKS = 4;

let playerCards = [];
let playerScore = 0;

let dealerCards = [];
let dealerScore = 0;

let deck = [];

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
      newCard["val"] = 1;
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
      newCard["symbol"] = ((i % 13) + 1).toString();
      newCard["val"] = (i % 13) + 1;
    }
    return newCard;
  });
};

const drawFromDeck = () => {
  // select a random card from the deck, remove it from the deck, and then return the card
  let random = Math.floor(Math.random() * deck.length);
  let drawnCard = deck[random];
  deck.splice(random, 1);
  return drawnCard;
};

const hideBackDrop = () => {
  $("#backdr").remove();
};

const playAgain = () => {
  hideBackDrop();
  resetGame();
};

const createBackdrop = (titleText, description) => {
  let backdrop = $("<div>");
  backdrop.attr("id", "backdr");
  backdrop.addClass("backdrop");

  let modal = $("<div>");
  modal.addClass("modal");

  let title = $("<h1>");
  title.text(titleText);
  let desc = $("<p>");
  desc.text(description);

  let buttonWrapper = $("<div>");
  buttonWrapper.addClass("playAgainButtons");

  let noButton = $("<button>");
  noButton.text("No");
  noButton.addClass("standbtn");
  noButton.click(hideBackDrop);

  let yesButton = $("<button>");
  yesButton.text("Yes");
  yesButton.addClass("hitbtn");
  yesButton.click(playAgain);

  buttonWrapper.append(noButton).append(yesButton);
  modal.append(title).append(desc).append(buttonWrapper);
  backdrop.append(modal);

  $("body").prepend(backdrop);
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
  let color2 = color.clone();
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

const disableButtons = (bool) => {
  $("#hit").prop("disabled", bool);
  $("#stand").prop("disabled", bool);
};

const updateScore = (card, player) => {
  player ? playerCards.push(card) : dealerCards.push(card);
  if (player) {
    playerScore = [playerCards.reduce((a, b) => a + b.val, 0)];
    if (playerCards.some((e) => e.symbol === "A")) {
      playerScore.push(playerScore[0] + 10);
    }
  } else {
    dealerScore = [dealerCards.reduce((a, b) => a + b.val, 0)];
    if (dealerCards.some((e) => e.symbol === "A")) {
      dealerScore.push(dealerScore[0] + 10);
    }
  }
};

const hit = () => {
  const newCard = drawFromDeck();
  const card = createCard(newCard);
  $("#playerCards").append(card);
  updateScore(newCard, true);
  if (playerCards.length === 2 && playerScore[1] === 21) {
    $("#userScore").text(playerScore[1]);
    disableButtons(true);
    money += 2 * BET;
    $("#money").text(money);
    createBackdrop("Blackjack!", "You won! Play again?");
    return;
  }
  if (playerScore.every((e) => e > 21)) {
    $("#userScore").text("You bust.");
    disableButtons(true);
    money -= BET;
    $("#money").text(money);
    createBackdrop("You bust!", "You lost! Play again?");
    return;
  } else if (playerScore.some((e) => e < 22)) {
    if (playerScore.length > 1) {
      if (playerScore.some((e) => e > 21)) {
        $("#userScore").text(playerScore[0]);
        playerScore = playerScore[0];
      } else {
        $("#userScore").text(`${playerScore.join(" or ")}`);
      }
    } else {
      playerScore = playerScore[0];
      $("#userScore").text(playerScore);
      return;
    }
  }
};



const dealerDraw = (first = false) => {
  const newCard = drawFromDeck();
  const card = createCard(newCard);
  $("#dealerCards").append(card);
  updateScore(newCard,false);
  if (!first) {
    if (dealerScore.every((e) => e > 21)) {
      $("#dealerScore").text("Dealer bust.");
      money += BET;
      $("#money").text(money);
      createBackdrop("Dealer bust!", "You won! Play again?");
      return;
    }
    if (
      dealerScore.every((e) => e < 17) ||
      (dealerScore.some((e) => e < 17) && dealerScore.some((e) => e > 21))
    ) {
      $("#dealerScore").text(dealerScore.filter((e) => e < 22).join(" or "));
      setTimeout(() => {
        dealerDraw();
      }, 1000);
    }
    if (dealerScore.some((e) => e < 22 && e > 16)) {
      let score = dealerScore.filter((e) => e < 22 && e > 16)[0];
      console.log('Dealer: ', score, ' Player: ',playerScore);
      $("#dealerScore").text(score);
      if (score === playerScore) {
        createBackdrop("Draw", "Play again?");
        return;
      }
      if (score < playerScore) {
        money += BET;
        $("#money").text(money);
        createBackdrop("You won!", " Play again?");
        return;
      }
      if (score > playerScore) {
        money -= BET;
        $("#money").text(money);
        createBackdrop("You lost!", "Play again?");
        return;
      }
    }
  } else {
    if (dealerScore.length > 1) {
      $("#dealerScore").text(dealerScore.join(" or "));
    } else {
      $("#dealerScore").text(dealerScore[0]);
    }
  }
};




const stand = () => {
  disableButtons(true);
  if (playerScore.length > 1) {
    if (playerScore.every((e) => e < 22)) {
      $("#userScore").text(playerScore[1]);
      playerScore = playerScore[1];
    } else if (playerScore.some((e) => e > 21)) {
      playerScore = playerScore[0];
      $("#userScore").text(playerScore[0]);
    }
  } else {
    $("#userScore").text(playerScore);
  }
  dealerDraw(false);
};

const resetGame = () => {
  $("#playerCards").empty();
  $("#dealerCards").empty();
  resetCards();
  playerCards = [];
  playerScore = [];
  dealerCards = [];
  dealerScore = [];
  $("#userScore").text(userScore);
  $("#dealerScore").text(dealerScore);
  $("#money").text(money);

  disableButtons(false);
  dealerDraw(true);
  hit();
  hit();
};

$("#hit").click(hit);
$("#stand").click(stand);
$("#reset").click(resetGame);


// initialize game

resetGame();
