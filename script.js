
const NUMBER_OF_DECKS = 4;


let userCards = [];
let playerScore = 0;
let dealerCards=[];
let dealerScore = 0;
let deck = [];

const resetCards = () => {
    deck = Array.from({ length: 13 * 4 * NUMBER_OF_DECKS }, (_, i) =>
        (i % 13) + 1 === 1
            ? "A"
            : (i % 13) + 1 === 11
                ? "J"
                : (i % 13) + 1 === 12
                    ? "Q"
                    : (i % 13) + 1 === 13
                        ? "K"
                        : ((i % 13) + 1).toString()
                        // : "A"
    );
};

const getVal = (val) =>
    val === "A"
        ? 11
        : val === "J" || val === "Q" || val === "K"
            ? 10
            : parseInt(val);

const drawFromDeck = () => {
    let random = Math.floor(Math.random() * deck.length);
    let val = deck[random];
    deck.splice(random, 1);
    return [val,random];
};

const createCard = (val,random) => {
    let cornerVal = $("<div>");
    cornerVal.text(val);
    cornerVal.addClass(
        `cornerval ${random > deck.length / 2 ? "red" : "black"}`
    );

    let centerVal = $("<div>");
    centerVal.text(val);
    centerVal.addClass(
        `centerval ${random > deck.length / 2 ? "red" : "black"}`
    );

    let cornerValBottom = $("<div>");
    cornerValBottom.text(val);
    cornerValBottom.addClass(
        `cornervalbottom ${random > deck.length / 2 ? "red" : "black"}`
    );

    let card = $("<div>")
        .addClass("card")
        .html(cornerVal)
        .append(centerVal)
        .append(cornerValBottom);
        return card;
}
const disableButtons = () =>{
    $("#hit").prop('disabled', true);
    $("#stand").prop('disabled', true);
}

const hit = () => {
    const [cardValue,randomValue] = drawFromDeck();
    const card = createCard(cardValue, randomValue);
    $("#playerCards").append(card);
    userCards.push(cardValue);

    let acesCount = 0;
    for (const el of userCards){
        if (el === 'A'){
            acesCount++;
        }
    }
    let userScore = [userCards.length != 0 ? parseInt(userCards.reduce((a,b)=> getVal(a)+getVal(b),0)) : 0];

    if (userCards.length === 2 && userScore[0]===21){
        setTimeout( ()=> { alert("BLACKJACK You win!!"); }, 1);
        disableButtons();
    }

    for (let i = 1; i <= acesCount; i++){
        userScore.push(userScore[0]-10*i);
    }

    let scores = userScore.filter(el => el <= 21);
    playerScore = scores.length < 1 ? Math.min(...userScore) : Math.max(...scores);
    $("#userScore").text(`${scores.length < 1 ? Math.min(...userScore) : scores.join(' or ')}`);
    if (Math.min(...userScore) > 21){
        setTimeout( ()=> { alert("You bust"); }, 1);
        disableButtons();

    }
};

const dealerDraw = (first=false) => {
    const [cardValue,randomValue] = drawFromDeck();
    const card = createCard(cardValue, randomValue);
    $("#dealerCards").append(card);
    dealerCards.push(cardValue);
    dealerScore = dealerCards.length != 0 ? parseInt(dealerCards.reduce((a,b)=> getVal(a)+getVal(b),0)) : 0;
    $("#dealerScore").text(dealerScore);
    if (first===false){
        if (dealerScore >= 17){
            setTimeout( ()=> { alert(`${dealerScore  > 21 ? 'Dealer bust! You win!' : dealerScore > playerScore ? 'Dealer wins :(' : dealerScore < playerScore ? 'You win!!' : 'Draw'}`); }, 10);
            return;
        }
        else{
            setTimeout( ()=> {  dealerDraw(false); }, 1000);
           
        }
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
    $("#hit").prop('disabled', false);
    $("#stand").prop('disabled', false);
    dealerDraw(true);
    hit();
};

let resetBtn = document.getElementById("reset");
resetBtn.addEventListener("click", resetGame);

const stand = ()=> {
    $("#hit").prop('disabled', true);
    $("#stand").prop('disabled', true);
    dealerDraw(false);
}

let standBtn = document.getElementById("stand");
standBtn.addEventListener("click", stand);

// initialize game

resetGame();

