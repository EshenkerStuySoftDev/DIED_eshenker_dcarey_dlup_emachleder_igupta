// Team DIED: Ethan Shenker, Ishita Gupta, Dragos Lup, Dean Carey, Ethan Macheleder
// SoftDev Pd 1
// P5 - This is the End
// 2021-06-05

// Setup initial variables to make life eaiser
var c = document.getElementById("board");
var mouseX;
var mouseY;

var scoreboard = document.getElementById("score");
var wd = c.width;
var ht = c.height;
var ctx = c.getContext("2d");
var requestid;

var numRows = 2;
var numCols = 2;


var brickSeparation = 4;
var brickHeight = 8;
var brickWidth = Math.floor( (wd - (numCols + 1) * brickSeparation) / numCols);
var brickYoffset = 70;

var paddleHeight = 10;
var paddleWidth = 60;
var paddleYoffset = 30;


var ballRadius = 15;
var vertVelocity = 4.0;
var horizVelocity = 2.0;

var paddle = [ (wd / 2) - (paddleWidth / 2) , ht - paddleHeight - paddleYoffset];
var ball = [wd / 2, ht / 2];
var bricks = []
var vx = horizVelocity;
var vy = vertVelocity;
var score = 0;
var result;

var done = false;

function clear() {
  ctx.clearRect(0, 0, c.width, c.height)
}

function createBricks() {
    var numBricks = 0;
    var row;
    var col;
    var extra = (wd / 2) - (((numCols * brickWidth) + ((numCols - 1) * brickSeparation)) / 2)
    for (row = 0; row < numRows; row++) {
        for (col = 0; col < numCols; col++) {
            ctx.fillRect(col * (brickWidth + brickSeparation) + extra, row * (brickHeight + brickSeparation) + brickYoffset, brickWidth, brickHeight)
            bricks[numBricks] = [col * (brickWidth + brickSeparation) + extra, row * (brickHeight + brickSeparation) + brickYoffset]
            numBricks++;
        };
    };
}

function createPaddle() {
    ctx.fillRect(paddle[0], paddle[1], paddleWidth, paddleHeight)
}

function createBall() {
    ctx.fillRect(ball[0], ball[1], ballRadius, ballRadius)
}

function setup() {
    createPaddle()
    createBall()
    createBricks()
    c.addEventListener("mouseover", go)
}


function movePaddle(x) {
    ctx.clearRect(paddle[0], paddle[1], paddleWidth, paddleHeight);
    paddle[0] = x - (paddleWidth / 2);
    ctx.fillRect(paddle[0], paddle[1], paddleWidth, paddleHeight)
}

function checkCollisions(x, y) {
    paddleXCor = paddle[0]
    paddleYCor = paddle[1]
    if (y+ballRadius >= paddleYCor && (x > paddleXCor && x < paddleXCor + paddleWidth)) {
        vy = -vy;
    }

    for(i = 0; i < bricks.length; i++) {
        brickXCor = bricks[i][0];
        brickYCor = bricks[i][1];
        if ( (x > brickXCor && x < brickXCor + brickWidth) && (y > brickYCor && y < brickYCor + brickHeight) ) {
            ctx.clearRect(brickXCor, brickYCor, brickWidth, brickHeight)
            console.log(brickXCor)
            vy = -vy
            bricks[i][0] = -100;
            bricks[i][1] = -100;
            score++;
            document.getElementById("score").innerText = score;
        }
    }
}

function checkWalls(x, y) {
    if (x < 0 || x + ballRadius > wd) {
        vx = -vx;
        return;
    }

    if (y < 0) {
        vy = -vy
        return;
    }
}

function moveBall(x, y) {
    ctx.clearRect(x, y, ballRadius, ballRadius)
    ball[0] = x+vx;
    ball[1] = y+vy;
    ctx.fillRect(ball[0], ball[1], ballRadius, ballRadius)
}

function go() {
    c.removeEventListener("mouseover", go)
    c.addEventListener("mousemove", e => {
        mouseX = e.offsetX;
        movePaddle(mouseX);
    })
    setTimeout(update, 100)
}

function checkEndGame(y) {
   if (y > ht) {
       done = true;
       window.cancelAnimationFrame(requestid)
       result = "Lost :(."
       return;
   }
   for (i = 0; i < bricks.length; i++) {
       if (bricks[i][0] > 0) {
           return;
       }
   }
   done = true;
   window.cancelAnimationFrame(requestid)
   result = "Won!"
   return;
}

function update() {
    if (!done) {
        var ballX = ball[0]
        var ballY = ball[1]

        //checkWalls(ballX, ballY)
        checkCollisions(ballX, ballY)
        checkWalls(ballX, ballY)
        checkEndGame(ballY)
        moveBall(ballX, ballY);
        requestID = window.requestAnimationFrame(update)
        
    } else {
        alert("Game over. You " + result + " Final Score of " + score)
    }
}