// get all needed elements
var startButton = document.getElementById("startgame");
var holes = document.querySelectorAll(".hole");
var mole = document.querySelector(".mole");
var score = document.getElementById("score");
var time = document.getElementById("time");

// set initial score to 0
var currentScore = 0;

// set initial time to 60 seconds
var currentTime = 10;

// the hole where the mole currently is
var moleHole;

// timer to move the mole
var Moletimer = null;

function showMole() {
    // if mole on any hole, remove it
    holes.forEach(hole => {
        hole.classList.remove("mole");
    });

    // select random hole for the mole (from 0 to 9)
    var randomHole = holes[Math.floor (Math.random() * 9)];

    // add mole to the random hole
    randomHole.classList.add("mole");
    moleHole = randomHole.id;

}

// listen for a click at each hole
holes.forEach( hole => {
    hole.addEventListener("click", () => {
        // if the hole clicked is where the mole is
        if (hole.id == moleHole) {
            // add one to the current score
            currentScore++;
            // update score
            score.innerHTML = currentScore;
            // reset the mole hole so user doesn't get extra points by clicking on the same mole multiple times
            moleHole = null;
        }
    })
})

function moveMole() {
    // move the mole every __ milliseconds
    Moletimer = setInterval(showMole, 1000); 
}

moveMole();

function timer() {
    // if time is up
    if (currentTime <= 0) {
        console.log("TIME")
        // stop the timer
        clearInterval(timeId);
        // stop moving the mole
        clearInterval(Moletimer);
        // display alert that game is over
        alert("Game Over! Final score: " + currentScore);
    }
    // decrease timer by 1 second
    if (currentTime > 0) {
        currentTime--;
    }
    // update the html
    time.innerHTML = "Time Remaining: " + currentTime;
}

// decrease timer every second
var timeId = setInterval(timer, 1000)
