var rows = 10;
var cols = 18;
var totalImg = 19;
var board = [];
var selectedCell = null;

function createBoardData() {
    board = [];
    for (var i = 0; i < rows; i++) {
        var rowArray = [];
        for (var j = 0; j < cols; j++) {
            rowArray.push(0);
        }
        board.push(rowArray);
    }

    var list = [];
    var tongCap = (8 * 16) / 2;
    for (var i = 0; i < tongCap; i++) {
        var pokemonId = (i % totalImg) + 1;
        list.push(pokemonId);
        list.push(pokemonId);
    }
    list.sort(function() {
        return Math.random() - 0.5;
    });

    var index = 0;
    for (var r = 1; r <= 8; r++) {
        for (var c = 1; c <= 16; c++) {
            board[r][c] = list[index];
            index++;
        }
    }
}

function renderBoard() {
    var boardDiv = document.getElementById('board');
    boardDiv.innerHTML = "";
    boardDiv.style.gridTemplateColumns = "repeat(" + cols + ", 40px)";

    for(var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
            var oVuong = document.createElement("div");
            oVuong.className = "cell";
            var val = board[r][c];
            oVuong.dataset.row = r;
            oVuong.dataset.col = c;
            if(val === 0) {
                oVuong.className = "cell empty";
            } else {
                oVuong.innerHTML = '<img src="assets/images/' + val + '.png">';
                oVuong.onclick = function() {
                    if(typeof isPaused !== "undefined" && isPaused) return;
                    if (typeof removeHintEffect === "function") {
                        removeHintEffect();
                    }
                    var rCur = parseInt(this.dataset.row);
                    var cCur = parseInt(this.dataset.col);
                    if (selectedCell === null) {
                        selectedCell = {
                            r: rCur,
                            c: cCur,
                            element: this };
                        this.classList.add("selected");
                    }
                    else if (selectedCell.r === rCur && selectedCell.c === cCur) {
                        selectedCell.element.classList.remove("selected");
                        selectedCell = null;
                    }
                    else {
                        var rPrev = selectedCell.r;
                        var cPrev = selectedCell.c;
                        if (board[rPrev][cPrev] === board[rCur][cCur]) {
                            var path = getConnect(rPrev, cPrev, rCur, cCur);
                            if (path !== null) {
                                drawPath(path, function () {
                                    board[rPrev][cPrev] = 0;
                                    board[rCur][cCur] = 0;
                                    selectedCell = null;
                                    if (typeof addScore === "function") addScore();
                                    renderBoard();
                                    if(checkWin()) {
                                        showWinModal();
                                    } else if(typeof findHint() === "function" && findHint() === null) {
                                        console.log("Hết đường đi, hệ thống tự động xáo bài");
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
                                element: this };
                            this.classList.add("selected");
                        }
                };
            }
            boardDiv.appendChild(oVuong);
        }
    }
}

//Ve duong nối khi pick 2o giong nhau
function drawPath(path, callback) {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var gameScreen = document.getElementById("game-screen");
    canvas.width = gameScreen.offsetWidth;
    canvas.height = gameScreen.offsetHeight;
    context.strokeStyle = "red";
    context.lineWidth = 3;
    context.beginPath();
    for (var i = 0; i < path.length; i++) {
        var p = path[i];
        var cell = document.querySelector('.cell[data-row="' + p.r + '"][data-col="' + p.c + '"]');
        var rect = cell.getBoundingClientRect();
        var gRect = gameScreen.getBoundingClientRect();
        var x = rect.left - gRect.left + rect.width / 2;
        var y = rect.top - gRect.top + rect.height / 2;

        if(i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
    }
    context.stroke();
    setTimeout(function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
        callback();
    }, 250);

}

function checkWin() {
    for (var r = 1; r <= 8; r++) {
        for (var c = 1; c <= 16; c++) {
            if (board[r][c] !== 0) return false;
        }
    }
    return true;
}




