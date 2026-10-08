function checkLine(row1, col1, row2, col2) {
    if(row1 === row2) {
        var minCol = Math.min(col1, col2);
        var maxCol = Math.max(col1, col2);
        for(var col = minCol + 1; col < maxCol; col++) {
            if(board[row1][col] !== 0) return false;
        }
        return true;
    }
    if(col1 === col2) {
        var minRow = Math.min(row1, row2);
        var maxRow = Math.max(row1, row2);
        for(var row = minRow + 1; row < maxRow; row++) {
            if(board[row][col1] !== 0) return false;
        }
        return true;
    }
    return false;
}

function checkL(r1, c1, r2, c2) {
    if(board[r1][c2] === 0) {
        if(checkLine(r1, c1, r1, c2) && checkLine(r1, c2, r2, c2)) {
            return true;
        }
    }
    if(board[r2][c1] === 0) {
        if(checkLine(r1, c1, r2, c1) && checkLine(r2, c1, r2, c2)) {
            return true;
        }
    }
}

function checkZU(r1, c1, r2, c2) {
    for (var row = 0; row < rows; row++) {
        if ((board[row][c1] === 0 || row === r1) && (board[row][c2] === 0 || row === r2)) {
            if (checkLine(r1, c1, row, c1) && checkLine(row, c1, row, c2) && checkLine(row, c2, r2, c2)) {
                return true;
            }
        }
    }
    for (var c = 0; c < cols; c++) {
        if ((board[r1][c] === 0 || c === c1) && (board[r2][c] === 0 || c === c2)) {
            if (checkLine(r1, c1, r1, c) && checkLine(r1, c, r2, c) && checkLine(r2, c, r2, c2)) {
                return true;
            }
        }
    }
    return false;
}

function getConnect(r1, c1, r2, c2) {
    if (r1 === r2 && c1 === c2) return null;
    if (checkLine(r1, c1, r2, c2))
        return [{r:r1, c:c1}, {r:r2, c:c2}];
    if(board[r1][c2] === 0 && checkLine(r1, c1, r1, c2) && checkLine(r1, c2, r2, c2)) {
        return [{r:r1, c:c1}, {r:r1, c:c2}, {r:r2, c:c2}];
    }
    if(board[r2][c1] === 0 && checkLine(r1, c1, r2, c1) && checkLine(r2, c1, r2, c2)) {
        return [{r:r1, c:c1}, {r:r2, c:c1}, {r:r2, c:c2}];
    }
    for (var r = 0; r < rows; r++) {
        if ((board[r][c1] === 0 || r === r1) && (board[r][c2] === 0 || r === r2)) {
            if(checkLine(r1, c1, r, c1) && checkLine(r, c1, r, c2) && checkLine(r, c2, r2, c2)) {
                return [{r:r1, c:c1}, {r:r, c:c1}, {r:r, c:c2}, {r:r2, c:c2}];
            }
        }
    }
    for (var c = 0; c < cols; c++) {
        if((board[r1][c] === 0 || c === c1) && (board[r2][c] === 0 || c === c2)) {
            if(checkLine(r1,c1, r1, c) && checkLine(r1, c, r2, c) && checkLine(r2, c, r2, c2)) {
                return [{r:r1, c:c1}, {r:r1, c:c}, {r:r2, c:c}, {r: r2, c:c2}];
            }
        }
    }
    return null;
}




