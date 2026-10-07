const menu = document.getElementById("main-menu");
const game = document.getElementById("game-screen");

function toggleScreens() {
    menu.classList.toggle("hidden");
    game.classList.toggle("hidden");
}

document.getElementById("btn-start").onclick = () => {
    toggleScreens();
    initGame();
};

document.getElementById("btn-back").onclick = toggleScreens;

var score = 0;
var timeLeft = 180;
var timer = null;

function startTimer() {
    clearInterval(timer);
    document.getElementById("timer").innerText = timeLeft;
    timer = setInterval(function () {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(timer);
            alert("Hết giờ! Bạn đã thua");
        }
    }, 1000);
}

function addScore() {
    score += 10;
    document.getElementById("score").innerText = score;
}

function initGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    createBoardData();
    renderBoard();
    startTimer();
}












