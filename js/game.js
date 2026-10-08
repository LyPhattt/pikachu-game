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
var timeLeft = 300;
var timer = null;

function startTimer() {
    clearInterval(timer);
    document.getElementById("timer").innerText = timeLeft;
    timer = setInterval(function () {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;
        if(timeLeft <= 0) {
            showLoseModal();
        }
    }, 1000);
}

function addScore() {
    score += 10;
    document.getElementById("score").innerText = score;
}

function showWinModal() {
    clearInterval(timer);
    document.getElementById("win-score").innerText = score;
    document.getElementById("win-modal").classList.remove("hidden");
}
document.getElementById("btn-next").onclick = function() {
    document.getElementById("win-modal").classList.add("hidden");
    initGame();
};

function showLoseModal() {
    clearInterval(timer);
    document.getElementById("lose-score").innerText = score;
    document.getElementById("lose-modal").classList.remove("hidden");
}

document.getElementById("btn-retry").onclick = function() {
    document.getElementById("lose-modal").classList.remove("hidden");
    initGame();
}

function initGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    createBoardData();
    renderBoard();
    startTimer();
}












