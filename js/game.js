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

// Tinh time
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
    document.getElementById("lose-modal").classList.add("hidden");
    initGame();
}

var isPaused = false;
function pauseGame() {
    if(isPaused) return;
    isPaused = true;
    clearInterval(timer);
    document.getElementById("pause-modal").classList.remove("hidden"); //hien modal pause
}

function resumeGame() {
    if(!isPaused) return;
    isPaused = false;
    document.getElementById("pause-modal").classList.add("hidden"); // an? di
    startTimer();
}

document.getElementById("btn-pause").onclick = function () {
    pauseGame();
};
document.getElementById("btn-resume").onclick = function () {
    resumeGame();
};

document.getElementById("btn-pause-retry").onclick = function () {
    document.getElementById("pause-modal").classList.add("hidden");
    isPaused = false;
    initGame();
}

document.getElementById("btn-pause-menu").onclick = function () {
    document.getElementById("pause-modal").classList.add("hidden");
    isPaused = false;
    clearInterval(timer);
    toggleScreens(); //ve Menu chinh
}

var hint = 5;
var hintTimeout = null;
function findHint() {
    for (var r1 = 1; r1 <= 8; r1++) {
        for (var c1 = 1; c1 <= 16; c1++) {
            if(board[r1][c1] === 0) continue;
            for (var r2 = 1; r2 <= 8; r2++) {
                for (var c2 = 1; c2 <= 16; c2++) {
                    if(r1 === r2 && c1 === c2) continue;
                    if(board[r2][c2] === 0) continue;
                    if(board[r1][c1] === board[r2][c2]) {
                        var path = getConnect(r1, c1, r2, c2);
                        if(path !== null) {
                            return { cell1: {r: r1, c: c1}, cell2: {r: r2, c: c2} };
                        }
                    }
                }
            }
        }
    }
    return null;
}

function removeHintEffect() {
    if(hintTimeout) clearTimeout(hintTimeout);
    var activeHint = document.querySelectorAll(".cell.hint-active");
    for (var i = 0; i < activeHint.length; i++) {
        activeHint[i].classList.remove("hint-active");
    }
}

function clickHint() {
    if(typeof isPaused !== "undefined" && isPaused) return; //ko dc dung khi dang pause
    if(hint <= 0) {
        alert("Bạn đã hết lượt!");
        return;
    }
    var hintPair = findHint();
    if(hintPair) {
        hint--;
        document.getElementById("hint-count").innerHTML = hint;
        if(hint ===0) {
            document.getElementById("btn-hint").classList.add("disabled");
        }
        removeHintEffect();
        // lay 2 o DOM trong HintPair
        var cell1 = document.querySelector('.cell[data-row="' + hintPair.cell1.r + '"][data-col="' + hintPair.cell1.c + '"]');
        var cell2 = document.querySelector('.cell[data-row="' + hintPair.cell2.r + '"][data-col="' + hintPair.cell2.c + '"]');
        if(cell1 && cell2) {
            cell1.classList.add("hint-active");
            cell2.classList.add("hint-active");
            hintTimeout = setTimeout(function () {//tat effect sau 4s
                removeHintEffect();
            }, 4000);
        }
    } else {
        alert("Không còn cặp nào nối đuợc!");
    }
}

document.getElementById("btn-hint").onclick = function () {
    clickHint();
};

function autoShuffle() {
    if(checkWin()) return;
    var hasValidMove = false;
    do {
        var listConLai = []; //gom het vao pokemon con lai vao listConLai
        for(var r = 1; r <= 8; r++) {
            for (var c = 1; c <= 16; c++) {
                if(board[r][c] !== 0) {
                    listConLai.push(board[r][c]);
                }
            }
        }
        listConLai.sort(function() {
            return Math.random() - 0.5;
        });
        var index = 0;
        for(var r =1; r<=8; r++) {
            for(var c=1; c<=16; c++) {
                if(board[r][c] !== 0) {
                    board[r][c] = listConLai[index++];
                }
            }
        }
        if(findHint() !== null) {
            hasValidMove = true;
        }
    } while (!hasValidMove);
    renderBoard();
}

function showAutoShuffleNotice() {
    var notice = document.createElement("div");
    notice.className = "shuffle-notice";
    notice.innerText = "Hết đường đi! Hệ thống tự động xáo bài";
    document.body.appendChild(notice);
    setTimeout(function() {
        notice.remove();
    }, 3000);
}

var currentLevel = 1;
const levelsData = {
    1: {
        title: "Cấp độ 1",
        desc: ["Bàn chơi cơ bản cố định.",
            "Nối các ô có cùng hình để loại bỏ nó.",
            "Đường nối có thể đi thẳng, hình chữ L hoặc hình chữ Z (tối đa 3 đoạn)",
            "Hoàn thành cấp độ để tiến tới cấp độ tiếp theo!"
        ]
    },
    2: {
        title: "Cấp độ 2",
        desc: ["Các ô Pokemon sẽ dồn xuống dưới sau khi chọn trúng 1 cặp và để lại khoảng trống giữa",
            "Hãy tính toán vị trí di chuyển mới sau mỗi lượt ăn!"
        ]
    },
    3: {

    },
    4: {

    },
    5: {

    },
    6: {

    }

};
//ham chuyen cap do
function selectLevel(levelNum) {
    currentLevel = levelNum;
    var btnLevel = document.querySelectorAll(".btn-level");
        btnLevel.forEach(function (btn, index) {
            if(index + 1 === levelNum) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
            });
    var data = levelsData[levelNum];
    if(data) {
        document.getElementById("level-desc-title").innerHTML = data.title;
        var descContainer = document.querySelector(".right-panel .description");
        var htmlContent = "<ul>";
        data.desc.forEach(function (item) {
            htmlContent += "<li>" + item + "</li>";
        });
        htmlContent += "</ul>";
        descContainer.innerHTML = htmlContent;
    }
}
document.getElementById("btn-start").onclick = () => {
    toggleScreens();
    selectLevel(1);
    initGame();
}

document.querySelectorAll(".btn-level").forEach(function(btn, index) {
    btn.onclick = function() {
        var levelSelected = index + 1;
        selectLevel(levelSelected);
        initGame();
    };
});


function initGame() {
    score = 0;
    timeLeft = 300; //reset lai time game moi
    isPaused = false;
    hint = 5;
    document.getElementById("win-modal").classList.add("hidden");
    document.getElementById("lose-modal").classList.add("hidden");
    document.getElementById("pause-modal").classList.add("hidden");
    removeHintEffect();
    document.getElementById("score").innerText = score;
    document.getElementById("hint-count").innerText = hint;
    document.getElementById("btn-hint").classList.remove("disabled");
    createBoardData();
    renderBoard();
    startTimer();
}













