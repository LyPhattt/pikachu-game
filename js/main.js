// 1 Cài đặt g và trạng thái
const menuScreen = document.getElementById("main-menu");
const gameScreen = document.getElementById("game-screen");
const rows = 10;
const cols = 18;
const totalImg = 19;
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
        desc: ["Trên bàn chơi xuất hiện 8 tảng đá cố định.",
            "Đá không thể chọn, không ghép nối và không di chuyển khi xáo bài.",
            "Đường nối giữa hai Pokemon không được đi xuyên qua đá, nên người chơi cần tìm đường vòng phù hợp."
        ]
    },
    4: {
        title: "Cấp độ 4",
        desc: ["Trên bàn chơi xuất hiện 8 ô băng ngẫu nhiên.",
            "Ô băng không thể chọn và chặn các đường nối đi xuyên qua.",
            "Người chơi cần ăn các ô (trên, dưới, trái, phải) của ô băng đó để phá băng."]
    },
    5: {
        title: "Cấp độ 5",
        desc: ["Trên bàn chơi xuất hiện 12 ô ngẫu nhiên.",
            "Nhấn vào ô ? để lật xem Pokemon bên dưới.",
            "Sau 2s, ô sẽ tự động úp lại nếu chưa được ghép cặp.",
            "Ăn một cặp bằng cách nối 1 ô với ô đã lật lên."]
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

    // Đường thẳng
    if (checkLine(r1, c1, r2, c2)) {
        return [{ r: r1, c: c1 }, { r: r2, c: c2 }];
    }

    //  Đường chữ L
    if (board[r1][c2] === 0 && checkLine(r1, c1, r1, c2) && checkLine(r1, c2, r2, c2)) {
        return [{ r: r1, c: c1 }, { r: r1, c: c2 }, { r: r2, c: c2 }];
    }
    if (board[r2][c1] === 0 && checkLine(r1, c1, r2, c1) && checkLine(r2, c1, r2, c2)) {
        return [{ r: r1, c: c1 }, { r: r2, c: c1 }, { r: r2, c: c2 }];
    }

    //  Đường chữ Z/U
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
var board = [];
var selectedCell = null;
var currentLevel = 1;
var oBang = [];
var oAn = [];
var flipTimers = {};

function isBang(r,c) {
    for(var i = 0; i < oBang.length; i++) {
        if(oBang[i].r === r && oBang[i].c === c) {
            return true;
        }
    }
    return false;
}
function phaBang(r, c) {
    oBang = oBang.filter(function(ice) {
        return Math.abs(ice.r - r) + Math.abs(ice.c - c) !== 1;
    })
}

function isAn(r,c) {
    for(var i = 0; i < oAn.length; i++) {
        if(oAn[i].r === r && oAn[i].c === c && !oAn[i].isFlipped) {
            return true;
        }
    }
    return false;
}

function latOAn(r,c) {
    for(var i = 0; i < oAn.length; i++) {
        if(oAn[i].r === r && oAn[i].c === c) {
            oAn[i].isFlipped = true;
            var key = getFlipKey(r,c);
            if(flipTimers[key]) {
                clearTimeout(flipTimers[key]);
            }
            flipTimers[key] = setTimeout(function() {
                oAn[i].isFlipped = false;
                delete flipTimers[key];
                if(selectedCell !== null && selectedCell.r === r && selectedCell.c === c) {
                    selectedCell = null;
                }
                renderBoard();
            }, 2000);
            break;
        }
    }
}

function getFlipKey(r, c) {
    return r + "-" + c;
}

function clearFlipTimers() {
    for (var key in flipTimers) {
        clearTimeout(flipTimers[key]);
    }
    flipTimers = {};
}

function createBoardData() {
    board = [];
    oBang = [];
    oAn = [];
    for (let i = 0; i < rows; i++) {
        const rowArray = [];
        for (let j = 0; j < cols; j++) {
            rowArray.push(0);
        }
        board.push(rowArray);
    }
    if(currentLevel === 3) {
        board[3][6] = -1;
        board[3][11] = -1;
        board[6][6] = -1;
        board[6][11] = -1;
        board[5][5] = -1;
        board[5][10] = -1;
        board[4][5] = -1;
        board[4][10] = -1;
    }
    if(currentLevel === 4) {
        while(oBang.length < 8) {
            const r = Math.floor(Math.random() * 8) + 1;
            const c = Math.floor(Math.random() * 16) + 1;
            var isDuplicate = false;
            for(var i = 0; i<oBang.length;i++) {
                if(oBang[i].r === r && oBang[i].c === c) {
                    isDuplicate = true;
                }
            }
            if(isDuplicate === false) {
                oBang.push({r: r, c: c});
            }
        }
    }
    const list = [];
    var tongCap = (8 * 16)/2;
    if(currentLevel === 3) {
        tongCap = (8 * 16 - 8)/2;
    }
    for (let i = 0; i < tongCap; i++) {
        const pokemonId = (i % totalImg) + 1;
        list.push(pokemonId);
        list.push(pokemonId);
    }
    list.sort(() => Math.random() - 0.5);
    let index = 0;
    for (let r = 1; r <= 8; r++) {
        for (let c = 1; c <= 16; c++) {
            if(board[r][c] === 0) {
                board[r][c] = list[index];
                index++;
            }
        }
    }
    if(currentLevel === 5) {
        while(oAn.length < 12) {
            const r = Math.floor(Math.random() * 8) + 1;
            const c = Math.floor(Math.random() * 16) + 1;
            if(board[r][c] > 0) {
                var daAn = false;
                for (var i = 0; i<oAn.length;i++) {
                    if(oAn[i].r === r && oAn[i].c === c) {
                        daAn = true;
                        break;
                    }
                }
                if(!daAn) {
                    oAn.push({r, c, isFlipped: false});
                }
            }
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
            if (val === -1) {
                oVuong.className = "cell rock";
                oVuong.innerHTML = "<i class=\"fa-solid fa-mountain\"></i>";
            } else if (val === 0) {
                oVuong.className = "cell empty";
            } else {
                oVuong.innerHTML = '<img src="assets/images/' + val + '.png">';
                if(isBang(r,c)) {
                    oVuong.classList.add("bang");
                    oVuong.innerHTML = "<i class='fa-solid fa-snowflake ice-icon'></i>"
                }
                if(isAn(r,c)) {
                    oVuong.classList.add("o-up");
                    oVuong.innerHTML = "?";
                }
                oVuong.onclick = function () {
                    if (isPaused) return;
                    removeHintEffect();
                    const rCur = parseInt(this.dataset.row);
                    const cCur = parseInt(this.dataset.col);
                    if(isBang(rCur, cCur)) return;
                    if (isAn(rCur, cCur)) {
                        latOAn(rCur, cCur);
                        renderBoard();
                        return;
                    }
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
                                    if (currentLevel === 2) {
                                        shiftDown();
                                    }
                                    if(currentLevel === 4) {
                                        phaBang(rPrev, cPrev);
                                        phaBang(rCur, cCur);
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

function getPoint(row, col) {
    const cell = document.querySelector('.cell[data-row="' + row + '"][data-col="' + col + '"]');
    const board = document.getElementById("board");
    const rect = cell.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();
    return {
        x: rect.left - boardRect.left + rect.width / 2,
        y: rect.top - boardRect.top + rect.height / 2
    };
}

function drawPath(path, callback) {
    const board = document.getElementById("board");
    for (var i = 0; i < path.length - 1; i++) {
        const start = getPoint(path[i].r, path[i].c);
        const end = getPoint(path[i + 1].r, path[i + 1].c);
        const line = document.createElement("div");
        line.classList.add("connect-line");
        if (start.y === end.y) {
            // connect ngang
            line.style.left = Math.min(start.x, end.x) + "px";
            line.style.top = (start.y - 2) + "px";
            line.style.width = Math.abs(start.x - end.x) + "px";
            line.style.height = "4px";
        } else {
            // connect doc
            line.style.left = (start.x - 2) + "px";
            line.style.top = Math.min(start.y, end.y) + "px";
            line.style.width = "4px";
            line.style.height = Math.abs(start.y - end.y) + "px";
        }
        board.appendChild(line);
    }
    setTimeout(function () {
        document.querySelectorAll(".connect-line").forEach(function (line) {
            line.remove();
        });
        callback();
    }, 250);
}

function checkWin() {
    for (let r = 1; r <= 8; r++) {
        for (let c = 1; c <= 16; c++) {
            if (board[r][c] > 0) return false;
        }
    }
    return true;
}

// 4 tính năng g và level
var hint = 5;
var hintTimeout = null;

function findHint(hidden = true) {
    for (let r1 = 1; r1 <= 8; r1++) {
        for (let c1 = 1; c1 <= 16; c1++) {
            if (board[r1][c1] <= 0) continue;
            if(!hidden && isAn(r1,c1)) continue;
            for (let r2 = 1; r2 <= 8; r2++) {
                for (let c2 = 1; c2 <= 16; c2++) {
                    if (r1 === r2 && c1 === c2) continue;
                    if (board[r2][c2] <= 0) continue;
                    if(!hidden && isAn(r2,c2)) continue;
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
    const hintPair = findHint(false);
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
    let soLanXao = 0;
    do {
        const listConLai = [];
        for (let r = 1; r <= 8; r++) {
            for (let c = 1; c <= 16; c++) {
                if (board[r][c] > 0) {
                    listConLai.push(board[r][c]);
                    board[r][c] = 0;
                }
            }
        }

        listConLai.sort(() => Math.random() - 0.5);
        if (listConLai.length === 2) {
            board[1][1] = listConLai[0];
            board[1][2] = listConLai[1];
        } else {
            const oTrong = [];
            for (let r = 1; r <= 8; r++) {
                for (let c = 1; c <= 16; c++) {
                    if (board[r][c] === 0) {
                        oTrong.push({ r: r, c: c });
                    }
                }
            }
            oTrong.sort(() => Math.random() - 0.5);
            for (let i = 0; i < listConLai.length; i++) {
                const viTri = oTrong[i];
                board[viTri.r][viTri.c] = listConLai[i];
            }
        }
        if (findHint() !== null) {
            hasValidMove = true;
        }
        soLanXao++;
    } while (!hasValidMove && soLanXao < 30);
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
var score = 0;
var timeLeft = 300;
var timer = null;
var isPaused = false;

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

    clearFlipTimers();
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
