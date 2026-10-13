// 1 Cài đặt g và trạng thái 
const rows = 10;
const cols = 18;
const totalImg = 19;

let board = [];
let selectedCell = null;
let score = 0;
let timeLeft = 300;
let timer = null;
let isPaused = false;
let hint = 5;
let hintTimeout = null;
let currentLevel = 1;

// DOM Elements chính
const menuScreen = document.getElementById("main-menu");
const gameScreen = document.getElementById("game-screen");

// descrip level
const levelsData = {
    1: {
        title: "Cấp độ 1",
        desc: [
            "Bàn chơi cơ bản cố định.",
            "Nối các ô có cùng hình để loại bỏ nó.",
            "Đường nối có thể đi thẳng, hình chữ L hoặc hình chữ Z (tối đa 3 đoạn).",
            "Hoàn thành cấp độ để tiến tới cấp độ tiếp theo!"
        ]
    },
    2: {
        title: "Cấp độ 2",
        desc: [
            "Các ô Pokemon sẽ dồn xuống dưới sau khi chọn trúng 1 cặp và để lại khoảng trống.",
            "Hãy tính toán vị trí di chuyển mới sau mỗi lượt ăn!"
        ]
    },
    3: {
        title: "Cấp độ 3",
        desc: ["Cấp độ đang cập nhật..."]
    },
    4: {
        title: "Cấp độ 4",
        desc: ["Cấp độ đang cập nhật..."]
    },
    5: {
        title: "Cấp độ 5",
        desc: ["Cấp độ đang cập nhật..."]
    },
    6: {
        title: "Cấp độ 6",
        desc: ["Cấp độ đang cập nhật..."]
    }
};

// 2 Logic game
// Kiểm tra đường thẳng giữa 2 ô cùng hàng hoặc cùng cột
function checkLine(row1, col1, row2, col2) {
    if (row1 === row2) {
        const minCol = Math.min(col1, col2);
        const maxCol = Math.max(col1, col2);
        for (let col = minCol + 1; col < maxCol; col++) {
            if (board[row1][col] !== 0) return false;
        }
        return true;
    }
    if (col1 === col2) {
        const minRow = Math.min(row1, row2);
        const maxRow = Math.max(row1, row2);
        for (let row = minRow + 1; row < maxRow; row++) {
            if (board[row][col1] !== 0) return false;
        }
        return true;
    }
    return false;
}

// Kiểm tra đường gấp khúc chữ L (1 góc vuông)
function checkL(r1, c1, r2, c2) {
    if (board[r1][c2] === 0) {
        if (checkLine(r1, c1, r1, c2) && checkLine(r1, c2, r2, c2)) {
            return true;
        }
    }
    if (board[r2][c1] === 0) {
        if (checkLine(r1, c1, r2, c1) && checkLine(r2, c1, r2, c2)) {
            return true;
        }
    }
    return false;
}

// Kiểm tra đường chữ Z / chữ U (2 góc vuông)
function checkZU(r1, c1, r2, c2) {
    for (let row = 0; row < rows; row++) {
        if ((board[row][c1] === 0 || row === r1) && (board[row][c2] === 0 || row === r2)) {
            if (checkLine(r1, c1, row, c1) && checkLine(row, c1, row, c2) && checkLine(row, c2, r2, c2)) {
                return true;
            }
        }
    }
    for (let c = 0; c < cols; c++) {
        if ((board[r1][c] === 0 || c === c1) && (board[r2][c] === 0 || c === c2)) {
            if (checkLine(r1, c1, r1, c) && checkLine(r1, c, r2, c) && checkLine(r2, c, r2, c2)) {
                return true;
            }
        }
    }
    return false;
}

// Tìm tọa độ các điểm kết nối (trả về mảng tọa độ hoặc null)
function getConnect(r1, c1, r2, c2) {
    if (r1 === r2 && c1 === c2) return null;

    // Đường thẳng (1 đoạn)
    if (checkLine(r1, c1, r2, c2)) {
        return [{ r: r1, c: c1 }, { r: r2, c: c2 }];
    }

    // Đường chữ L (2 đoạn)
    if (board[r1][c2] === 0 && checkLine(r1, c1, r1, c2) && checkLine(r1, c2, r2, c2)) {
        return [{ r: r1, c: c1 }, { r: r1, c: c2 }, { r: r2, c: c2 }];
    }
    if (board[r2][c1] === 0 && checkLine(r1, c1, r2, c1) && checkLine(r2, c1, r2, c2)) {
        return [{ r: r1, c: c1 }, { r: r2, c: c1 }, { r: r2, c: c2 }];
    }

    // Đường chữ Z / U (3 đoạn)
    for (let r = 0; r < rows; r++) {
        if ((board[r][c1] === 0 || r === r1) && (board[r][c2] === 0 || r === r2)) {
            if (checkLine(r1, c1, r, c1) && checkLine(r, c1, r, c2) && checkLine(r, c2, r2, c2)) {
                return [{ r: r1, c: c1 }, { r: r, c: c1 }, { r: r, c: c2 }, { r: r2, c: c2 }];
            }
        }
    }
    for (let c = 0; c < cols; c++) {
        if ((board[r1][c] === 0 || c === c1) && (board[r2][c] === 0 || c === c2)) {
            if (checkLine(r1, c1, r1, c) && checkLine(r1, c, r2, c) && checkLine(r2, c, r2, c2)) {
                return [{ r: r1, c: c1 }, { r: r1, c: c }, { r: r2, c: c }, { r: r2, c: c2 }];
            }
        }
    }

    return null;
}

// 3 Board và ve ui
function createBoardData() {
    board = [];
    for (let i = 0; i < rows; i++) {
        const rowArray = [];
        for (let j = 0; j < cols; j++) {
            rowArray.push(0);
        }
        board.push(rowArray);
    }

    const list = [];
    const tongCap = (8 * 16) / 2;
    for (let i = 0; i < tongCap; i++) {
        const pokemonId = (i % totalImg) + 1;
        list.push(pokemonId);
        list.push(pokemonId);
    }
    list.sort(() => Math.random() - 0.5);

    let index = 0;
    for (let r = 1; r <= 8; r++) {
        for (let c = 1; c <= 16; c++) {
            board[r][c] = list[index];
            index++;
        }
    }
}

function renderBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    boardDiv.style.gridTemplateColumns = "repeat(" + cols + ", 40px)";

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const oVuong = document.createElement("div");
            oVuong.className = "cell";
            const val = board[r][c];
            oVuong.dataset.row = r;
            oVuong.dataset.col = c;

            if (val === 0) {
                oVuong.className = "cell empty";
            } else {
                oVuong.innerHTML = '<img src="assets/images/' + val + '.png">';
                oVuong.onclick = function () {
                    if (isPaused) return;
                    removeHintEffect();

                    const rCur = parseInt(this.dataset.row);
                    const cCur = parseInt(this.dataset.col);

                    if (selectedCell === null) {
                        selectedCell = {
                            r: rCur,
                            c: cCur,
                            element: this
                        };
                        this.classList.add("selected");
                    } else if (selectedCell.r === rCur && selectedCell.c === cCur) {
                        selectedCell.element.classList.remove("selected");
                        selectedCell = null;
                    } else {
                        const rPrev = selectedCell.r;
                        const cPrev = selectedCell.c;

                        if (board[rPrev][cPrev] === board[rCur][cCur]) {
                            const path = getConnect(rPrev, cPrev, rCur, cCur);
                            if (path !== null) {
                                drawPath(path, function () {
                                    board[rPrev][cPrev] = 0;
                                    board[rCur][cCur] = 0;
                                    selectedCell = null;
                                    addScore();

                                    // level 2 thì dồn xuống dưới
                                    if (currentLevel === 2) {
                                        shiftDown();
                                    }

                                    renderBoard();

                                    if (checkWin()) {
                                        showWinModal();
                                    } else if (findHint() === null) {
                                        console.log("Hết đường đi, hệ thống tự động xáo bài");
                                        showAutoShuffleNotice();
                                        setTimeout(function () {
                                            autoShuffle();
                                        }, 2000);
                                    }
                                });
                                return;
                            }
                        }

                        selectedCell.element.classList.remove("selected");
                        selectedCell = {
                            r: rCur,
                            c: cCur,
                            element: this
                        };
                        this.classList.add("selected");
                    }
                };
            }
            boardDiv.appendChild(oVuong);
        }
    }
}

function drawPath(path, callback) {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const gScreen = document.getElementById("game-screen");

    canvas.width = gScreen.offsetWidth;
    canvas.height = gScreen.offsetHeight;
    context.strokeStyle = "red";
    context.lineWidth = 3;
    context.beginPath();

    for (let i = 0; i < path.length; i++) {
        const p = path[i];
        const cell = document.querySelector('.cell[data-row="' + p.r + '"][data-col="' + p.c + '"]');
        const rect = cell.getBoundingClientRect();
        const gRect = gScreen.getBoundingClientRect();
        const x = rect.left - gRect.left + rect.width / 2;
        const y = rect.top - gRect.top + rect.height / 2;

        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
    }
    context.stroke();
    setTimeout(function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        callback();
    }, 250);
}

function checkWin() {
    for (let r = 1; r <= 8; r++) {
        for (let c = 1; c <= 16; c++) {
            if (board[r][c] !== 0) return false;
        }
    }
    return true;
}

// 4 tính năng g và level 
// Tìm 1 cặp Pokemon có thể nối được để gợi ý
function findHint() {
    for (let r1 = 1; r1 <= 8; r1++) {
        for (let c1 = 1; c1 <= 16; c1++) {
            if (board[r1][c1] === 0) continue;
            for (let r2 = 1; r2 <= 8; r2++) {
                for (let c2 = 1; c2 <= 16; c2++) {
                    if (r1 === r2 && c1 === c2) continue;
                    if (board[r2][c2] === 0) continue;
                    if (board[r1][c1] === board[r2][c2]) {
                        const path = getConnect(r1, c1, r2, c2);
                        if (path !== null) {
                            return { cell1: { r: r1, c: c1 }, cell2: { r: r2, c: c2 } };
                        }
                    }
                }
            }
        }
    }
    return null;
}

function removeHintEffect() {
    if (hintTimeout) clearTimeout(hintTimeout);
    const activeHints = document.querySelectorAll(".cell.hint-active");
    activeHints.forEach(cell => cell.classList.remove("hint-active"));
}

function clickHint() {
    if (isPaused) return;
    if (hint <= 0) {
        alert("Bạn đã hết lượt!");
        return;
    }
    const hintPair = findHint();
    if (hintPair) {
        hint--;
        document.getElementById("hint-count").innerText = hint;
        if (hint === 0) {
            document.getElementById("btn-hint").classList.add("disabled");
        }
        removeHintEffect();
        const cell1 = document.querySelector('.cell[data-row="' + hintPair.cell1.r + '"][data-col="' + hintPair.cell1.c + '"]');
        const cell2 = document.querySelector('.cell[data-row="' + hintPair.cell2.r + '"][data-col="' + hintPair.cell2.c + '"]');
        if (cell1 && cell2) {
            cell1.classList.add("hint-active");
            cell2.classList.add("hint-active");
            hintTimeout = setTimeout(function () {
                removeHintEffect();
            }, 4000);
        }
    } else {
        alert("Không còn cặp nào nối được!");
    }
}

function autoShuffle() {
    if (checkWin()) return;
    let hasValidMove = false;
    do {
        const listConLai = [];
        for (let r = 1; r <= 8; r++) {
            for (let c = 1; c <= 16; c++) {
                if (board[r][c] !== 0) {
                    listConLai.push(board[r][c]);
                }
            }
        }
        listConLai.sort(() => Math.random() - 0.5);
        let index = 0;
        for (let r = 1; r <= 8; r++) {
            for (let c = 1; c <= 16; c++) {
                if (board[r][c] !== 0) {
                    board[r][c] = listConLai[index++];
                }
            }
        }
        if (findHint() !== null) {
            hasValidMove = true;
        }
    } while (!hasValidMove);

    renderBoard();
}

function showAutoShuffleNotice() {
    const notice = document.createElement("div");
    notice.className = "shuffle-notice";
    notice.innerText = "Hết đường đi! Hệ thống tự động xáo bài";
    document.body.appendChild(notice);
    setTimeout(function () {
        notice.remove();
    }, 3000);
}

function shiftDown() {
    for (let c = 1; c <= 16; c++) {
        let emptySlot = 8;
        for (let r = 8; r >= 1; r--) {
            if (board[r][c] !== 0) {
                board[emptySlot][c] = board[r][c];
                if (emptySlot !== r) {
                    board[r][c] = 0;
                }
                emptySlot--;
            }
        }
    }
}

// 5 Luồng g và UI
function toggleScreens() {
    menuScreen.classList.toggle("hidden");
    gameScreen.classList.toggle("hidden");
}

function startTimer() {
    clearInterval(timer);
    document.getElementById("timer").innerText = timeLeft;
    timer = setInterval(function () {
        timeLeft--;
        document.getElementById("timer").innerText = timeLeft;
        if (timeLeft <= 0) {
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

function showLoseModal() {
    clearInterval(timer);
    document.getElementById("lose-score").innerText = score;
    document.getElementById("lose-modal").classList.remove("hidden");
}

function pauseGame() {
    if (isPaused) return;
    isPaused = true;
    clearInterval(timer);
    document.getElementById("pause-modal").classList.remove("hidden");
}

function resumeGame() {
    if (!isPaused) return;
    isPaused = false;
    document.getElementById("pause-modal").classList.add("hidden");
    startTimer();
}

// select và update hiển thị level
function selectLevel(levelNum) {
    currentLevel = levelNum;
    const btnLevels = document.querySelectorAll(".btn-level");
    btnLevels.forEach(function (btn, index) {
        if (index + 1 === levelNum) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    const data = levelsData[levelNum];
    if (data && data.title) {
        document.getElementById("level-desc-title").innerHTML = data.title;
        const descContainer = document.querySelector(".right-panel .description");
        if (data.desc) {
            let htmlContent = "<ul>";
            data.desc.forEach(function (item) {
                htmlContent += "<li>" + item + "</li>";
            });
            htmlContent += "</ul>";
            descContainer.innerHTML = htmlContent;
        }
    }
}

function initGame(keepScore = false) {
    if (!keepScore) {
        score = 0;
    }
    timeLeft = 300;
    isPaused = false;
    hint = 5;
    selectedCell = null;

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


// 6 Sự kiện g
document.getElementById("btn-start").onclick = () => {
    toggleScreens();
    selectLevel(1);
    initGame();
};

document.getElementById("btn-back").onclick = () => {
    clearInterval(timer);
    toggleScreens();
};

document.getElementById("btn-next").onclick = function () {
    document.getElementById("win-modal").classList.add("hidden");
    if (currentLevel < 6) {
        currentLevel++;
        selectLevel(currentLevel);
        initGame(true);
    } else {
        selectLevel(1);
        initGame(false);
    }
};

document.getElementById("btn-retry").onclick = function () {
    document.getElementById("lose-modal").classList.add("hidden");
    initGame();
};

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
};

// ve menu trong menu pause
document.getElementById("btn-pause-menu").onclick = function () {
    document.getElementById("pause-modal").classList.add("hidden");
    isPaused = false;
    clearInterval(timer);
    toggleScreens();
};

document.getElementById("btn-hint").onclick = function () {
    clickHint();
};

// list btn level
document.querySelectorAll(".btn-level").forEach(function (btn, index) {
    btn.onclick = function () {
        const levelSelected = index + 1;
        selectLevel(levelSelected);
        initGame();
    };
});

document.getElementById("btn-huongDan").onclick = function () {
    document.getElementById("modal-huongDan").classList.remove("hidden");
};

// btn close
const btnCloseHD = document.getElementById("btn-close-huongDan");
if (btnCloseHD) {
    btnCloseHD.onclick = function (e) {
        if (e) e.stopPropagation();
        document.getElementById("modal-huongDan").classList.add("hidden");
    };
}

// click ở ngoài modal HD để close
document.getElementById("modal-huongDan").onclick = function (e) {
    if (e.target === this) {
        this.classList.add("hidden");
    }
};
