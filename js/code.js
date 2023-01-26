/*----- constants -----*/
const markers = {
    m: 'white-dot',
    h: 'red-dot',
    null: 'empty'
}

const messages = {
    null: 'Choose a square to shoot at',
    h: 'Hit!',
    m: 'Miss!',
    1: 'You win!',
    '-1': 'Computer wins!',
}

/*----- state variables -----*/
let playerShipCount, aiShipCount, winner, playerBoard, aiBoard, shipsPlaced, aiLastMove, lastMoveIsHit, adjMoveCount, playerLastMove, color, ignoreClicks;

/*----- cached elements  -----*/
const playAgnBtn = document.getElementById('play-again');
const messageDisplay = document.querySelector('h1');
const playerTurnMessage = document.getElementById('player-turn');
const aiTurnMessage = document.getElementById('ai-turn');
const closeModalButton = document.getElementById('modal-button');
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');
const modalColors = document.querySelector('#modal-colors')

/*----- event listeners -----*/
document.getElementById('ai-board').addEventListener('click', handleMove);
playAgnBtn.addEventListener('click', init);
closeModalButton.addEventListener('click', (e) => {
    modal.classList.remove('active');
    overlay.classList.remove('active');
})
modalColors.addEventListener('click', handleModalClick)

/*----- functions -----*/
initializeButtons();

function init() {
    playerBoard = [
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null]
    ];
    aiBoard = [
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null]
    ];
    clearBoards();
    winner = null;
    playerShipCount = 17;
    aiShipCount = 17;
    playerLastMove = null;
    shipsPlaced = 0;
    lastMoveIsHit = false;
    aiLastMove = [0, 0];
    adjMoveCount = 0;
    if (Object.keys(markers).some((val) => val === 's')) closeModalButton.disabled = false;
    playerTurnMessage.classList.add('player-turn');
    ignoreClicks = false;
    playerChoosesShips()
    aiChoosesShips();
    render();
}

function handleModalClick(e) {
    const divs = document.querySelectorAll('#modal-colors div');
    divs.forEach(function(div) {
        div.classList.remove('active');
    })
    e.target.classList.add('active');
    markers.s = e.target.classList[0];
    init();
}

function initializeButtons() {
    closeModalButton.disabled = true;
    playAgnBtn.style.visibility = 'hidden';
}

function clearBoards() {
    playerBoard.forEach(function (colArr, colIdx) {
        colArr.forEach(function (cell, rowIdx) {
            const square = document.querySelector(`#player-board #c${colIdx}r${rowIdx}`);
            square.removeAttribute('class');
        });
    });
    aiBoard.forEach(function (colArr, colIdx) {
        colArr.forEach(function (cell, rowIdx) {
            const square = document.querySelector(`#ai-board #c${colIdx}r${rowIdx}`);
            square.removeAttribute('class');
        });
    });

}

function render() {
    renderMessage();
    renderPlayerBoard();
    renderAiBoard();
    renderControls();
}

function renderPlayerBoard() {
    playerBoard.forEach(function (colArr, colIdx) {
        colArr.forEach(function (cell, rowIdx) {
            const square = document.querySelector(`#player-board #c${colIdx}r${rowIdx}`);
            square.classList.add(`${markers[cell]}`);
            
        });
    });
}

function renderAiBoard() {
    aiBoard.forEach(function (colArr, colIdx) {
        colArr.forEach(function (cell, rowIdx) {
            const square = document.querySelector(`#ai-board #c${colIdx}r${rowIdx}`);
            square.classList.add(`${markers[cell]}`);
            if (cell === 's') square.removeAttribute('class');
            if (cell === 'h') square.classList.add(`${markers.s}`, 'red-dot');
        });
    });
}

function renderMessage() {
    if (winner) messageDisplay.innerHTML = `${messages[winner]}`
    else {
        messageDisplay.innerHTML = messages[playerLastMove];
    }
}

function renderControls() {
    playAgnBtn.style.visibility = winner ? 'visible' : 'hidden';
}

function playerChoosesShips() {
    const playerShips = [2, 3, 3, 4, 5];
    while (playerShips.length) {
        const ship = playerShips.pop();
        const vertAlign = Math.random() > 0.5;
        const colIdx = getRandomBetween(0, 9);
        const rowIdx = getRandomBetween(0, 9);
        let validPlacement = true;
        for (i = 0; i < ship; i++) {
            const newRowIdx = vertAlign ? rowIdx + i : rowIdx;
            const newColIdx = vertAlign ? colIdx : colIdx + i;
            if (newRowIdx > 9 || newColIdx > 9 || playerBoard[newColIdx][newRowIdx] === 's') {
                validPlacement = false;
                break;
            }
        }
        if (validPlacement) {
            for (i = 0; i < ship; i++) {
                const newRowIdx = vertAlign ? rowIdx + i : rowIdx;
                const newColIdx = vertAlign ? colIdx : colIdx + i;
                playerBoard[newColIdx][newRowIdx] = 's';
            }
        } else {
            playerShips.push(ship);
            continue;
        }
    }
    render();
};

function aiChoosesShips() {
    const aiShips = [2, 3, 3, 4, 5];
    while (aiShips.length) {
        const ship = aiShips.pop();
        const vertAlign = Math.random() > 0.5;
        const colIdx = getRandomBetween(0, 9);
        const rowIdx = getRandomBetween(0, 9);
        let validPlacement = true;
        for (i = 0; i < ship; i++) {
            const newRowIdx = vertAlign ? rowIdx + i : rowIdx;
            const newColIdx = vertAlign ? colIdx : colIdx + i;
            if (newRowIdx > 9 || newColIdx > 9 || aiBoard[newColIdx][newRowIdx] === 's') {
                validPlacement = false;
                break;
            }
        }
        if (validPlacement) {
            for (i = 0; i < ship; i++) {
                const newRowIdx = vertAlign ? rowIdx + i : rowIdx;
                const newColIdx = vertAlign ? colIdx : colIdx + i;
                aiBoard[newColIdx][newRowIdx] = 's';
            }
        } else {
            aiShips.push(ship);
            continue;
        }
    }
    render();
};

function handleMove(e) {
    if (winner) return;
    if (e.target === NaN) return;
    if (ignoreClicks === true) return;
    let shot;
    const square = e.target
    shot = aiBoard[parseInt(square.id[1])][parseInt(square.id[3])];
    if (shot == 'm' || shot == 'h') {
        return;
    }
    else if (shot === null) {
        aiBoard[parseInt(square.id[1])][parseInt(square.id[3])] = 'm';
        playerLastMove = 'm';

    }
    else if (shot === 's') {
        aiBoard[parseInt(square.id[1])][parseInt(square.id[3])] = 'h';
        aiShipCount -= 1;
        playerLastMove = 'h';
    }
    turn = 1;
    aiTurnMessage.classList.add('ai-turn');
    playerTurnMessage.classList.remove('player-turn');
    ignoreClicks = true;
    setTimeout(aiMove, 500);
    render();
}

function aiMove() {
    playerTurnMessage.classList.add('player-turn');
    aiTurnMessage.classList.remove('ai-turn');
    let shot, colIdx, rowIdx, randAdjShot;
    const randColIdx = getRandomBetween(0, 9);
    const randRowIdx = getRandomBetween(0, 9);
    if (adjMoveCount > 4) lastMoveIsHit = false;
    if (lastMoveIsHit) {
        const randMoves = [
            [aiLastMove[0] + 1, aiLastMove[1]],
            [aiLastMove[0], aiLastMove[1] + 1],
            [aiLastMove[0] - 1, aiLastMove[1]],
            [aiLastMove[0], aiLastMove[1] - 1]
        ]
        randAdjShot = randMoves[getRandomBetween(0, 3)];
        colIdx = randAdjShot[0];
        if (colIdx === -1) colIdx = 0
        if (colIdx === 10) colIdx = 9
        rowIdx = randAdjShot[1];
        if (rowIdx === -1) rowIdx = 0
        if (rowIdx === 10) rowIdx = 9
        adjMoveCount++;
    }
    else {
        colIdx = randColIdx;
        rowIdx = randRowIdx;
    }
    console.log(colIdx, rowIdx);
    shot = playerBoard[colIdx][rowIdx];
    if (shot === 'm' || shot === 'h') {
        return aiMove();
    }
    else if (shot === null) {
        playerBoard[colIdx][rowIdx] = 'm';
    }
    else if (shot === 's') {
        playerBoard[colIdx][rowIdx] = 'h';
        aiLastMove = [colIdx, rowIdx];
        lastMoveIsHit = true;
        adjMoveCount = 0;
        playerShipCount -= 1;
    }
    winner = getWinner();
    ignoreClicks = false;
    render();
}

function getWinner() {
    if (aiShipCount === 0) {
        console.log('player has won');
        return winner = 1;
    }
    else if (playerShipCount === 0) {
        console.log('Ai has won')
        return winner = -1;
    }
    else {
        return;
    }
}

function getRandomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
