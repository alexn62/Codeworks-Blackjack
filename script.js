
let hearts = Array.from({length: 52}, (_, i)=> ((i%13)+1) === 1 ? "A" : ((i%13)+1) === 11 ? "J" : ((i%13)+1) === 12 ? "Q" : ((i%13)+1) === 13 ? "K" : ((i%13)+1).toString());
console.log(JSON.stringify(hearts));

let userScore = 0;

const getVal = val => val === "A" ? 11 : val === "J" || val === "Q" || val === "K" ? 10 : parseInt(val);

const card = () => {
    if (hearts.length === 0){
        return;
    }
    let random = Math.floor(Math.random() * (hearts.length));
    let val = hearts[random];
    hearts.splice(random, 1);
    let cornerVal = $("<div>");
    cornerVal.text(val);
    cornerVal.addClass(`cornerval ${random > hearts.length / 2 ? 'red': 'black'}`);
    
    let centerVal = $("<div>");
    centerVal.text(val);
    centerVal.addClass(`centerval ${random > hearts.length / 2 ? 'red': 'black'}`);
    
    let cornerValBottom = $("<div>");
    cornerValBottom.text(val);
    cornerValBottom.addClass(`cornervalbottom ${random > hearts.length / 2 ? 'red': 'black'}`);
    
    
    
    let card = $("<div>").addClass("card").html(cornerVal).append(centerVal).append(cornerValBottom);
    userScore+= getVal(val);
    $("#userScore").text(userScore);
    console.log(JSON.stringify(hearts));
    return card;
}
    
const getCard = () => {
    $("#playerCards").append(card());
}
let hitBtn = document.getElementById("hit");
hitBtn.addEventListener("click", getCard);