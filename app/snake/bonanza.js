// Team Candian Owls: Karl Hernandez, Dragos, Arib
// SoftDev
// K30 -- JSorcery
// 2021-05-15

// Setup inital variables to make life eaiser
var c = document.getElementById("board");
var scoreboard = document.getElementById("score");
var wd = c.width;
var ht = c.height;
var ctx = c.getContext("2d");


var requestID;
// the body of the snake with it being located roughtly around the center of the canvas
var snek = [
            [wd/2, ht/2], 
            [(wd/2)-(wd/50), ht/2], 
            [(wd/2)-2*(wd/50), ht/2], 
            [(wd/2)-3*(wd/50), ht/2],
            [(wd/2)-4*(wd/50), ht/2]
        ];

// the fruit which the snek eats
var fruit = null;

// direction
var dx = wd/50;
var dy = 0;

var turning = false;

var score = 0;
ctx.strokeStyle = "black";

/// Drawing the snek for the first time
drawSnek();
DrawFruit();
// Basically the game -> reset the board -> redraw snek -> check if fruit is not collide -> play snak

document.addEventListener("keydown", change_direction);

function drawBoard() {

    if (snekCollide()) 
        return;
    turning = false;
    setTimeout(function OnTick(){
        //clearTimeout();
        ctx.clearRect(0,0,wd,ht);
        //DrawFruit();
        move_snake();
        //For Everything in the snek
        drawSnek();
        DrawFruit()

        //if (v[0] != 0 | v[1] != 0) {
        //        
        //    if (snekCollide()) gameEnd();
        //    else requestID = window.requestAnimationFrame(drawBoard); //Next Frame
        //}
        drawBoard();
    }, 100)
}

function move_snake(){
    snek.unshift([snek[0][0] + dx, snek[0][1] + dy]);
    if (!fruitCollide()){
        snek.pop();
    } else {
        FruitTesting();
    }
}

// Check for death
function snekCollide() {
    for (x = 4; x < snek.length; x++) { //Check if snek ran into itself
        if (snek[x][0] == snek[0][0] && snek[x][1] == snek[0][1]) {
            return true;
        }
    }
    console.log(snek[0][0]);
    //console.log(wd);
    //No idea why i have to do wd-wd/50, but it works that way.
    return (snek[0][0] <= 0 | snek[0][1] <= 0 | snek[0][0] >= (wd-wd/50) | snek[0][1] >= (ht-ht/50)); //Check if snake hit wall
}

// check for prey death
function fruitCollide() {
    if (fruit[0] == snek[0][0] & fruit[1] == snek[0][1]){
        score += 1;
        scoreboard.innerHTML = score;
        return true;
    }
    return false;
}

// draws a random fruit
function DrawFruit(){
    if (fruit == null) {
        FruitTesting();
    }
    ctx.fillStyle = "red";
    ctx.fillRect(fruit[0],fruit[1], wd/50, ht/50);
    ctx.strokeRect(fruit[0],fruit[1], wd/50, ht/50);
}

//The snake has very specific prefrences
function FruitTesting() {
    fruit = [Math.floor(Math.random()*51)*(wd/50),Math.floor(Math.random()*51)*(ht/50)];
    for (x = 1; x < snek.length; x++) {
        if (snek[x][0] == fruit[0] & snek[x][1] == fruit[1]) {
            FruitTesting();
            break;
        }
    }
}

// ends the game
function gameEnd() {
    window.cancelAnimationFrame(requestID); //End Animation
    requestID = null;
    snek = [[wd/2, ht/2], [(wd/2)-(wd/50), ht/2], [(wd/2)-2*(wd/50), ht/2], [(wd/2)-3*(wd/50), ht/2]]; //Reset Snek
    v = [0,0];
    score = 0;
    // clears timeout
    clearTimeout();
    // update the score
    scoreboard.innerHTML = score;
    fruit = null;
    ctx.clearRect(0,0,wd,ht);
    drawSnek();

}

function drawSnek() {
    ctx.fillStyle = "green";
    for (x = 0; x < snek.length; x++) {
        ctx.fillRect(snek[x][0],snek[x][1], wd/50, ht/50); //Redraw Starting Snek
        ctx.strokeRect(snek[x][0],snek[x][1], wd/50, ht/50);
    }
}

function change_direction(event){
    //console.log("I can hear you 1 ");
    if (turning) return;
    //console.log("I can hear you 2");
    turning = true;

    const movingUp = (dy === -wd/50);
    const movingDown = (dy === wd/50);
    const movingLeft = (dx === -wd/50);
    const movingRight = (dx === wd/50);
    //console.log(event.keyCode);
    if ((event.keyCode == 37 || event.keyCode == 65) && !movingRight){
        dx = -wd/50;
        dy = 0;
    }
    if ((event.keyCode == 38 || event.keyCode == 87) && !movingDown){
        dx = 0;
        dy = -wd/50;
    }
    if ((event.keyCode == 39 || event.keyCode == 68) && !movingLeft){
        dx = wd/50;
        dy = 0;
    }
    if ((event.keyCode == 40 || event.keyCode == 83) && !movingUp){
        dx = 0;
        dy = wd/50;
    }

}



// init game
drawBoard()