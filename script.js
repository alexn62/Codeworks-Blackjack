let counter = 0;
const card = val => {
    let cornerVal = $("<div>");
    cornerVal.text(val);
    cornerVal.addClass("cornerval");
    
    let centerVal = $("<div>");
    centerVal.text(val);
    centerVal.addClass("centerval");
    
    let cornerValBottom = $("<div>");
    cornerValBottom.text(val);
    cornerValBottom.addClass("cornervalbottom");

    

    let card = $("<div>").addClass("card").html(cornerVal).append(centerVal).append(cornerValBottom);
    
    counter++;
    return card;
}
    
const getCard = () => {
    $("#playerCards").append(card('A'));

}
let hitBtn = document.getElementById("hit");
hitBtn.addEventListener("click", getCard);