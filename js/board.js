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

            if(val === 0) {
                oVuong.className = "cell empty";
            } else {
                oVuong.innerHTML = '<img src="assets/images/' + val + '.png">';
                oVuong.dataset.row = r;
                oVuong.dataset.col = c;

                oVuong.onclick = function() {
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
                        if (board[rPrev][cPrev] === board[rCur][cCur] && canConnect(rPrev, cPrev, rCur, cCur)) {
                            board[rPrev][cPrev] = 0;
                            board[rCur][cCur] = 0;
                            selectedCell = null;
                            addScore();
                            renderBoard();
                        } else {
                            selectedCell.element.classList.remove("selected");
                            selectedCell = {
                                r: rCur,
                                c: cCur,
                                element: this };
                            this.classList.add("selected");
                        }
                    }
                };
            }
            boardDiv.appendChild(oVuong);
        }
    }
}







