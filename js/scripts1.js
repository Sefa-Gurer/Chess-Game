// jshint esversion: 6
// jshint browser: false

let pieces = [];
let boardSquares = [];
let selectedSquare = null;

let Player = function(color) {
    this.checked = false;
    this.color = color;
    this.castled = false;
    this.king = null;
    this.kingMoved = false;
    this.promote = null;
    this.moved = null;
};

let turn = 1;
let white = new Player("white");
let black = new Player("black");
let currentPlayer = white;

let SquareObject = function(x, y, color, selected, element, piece) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.selected = selected;
    this.element = element;
    this.piece = piece;
};

SquareObject.prototype.setPiece = function(piece) {
    this.piece = piece;
    this.update();
};

SquareObject.prototype.unsetPiece = function() {
    this.piece = null;
    this.update();
};

SquareObject.prototype.update = function() {
    this.element.className = "square " + this.color + " " + (this.selected ? "selected" : "") + " " + (this.piece === null ? "empty" : this.piece.color + "-" + this.piece.type);
};

SquareObject.prototype.select = function() {
    this.selected = true;
    this.update();
};

SquareObject.prototype.deselect = function() {
    this.selected = false;
    this.update();
};

SquareObject.prototype.hasPiece = function() {
    return this.piece !== null;
};

let Piece = function(x, y, color, type) {
    this.color = color;
    this.type = type;
    this.x = x;
    this.y = y;
    this.captured = false;
    this.lastmoved = 0;
    this.advancedtwo = 0;
};

Piece.prototype.capture = function() {
    this.captured = true;
};

let Castle = function(x, y, color) {
    this.color = color;
    this.type = "castle";
    this.x = x;
    this.y = y;
};

Castle.prototype = Object.create(Piece.prototype);

Castle.prototype.isValidMove = function(toSquare, n = 1) {
    if (n == 0) return { valid: false, capture: null };
    let movementY = (toSquare.y - this.y);
    let movementX = (toSquare.x - this.x);
    let directionX = movementX ? (movementX / Math.abs(movementX)) : 0;
    let directionY = movementY ? (movementY / Math.abs(movementY)) : 0;
    let result = { valid: false, capture: null };
    if (movementX == 0 || movementY == 0) {
        let blocked = false;
        for (let testX = this.x + directionX, testY = this.y + directionY; testX != toSquare.x || testY != toSquare.y; testX += directionX, testY += directionY) {
            let testSquare = getSquare(testX, testY);
            blocked = blocked || testSquare.hasPiece();
        }
        if (!blocked) {
            if (!toSquare.hasPiece()) {
                result = { valid: true, capture: null };
            } else if (toSquare.hasPiece() && toSquare.piece.color != this.color) {
                result = { valid: true, capture: toSquare };
            }
        }
    }
    if (n == 2 && currentPlayer.checked == false) {
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].color != currentPlayer.color) {
                if (pieces[i].captured == true) continue;
                if (pieces[i].isValidMove(getSquare(currentPlayer.king.x, currentPlayer.king.y), n - 1).valid) {
                    result.valid = false;
                    break;
                }
            }
        }
    }
    return result;
};

let Knight = function(x, y, color) {
    this.color = color;
    this.type = "knight";
    this.x = x;
    this.y = y;
};

Knight.prototype = Object.create(Piece.prototype);

Knight.prototype.isValidMove = function(toSquare, n = 1) {
    if (n == 0) return { valid: false, capture: null };
    let movementY = toSquare.y - this.y;
    let movementX = toSquare.x - this.x;
    let result = { valid: false, capture: null };
    if ((Math.abs(movementX) == 2 && Math.abs(movementY) == 1) || (Math.abs(movementX) == 1 && Math.abs(movementY) == 2)) {
        if (!toSquare.hasPiece()) {
            result = { valid: true, capture: null };
        } else if (toSquare.hasPiece() && toSquare.piece.color != this.color) {
            result = { valid: true, capture: toSquare };
        }
    }
    if (n == 2 && currentPlayer.checked == false) {
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].color != currentPlayer.color) {
                if (pieces[i].captured == true) continue;
                if (pieces[i].isValidMove(getSquare(currentPlayer.king.x, currentPlayer.king.y), n - 1).valid) {
                    result.valid = false;
                    break;
                }
            }
        }
    }
    return result;
};

let Bishop = function(x, y, color) {
    this.color = color;
    this.type = "bishop";
    this.x = x;
    this.y = y;
};

Bishop.prototype = Object.create(Piece.prototype);

Bishop.prototype.isValidMove = function(toSquare, n = 1) {
    if (n == 0) return { valid: false, capture: null };
    let movementY = (toSquare.y - this.y);
    let movementX = (toSquare.x - this.x);
    let directionX = movementX ? (movementX / Math.abs(movementX)) : 0;
    let directionY = movementY ? (movementY / Math.abs(movementY)) : 0;
    let result = { valid: false, capture: null };
    if (Math.abs(movementX) == Math.abs(movementY)) {
        let blocked = false;
        for (let testX = this.x + directionX, testY = this.y + directionY; testX != toSquare.x || testY != toSquare.y; testX += directionX, testY += directionY) {
            let testSquare = getSquare(testX, testY);
            blocked = blocked || testSquare.hasPiece();
        }
        if (!blocked) {
            if (!toSquare.hasPiece()) {
                result = { valid: true, capture: null };
            } else if (toSquare.hasPiece() && toSquare.piece.color != this.color) {
                result = { valid: true, capture: toSquare };
            }
        }
    }
    if (n == 2 && currentPlayer.checked == false) {
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].color != currentPlayer.color) {
                if (pieces[i].captured == true) continue;
                if (pieces[i].isValidMove(getSquare(currentPlayer.king.x, currentPlayer.king.y), n - 1).valid) {
                    result.valid = false;
                    break;
                }
            }
        }
    }
    return result;
};

let setup = function() {
    let boardContainer = document.getElementById("board");
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            let squareElement = document.createElement("div");
            let color = (j + i) % 2 ? "dark" : "light";
            squareElement.addEventListener("click", squareClicked);
            squareElement.setAttribute("data-x", j);
            squareElement.setAttribute("data-y", i);
            let square = new SquareObject(j, i, color, false, squareElement, null);
            square.update();
            boardSquares.push(square);
            boardContainer.appendChild(squareElement);
        }
    }
    white.king = new King(5, 8, "white");
    black.king = new King(5, 1, "black");
    pieces.push(white.king);
    pieces.push(black.king);

    pieces.push(new Castle(1, 1, "black"));
    pieces.push(new Knight(2, 1, "black"));
    pieces.push(new Bishop(3, 1, "black"));
    pieces.push(new Queen(4, 1, "black"));
    pieces.push(new Bishop(6, 1, "black"));
    pieces.push(new Knight(7, 1, "black"));
    pieces.push(new Castle(8, 1, "black"));
    pieces.push(new Pawn(1, 2, "black"));
    pieces.push(new Pawn(2, 2, "black"));
    pieces.push(new Pawn(3, 2, "black"));
    pieces.push(new Pawn(4, 2, "black"));
    pieces.push(new Pawn(5, 2, "black"));
    pieces.push(new Pawn(6, 2, "black"));
    pieces.push(new Pawn(7, 2, "black"));
    pieces.push(new Pawn(8, 2, "black"));
    pieces.push(new Pawn(1, 7, "white"));
    pieces.push(new Pawn(2, 7, "white"));
    pieces.push(new Pawn(3, 7, "white"));
    pieces.push(new Pawn(4, 7, "white"));
    pieces.push(new Pawn(5, 7, "white"));
    pieces.push(new Pawn(6, 7, "white"));
    pieces.push(new Pawn(7, 7, "white"));
    pieces.push(new Pawn(8, 7, "white"));
    pieces.push(new Castle(1, 8, "white"));
    pieces.push(new Knight(2, 8, "white"));
    pieces.push(new Bishop(3, 8, "white"));
    pieces.push(new Queen(4, 8, "white"));
    pieces.push(new Bishop(6, 8, "white"));
    pieces.push(new Knight(7, 8, "white"));
    pieces.push(new Castle(8, 8, "white"));
    for (let i = 0; i < pieces.length; i++) {
        getSquare(pieces[i].x, pieces[i].y).setPiece(pieces[i]);
    }
};

let squareClicked = function(e) {
    let x = Number(this.getAttribute("data-x"));
    let y = Number(this.getAttribute("data-y"));
    let square = getSquare(x, y);
    if (selectedSquare === null) {
        if (square.piece === null) {
            showError("There is no piece here!");
        } else if (square.piece.color != currentPlayer.color) {
            showError("This is not your piece!");
        } else {
            selectedSquare = square;
            selectedSquare.select();
        }
    } else {
        if (selectedSquare.x == x && selectedSquare.y == y) {
            selectedSquare.deselect();
            selectedSquare = null;
        } else {
            if (square.piece != null && square.piece.color == currentPlayer.color) {
                selectedSquare.deselect();
                selectedSquare = square;
                selectedSquare.select();
            } else {
                move(selectedSquare, square);
            }
        }
    }
};

let move = function(start, end) {
    let piece = start.piece;
    currentPlayer.moved = piece;
    let moveResult = piece.isValidMove(end);
    if (currentPlayer == white) {
        black.checked = false;
        black.king.checkedBy = null;
    } else {
        white.checked = false;
        white.king.checkedBy = null;
    }
    if (moveResult.valid) {
        let capturedPiece = null;
        if (moveResult.capture !== null) {
            moveResult.capture.piece.capture();
            capturedPiece = moveResult.capture.piece;
            moveResult.capture.unsetPiece();
        }
        piece.x = end.x;
        piece.y = end.y;
        end.setPiece(piece);
        start.unsetPiece();
        if (kingExposed(currentPlayer.king)) {
            showError("That is an invalid move!");
            end.unsetPiece();
            piece.x = start.x;
            piece.y = start.y;
            start.setPiece(piece);
            if (moveResult.capture !== null) {
                capturedPiece.captured = false;
                moveResult.capture.setPiece(capturedPiece);
            }
            return;
        }
        end.piece.lastmoved = turn;
        start.unsetPiece();
        start.deselect();
        selectedSquare = null;
        if (moveResult.promote == true) {
            currentPlayer.promote = end.piece;
            showPromotion(currentPlayer);
            return;
        }
        if (currentPlayer == white) {
            if (end.piece.isValidMove(getSquare(black.king.x, black.king.y), 2).valid) {
                showError("Check");
                black.checked = true;
                black.king.checkedBy = end.piece;
            }
            if (kingExposed(black.king)) {
                black.checked = true;
                if (isCheckmate(black.king)) {
                    showError("Checkmate");
                    return;
                }
                showError("Check");
            }
        } else {
            if (end.piece.isValidMove(getSquare(white.king.x, white.king.y), 2).valid) {
                showError("Check");
                white.checked = true;
                white.king.checkedBy = end.piece;
            }
            if (kingExposed(white.king)) {
                white.checked = true;
                if (isCheckmate(white.king)) {
                    showError("Checkmate");
                    return;
                }
                showError("Check");
            }
        }
        nextTurn();
    } else {
        showError("That is an invalid move!");
        piece.x = start.x;
        piece.y = start.y;
        start.setPiece(piece);
    }
};

let isCheckmate = function(king) {
    let myPlayer = currentPlayer;
    let otherPlayer = currentPlayer == white ? black : white;
    currentPlayer = otherPlayer;
    if (currentPlayer.checked == false) {
        currentPlayer = myPlayer;
        return false;
    }
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (king.x + i <= 8 && king.x + i >= 1) {
                if (king.y + j <= 8 && king.y + j >= 1) {
                    if (i != 0 || j != 0) {
                        let square = getSquare(king.x + i, king.y + j);
                        if (square.piece != null && square.piece.color == currentPlayer.color) {
                            continue;
                        }
                        if (king.isValidMove(square).valid && !square.hasPiece()) {
                            let oldsquare = getSquare(king.x, king.y);
                            oldsquare.unsetPiece();
                            square.setPiece(king);
                            let kingId = king.color == "white" ? 0 : 1;
                            pieces[kingId].x = king.x + i;
                            pieces[kingId].y = king.y + j;
                            if (!kingExposed(currentPlayer.king)) {
                                square.unsetPiece();
                                oldsquare.setPiece(king);
                                pieces[kingId].x = oldsquare.x;
                                pieces[kingId].y = oldsquare.y;
                                currentPlayer = myPlayer;
                                return false;
                            }
                            square.unsetPiece();
                            oldsquare.setPiece(king);
                            pieces[kingId].x = oldsquare.x;
                            pieces[kingId].y = oldsquare.y;
                        }
                    }
                }
            }
        }
    }
    for (let i = 0; i < pieces.length; i++) {
        if (currentPlayer.color == pieces[i].color) {
            if (pieces[i].isValidMove(getSquare(king.checkedBy.x, king.checkedBy.y), 2).valid) {
                currentPlayer = myPlayer;
                return false;
            }
        }
    }
    if (king.checkedBy.piece instanceof Knight) return true;
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].captured == true) continue;
        if (currentPlayer.color == pieces[i].color) {
            if (pieces[i] instanceof Pawn) {
                for (let dir = 1; dir <= 2; dir++) {
                    let direction = currentPlayer.color == "white" ? -1 : 1;
                    let square = getSquare(pieces[i].x, pieces[i].y + direction * dir);
                    if (pieces[i].isValidMove(square, 2).valid) {
                        square.setPiece(pieces[i]);
                        if (!kingExposed(currentPlayer.king)) {
                            square.unsetPiece(pieces[i]);
                            currentPlayer = myPlayer;
                            return false;
                        }
                        square.unsetPiece(pieces[i]);
                    }
                }
            } else if (pieces[i] instanceof Knight) {
                for (let dir = 1; dir <= 2; dir++) {
                    let square = getSquare(pieces[i].x + (3 - dir), pieces[i].y + dir);
                    if (square != null && pieces[i].isValidMove(square, 2).valid) {
                        square.setPiece(pieces[i]);
                        if (!kingExposed(currentPlayer.king)) {
                            square.unsetPiece(pieces[i]);
                            currentPlayer = myPlayer;
                            return false;
                        }
                        square.unsetPiece(pieces[i]);
                    }
                    square = getSquare(pieces[i].x + (3 - dir), pieces[i].y - dir);
                    if (square != null && pieces[i].isValidMove(square, 2).valid) {
                        square.setPiece(pieces[i]);
                        if (!kingExposed(currentPlayer.king)) {
                            square.unsetPiece(pieces[i]);
                            currentPlayer = myPlayer;
                            return false;
                        }
                        square.unsetPiece(pieces[i]);
                    }
                    square = getSquare(pieces[i].x - dir, pieces[i].y + (3 - dir));
                    if (square != null && pieces[i].isValidMove(square, 2).valid) {
                        square.setPiece(pieces[i]);
                        if (!kingExposed(currentPlayer.king)) {
                            square.unsetPiece(pieces[i]);
                            currentPlayer = myPlayer;
                            return false;
                        }
                        square.unsetPiece(pieces[i]);
                    }
                    square = getSquare(pieces[i].x - dir, pieces[i].y - (3 - dir));
                    if (square != null && pieces[i].isValidMove(square, 2).valid) {
                        square.setPiece(pieces[i]);
                        if (!kingExposed(currentPlayer.king)) {
                            square.unsetPiece(pieces[i]);
                            currentPlayer = myPlayer;
                            return false;
                        }
                        square.unsetPiece(pieces[i]);
                    }
                }
            } else if (pieces[i] instanceof Castle) {
                for (let k = -8; k <= 8; k++) {
                    if (pieces[i].x + k >= 1 && pieces[i].x + k <= 8 && pieces[i].y + k >= 1 && pieces[i].y + k <= 8) {
                        let square = getSquare(pieces[i].x + k, pieces[i].y);
                        if (pieces[i].isValidMove(square, 2).valid) {
                            square.setPiece(pieces[i]);
                            if (!kingExposed(currentPlayer.king)) {
                                square.unsetPiece(pieces[i]);
                                currentPlayer = myPlayer;
                                return false;
                            }
                            square.unsetPiece(pieces[i]);
                        }
                        square = getSquare(pieces[i].x, pieces[i].y + k);
                        if (pieces[i].isValidMove(square, 2).valid) {
                            square.setPiece(pieces[i]);
                            if (!kingExposed(currentPlayer.king)) {
                                square.unsetPiece(pieces[i]);
                                currentPlayer = myPlayer;
                                return false;
                            }
                            square.unsetPiece(pieces[i]);
                        }
                    }
                }
            } else if (pieces[i] instanceof Bishop) {
                for (let k = -8; k <= 8; k++) {
                    let square = getSquare(pieces[i].x + k, pieces[i].y + k);
                    if (square != null && pieces[i].isValidMove(square, 2).valid) {
                        square.setPiece(pieces[i]);
                        if (!kingExposed(currentPlayer.king)) {
                            square.unsetPiece(pieces[i]);
                            currentPlayer = myPlayer;
                            return false;
                        }
                        square.unsetPiece(pieces[i]);
                    }
                    square = getSquare(pieces[i].x + k, pieces[i].y - k);
                    if (square != null && pieces[i].isValidMove(square, 2).valid) {
                        square.setPiece(pieces[i]);
                        if (!kingExposed(currentPlayer.king)) {
                            square.unsetPiece(pieces[i]);
                            currentPlayer = myPlayer;
                            return false;
                        }
                        square.unsetPiece(pieces[i]);
                    }
                }
            } else if (pieces[i] instanceof Queen) {
                for (let k = -8; k <= 8; k++) {
                    let square = getSquare(pieces[i].x + k, pieces[i].y + k);
                    if (square != null && pieces[i].isValidMove(square, 2).valid) {
                        square.setPiece(pieces[i]);
                        if (!kingExposed(currentPlayer.king)) {
                            square.unsetPiece(pieces[i]);
                            currentPlayer = myPlayer;
                            return false;
                        }
                        square.unsetPiece(pieces[i]);
                    }
                    square = getSquare(pieces[i].x + k, pieces[i].y - k);
                    if (square != null && pieces[i].isValidMove(square, 2).valid) {
                        square.setPiece(pieces[i]);
                        if (!kingExposed(currentPlayer.king)) {
                            square.unsetPiece(pieces[i]);
                            currentPlayer = myPlayer;
                            return false;
                        }
                        square.unsetPiece(pieces[i]);
                    }
                }
                for (let k = -8; k <= 8; k++) {
                    let square = getSquare(pieces[i].x + k, pieces[i].y);
                    if (square != null && pieces[i].isValidMove(square, 2).valid) {
                        square.setPiece(pieces[i]);
                        if (!kingExposed(currentPlayer.king)) {
                            square.unsetPiece(pieces[i]);
                            currentPlayer = myPlayer;
                            return false;
                        }
                        square.unsetPiece(pieces[i]);
                    }
                    square = getSquare(pieces[i].x, pieces[i].y + k);
                    if (square != null && pieces[i].isValidMove(square, 2).valid) {
                        square.setPiece(pieces[i]);
                        if (!kingExposed(currentPlayer.king)) {
                            square.unsetPiece(pieces[i]);
                            currentPlayer = myPlayer;
                            return false;
                        }
                        square.unsetPiece(pieces[i]);
                    }
                }
            } else {
                console.log(pieces[i]);
            }
        }
    }
    return true;
};

let showPromotion = function(player) {
    document.getElementById("terfi_mesaji").className = "overlay show";
    document.getElementById("promotionList").className = player.color;
};

let closePromotion = function() {
    document.getElementById("terfi_mesaji").className = "overlay";
};

let promote = function(type) {
    let newPiece;
    let oldPiece = currentPlayer.promote;
    let index = pieces.indexOf(oldPiece);
    switch (type) {
        case "queen":
            newPiece = new Queen(oldPiece.x, oldPiece.y, oldPiece.color);
            break;
        case "castle":
            newPiece = new Castle(oldPiece.x, oldPiece.y, oldPiece.color);
            break;
        case "bishop":
            newPiece = new Bishop(oldPiece.x, oldPiece.y, oldPiece.color);
            break;
        case "knight":
            newPiece = new Knight(oldPiece.x, oldPiece.y, oldPiece.color);
            break;
    }
    if (index != -1) {
        getSquare(oldPiece.x, oldPiece.y).unsetPiece();
        pieces[index] = newPiece;
        getSquare(oldPiece.x, oldPiece.y).setPiece(newPiece);
        currentPlayer.promote = null;
        closePromotion();
        if (currentPlayer == white) {
            if (newPiece.isValidMove(getSquare(black.king.x, black.king.y), 2).valid) {
                showError("Check");
                black.checked = true;
                black.king.checkedBy = newPiece;
            }
            if (kingExposed(black.king)) {
                showError("Check");
                black.checked = true;
                black.king.checkedBy = newPiece;
            }
        } else {
            if (newPiece.isValidMove(getSquare(white.king.x, white.king.y), 2).valid) {
                showError("Check");
                white.checked = true;
            }
            if (kingExposed(white.king)) {
                showError("Check");
                white.checked = true;
            }
        }
        nextTurn();
    }
};

let kingExposed = function(at) {
    for (let i = 0; i < pieces.length; i++) {
        let square = getSquare(pieces[i].x, pieces[i].y);
        if (pieces[i].color != at.color && pieces[i].captured == false) {
            if (pieces[i] instanceof Pawn) {
                let direction = pieces[i].color == "white" ? -1 : 1;
                let movementY = (at.y - pieces[i].y);
                let movementX = (at.x - pieces[i].x);
                if (movementY == direction) {
                    if (Math.abs(movementX) == 1) {
                        at.checkedBy = pieces[i];
                        return true;
                    }
                }
            } else {
                if (square.piece.isValidMove(getSquare(at.x, at.y)).valid) {
                    at.checkedBy = pieces[i];
                    console.log(getSquare(at.x, at.y));
                    console.log(pieces[i]);
                    return true;
                }
            }
        }
    }
    return false;
};

let nextTurn = function() {
    turn++;
    if (currentPlayer.color == "white") {
        currentPlayer = black;
        document.getElementById("turnInfo").innerHTML = "Hamle Sırası: <b>Siyah</b>";
    } else {
        currentPlayer = white;
        document.getElementById("turnInfo").innerHTML = "Hamle Sırası: <b>Beyaz</b>";
}
};