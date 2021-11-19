const NUMBER_OF_DECKS = 1;

let playerCards = [];
let playerScores = [];
let finalPlayerScore = 0;

let dealerCards = [];
let dealerScores = [];

let deck = [];

let money = 10;
let BET = 10;

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

const createBackdrop = (titleText, description, okButtonOnly = false) => {
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
    if (!okButtonOnly) {
        let noButton = $("<button>");
        noButton.text("No");
        noButton.addClass("standbtn");
        noButton.click(hideBackDrop);
        buttonWrapper.append(noButton)
    }

    let yesButton = $("<button>");
    yesButton.text(okButtonOnly ? "Ok" : "Yes");
    yesButton.addClass("hitbtn");
    yesButton.click(playAgain);

    buttonWrapper.append(yesButton);
    modal.append(title).append(desc).append(buttonWrapper);
    backdrop.append(modal);

    $("body").prepend(backdrop);
};

const createCard = (card) => {
    let cornerVal = $("<div>");
    cornerVal.text(card.symbol);
    cornerVal.addClass(
        `cornerval ${card.color === "hearts" || card.color === "diamonds" ? "red" : "black"
        }`
    );

    let centerVal = $("<div>");
    centerVal.text(card.symbol);
    centerVal.addClass(
        `centerval ${card.color === "hearts" || card.color === "diamonds" ? "red" : "black"
        }`
    );

    let cornerValBottom = $("<div>");
    cornerValBottom.text(card.symbol);
    cornerValBottom.addClass(
        `cornervalbottom ${card.color === "hearts" || card.color === "diamonds" ? "red" : "black"
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
        `cornerval ${card.color === "hearts" || card.color === "diamonds" ? "red" : "black"
        }`
    );
    let color2 = color.clone();
    color2.addClass(
        `cornervalbottom ${card.color === "hearts" || card.color === "diamonds" ? "red" : "black"
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

const disableButtons = (hit, stand) => {
    $("#hit").prop("disabled", hit);
    $("#stand").prop("disabled", stand);
};

const updateScore = (card, player) => {
    player ? playerCards.push(card) : dealerCards.push(card);
    if (player) {
        playerScores = [playerCards.reduce((a, b) => a + b.val, 0)];
        if (playerCards.some((e) => e.symbol === "A")) {
            playerScores.push(playerScores[0] + 10);
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
    if (playerCards.length === 2 && playerScores[1] === 21) {
        $("#userScore").text(playerScores[1]);
        disableButtons(true, true);
        money += 2 * BET;
        $("#money").text(money);
        createBackdrop("Blackjack!", "You won! Play again?");
        return;
    }
    if (playerScores.every((e) => e > 21)) {
        $("#userScore").text("You bust.");
        disableButtons(true, true);
        money -= BET;
        $("#money").text(money);
        createBackdrop("You bust!", "You lost! Play again?");
        return;
    } else if (playerScores.some((e) => e < 22)) {
        if (playerScores.length > 1) {
            if (playerScores.some((e) => e > 21)) {
                finalPlayerScore = playerScores[0];
                $("#userScore").text(finalPlayerScore);
            } else {
                $("#userScore").text(`${playerScores.join(" or ")}`);
            }
        } else {
            finalPlayerScore = playerScores[0];
            $("#userScore").text(finalPlayerScore);
            return;
        }
    }
};



const dealerDraw = (first = false) => {
    const newCard = drawFromDeck();
    const card = createCard(newCard);
    $("#dealerCards").append(card);
    updateScore(newCard, false);
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
            $("#dealerScore").text(score);
            if (score === finalPlayerScore) {
                createBackdrop("Draw", "Play again?");
                return;
            }
            if (score < finalPlayerScore) {
                money += BET;
                $("#money").text(money);
                createBackdrop("You won!", " Play again?");
                return;
            }
            if (score > finalPlayerScore) {
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
    disableButtons(true, true);
    if (playerScores.length > 1) {
        if (playerScores.every((e) => e < 22)) {
            finalPlayerScore = playerScores[1];
            $("#userScore").text(finalPlayerScore);
        } else if (playerScores.some((e) => e > 21)) {
            finalPlayerScore = playerScores[0];
            $("#userScore").text(finalPlayerScore);
        }
    } else {
        finalPlayerScore = playerScores[0];
        $("#userScore").text(finalPlayerScore);
    }
    dealerDraw(false);
};

const startGame = () => {
    if (money <= 0) {
        createBackdrop('Whoops', 'You ran out of money. Please refresh to load up again 🤑🤑🤑', true);
        return;
    }
    if (BET > money) {

        createBackdrop('Whoops', 'Please decrease your bet', true);
        return;
    }
    hit();
    hit();
    dealerDraw(true);
    $("#hit").text('Hit');
    $("#hit").off().click(hit);
    $("#increaseBet").off();
    $("#decreaseBet").off();
    $("#stand").click(stand);
    disableButtons(false, false)

}

const resetGame = () => {

    $("#hit").text('Start');
    $("#hit").off().click(startGame);
    $("#stand").off();
    $("#playerCards").children().not(':first-child').remove();
    $("#dealerCards").children().not(':first-child').remove();
    resetCards();
    playerCards = [];
    playerScores = [];
    finalPlayerScore = 0;
    dealerCards = [];
    dealerScore = [];
    $("#userScore").text(finalPlayerScore);
    $("#dealerScore").text(dealerScore);
    $("#money").text(money);
    $("#decreaseBet").off().click(() => increaseBet(false));
    $("#increaseBet").off().click(() => increaseBet(true));
    disableButtons(false, true);
};

increaseBet = incr => {
    if (BET >= money && incr || BET <= 1 && !incr) return;
    incr ? BET += 1 : BET -= 1;
    $("#betSize").text(BET);
}



resetGame();
