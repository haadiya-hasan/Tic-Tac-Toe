const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameActive = false;
let mode = null; // 'pvp' or 'ai'

const winningCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];

cells.forEach(cell => cell.addEventListener("click", handleClick));

function setMode(selectedMode) {
    mode = selectedMode;
    restartGame();
    statusText.textContent =
        mode === "pvp" ? "Player X's turn" : "Your turn (X)";
}

function handleClick(e) {
    const index = e.target.dataset.index;

    if (!gameActive || board[index]) return;

    makeMove(index, currentPlayer);

    if (checkGameOver()) return;

    if (mode === "pvp") {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    } else {
        statusText.textContent = "AI thinking...";
        setTimeout(aiMove, 500);
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
}

function aiMove() {
    let available = board
        .map((v, i) => v === "" ? i : null)
        .filter(v => v !== null);

    // Win if possible
    for (let i of available) {
        board[i] = "O";
        if (checkWinner("O")) {
            finalizeAIMove(i, "AI wins 🤖");
            return;
        }
        board[i] = "";
    }

    // Block player
    for (let i of available) {
        board[i] = "X";
        if (checkWinner("X")) {
            board[i] = "O";
            cells[i].textContent = "O";
            checkGameOver();
            currentPlayer = "X";
            statusText.textContent = "Your turn (X)";
            return;
        }
        board[i] = "";
    }

    // Random
    const move = available[Math.floor(Math.random() * available.length)];
    finalizeAIMove(move);
}

function finalizeAIMove(index, message) {
    board[index] = "O";
    cells[index].textContent = "O";

    if (message) {
        statusText.textContent = message;
        gameActive = false;
    } else {
        checkGameOver();
        currentPlayer = "X";
        statusText.textContent = "Your turn (X)";
    }
}

function checkWinner(player) {
    return winningCombos.some(combo =>
        combo.every(i => board[i] === player)
    );
}

function checkGameOver() {
    if (checkWinner(currentPlayer)) {
        statusText.textContent =
            mode === "pvp"
                ? `Player ${currentPlayer} wins 🎉`
                : currentPlayer === "X"
                ? "You win 🎉"
                : "AI wins 🤖";
        gameActive = false;
        return true;
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a draw 😐";
        gameActive = false;
        return true;
    }
    return false;
}

function restartGame() {
    board = Array(9).fill("");
    cells.forEach(cell => cell.textContent = "");
    gameActive = true;
    currentPlayer = "X";
}
