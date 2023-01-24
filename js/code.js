/*----- constants -----*/
const markers = {
    null: 'empty',
    m: 'white-dot',
    s: 'ship',
    h: 'red-dot'
}

// const boardInfo = {
//     playerBoard: 'player-board',
//     aiBoard: 'ai-board'
// }

const messages = {
    null : '.',
    h : 'Hit!',
    m: 'Miss!',
    1: 'You win!',
    '-1': 'Computer wins!',
}

const ships_length = {
    destroyer: 2,
    cruiser: 3,
    submarine: 3,
    battleship: 4,
    carrier: 5
}

/*----- state variables -----*/
let playerShipCount, aiShipCount, turn, winner, playerBoard, aiBoard, gameStart, shipsPlaced, aiLastMove, lastMoveIsHit, adjMoveCount, playerLastMove;

/*----- cached elements  -----*/
const playAgnBtn = document.querySelector('button');
const messageDisplay = document.querySelector('h1');
const playerBoardSquares = [...document.querySelectorAll('#player-board > div')];
const aiBoardSquares = [...document.querySelectorAll('#ai-board > div')];

/*----- event listeners -----*/
document.getElementById('ai-board').addEventListener('click', handleMove);
playAgnBtn.addEventListener('click', init);

/*----- functions -----*/

init();

function init() {
    playerBoard = [
        [null, 's', 's', null, 's', 's', 's', null, null, null],
        [null, 's', 's', 's', null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, 's', 's', 's', 's', null, null, null, null],
        [null, null, 's', 's', 's', 's', 's', null, null, null],
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
    // Removes classes on all div elements
    clearBoards();
    turn = 1;
    winner = null;
    playerShipCount = 17;
    aiShipCount = 17;
    gameStart = true;
    playerLastMove = null;
    shipsPlaced = 0;
    lastMoveIsHit = false;
    aiLastMove = [0, 0];
    adjMoveCount = 0;
    //playerChoosesShips()
    aiChoosesShips();
    render();
}

function clearBoards() {
    playerBoard.forEach(function(colArr, colIdx) {
        colArr.forEach(function(cell, rowIdx) {
            const square = document.querySelector(`#player-board #c${colIdx}r${rowIdx}`);
            square.removeAttribute('class');
        });
    });
    aiBoard.forEach(function(colArr, colIdx) {
        colArr.forEach(function(cell, rowIdx) {
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

//Put these into one function?
function renderPlayerBoard() {
    playerBoard.forEach(function(colArr, colIdx) {
        colArr.forEach(function(cell, rowIdx) {
            const square = document.querySelector(`#player-board #c${colIdx}r${rowIdx}`);
            //square.innerText = `${markers[cell]}`
            square.classList.add(`${markers[cell]}`);
        });
    });
}

function renderAiBoard() {
    aiBoard.forEach(function(colArr, colIdx) {
        colArr.forEach(function(cell, rowIdx) {
            const square = document.querySelector(`#ai-board #c${colIdx}r${rowIdx}`);
            square.classList.add(`${markers[cell]}`)
            //hides ships until they are hit
            //if (cell === 's') square.removeAttribute('class');
            //if (cell === 'h') square.classList.add('ship', 'red-dot');
        });
    });
}

function renderMessage() {
    if (winner) messageDisplay.innerHTML = `${messages[winner]}`
    else if (gameStart === false) {
        messageDisplay.innerHTML = `Choose your ship placements`
    }
    else {
        //Game is still in play
        messageDisplay.innerHTML = messages[playerLastMove];
    }

}

function renderControls() {
    playAgnBtn.style.visibility = winner ? 'visible' : 'hidden';
}

function playerChoosesShips() {
    //Player is in picking ships phase
    if (shipsPlaced < 5) {
        document.getElementById('ships').addEventListener('click', (e) => {
            let ship = e.target;
            //displays which ship is being targeted
            ship.style.color = 'red';
            //hovers over board
            //adds elements above and below to hover according to which ship is selected
            document.getElementById('player-board').addEventListener('mouseover', (e) => {
                let square = e.target;
                for (i=0; i<ships_length[ship.id]; i++) {
                    document.getElementById(`c${square.id[1]}r${(parseInt(square.id[3]))+i}`).style.backgroundColor = "black";
                }
            });
            //sets non-hovered divs back to background color
            document.getElementById('player-board').addEventListener('mouseout', (e) => {
                let square = e.target;
                square.style.backgroundColor = '#42a4f5';
                //Won't reset all squares
                for (i=0; i<ships_length[ship.id]; i++) {
                    document.getElementById(`c${square.id[1]}r${(parseInt(square.id[3]))+i}`).style.backgroundColor = "42a4f5";
                }
            });
            //sets playerBoard value to 's'
            document.getElementById('player-board').addEventListener('click', (e) => {
                playerBoard[e.target.id[1]][e.target.id[3]] = 's';
            });
            shipsPlaced++;
            render();
        });
    }
    return gameStart === true;
}

function aiChoosesShips() {
    const aiShips = [2, 3, 3, 4, 5];
    aiShips.forEach(function place(ship) {
        //if (aiBoard.includes('s') === 17) return;
        //console.log(aiBoard.includes('s'));

        //randomy chooses if alignment is vertical or horizontal
        //const vertAlign = Math.random() > 0.5 ? true : false;
        const vertAlign = true;
        //random number between 0 and 9
        //vertically align a ship
        //chooses random spaces to place ships
        //Can't pick squares that arent null
        const colIdx = getRandomNumber09();
        const rowIdx = getRandomNumber09();
        const square = aiBoard[colIdx][rowIdx];
        if (square === 's') return place();
        //aiBoard[colIdx][rowIdx] = 's'
        //console.log(square);
        //console.log(colIdx, rowIdx);
        if (vertAlign === true) { 
            for (i=0;i<ship;i++) {
                const newRowIdx = rowIdx + i;
                //console.log(colIdx, newRowIdx);
                if (newRowIdx > 9 || aiBoard[colIdx][newRowIdx] === 's') return place();
                aiBoard[colIdx][newRowIdx] = 's';
                //console.log(aiBoard[colIdx][rowIdx+ i])
            }
        }
        //horizonatally align a ship
        else {
            for (i=0;i<ship;i++) {
                const newColIdx = colIdx + i;
                if (newColIdx > 9 || aiBoard[newColIdx][rowIdx] === 's') return;
                aiBoard[newColIdx][rowIdx] = 's';
                //console.log(aiBoard[colIdx][rowIdx+ i])
            }
        }
    })
    console.log(aiBoard[2][5]);
    console.log(aiBoard.includes('s'));
    render();
};



function handleChooseShips(e) {
    //displays which ship is being targeted 
    e.target.style.color = 'red';
    //hovers over board
    document.getElementById('player-board').addEventListener('mouseover', (e) => {
        let square = e.target;
        square.style.backgroundColor = 'black';
        let elAbove = document.getElementById(`c${square.id[1]}r${(parseInt(square.id[3]))+1}`);
        console.log(elAbove);
        elAbove.style.backgroundColor = 'black';
    });
    //sets non-hovered divs back to background color
    document.getElementById('player-board').addEventListener('mouseout', (e) => {
        console.log('moouseleave')
        let square = e.target;
        console.log(square)
        square.style.backgroundColor = '#42a4f5';
        console.log(square);
        console.log(typeof(square.id[3]+1));
        let elAbove = document.getElementById(`c${square.id[1]}r${(parseInt(square.id[3]))+1}`);
        console.log(elAbove);
        elAbove.style.backgroundColor = '#42a4f5';
    });
    //sets playerBoard value to 's'
    document.getElementById('player-board').addEventListener('click', (e) => {
        playerBoard[e.target.id[1]][e.target.id[3]] = 's';
    });
    //won't change marker value on board until player clicks ship again
    render();
}

function handleMove(e) {
    //Player chooses a square to attack
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
        aiShipCount-= 1;
        playerLastMove = 'h';
    }
    turn *= -1;
    setTimeout(aiMove, 000);
    winner = getWinner();
    render();
}

function aiMove() {
    //get random indexes for col and row arrays
    let shot, colIdx, rowIdx, randAdjShot;
    const randColIdx = Math.floor(Math.random() * 9);
    const randRowIdx = Math.floor(Math.random() * 9);
    //ai will shoot at adjacent squares if their last move was a hit
    if (adjMoveCount > 4) lastMoveIsHit = false;
    if (lastMoveIsHit === true) {
        //random adjacent shots in four directions
        const randMoves = [
            [aiLastMove[0]+1, aiLastMove[1]], 
            [aiLastMove[0], aiLastMove[1]+1],
            [aiLastMove[0]-1, aiLastMove[1]],
            [aiLastMove[0], aiLastMove[1]-1]
        ]
        // const horShotRight = playerBoard[aiLastMove[0]+1][aiLastMove[1]];
        // const vertShotUp = playerBoard[aiLastMove[0]][aiLastMove[1]+1];
        // const horShotLeft = playerBoard[aiLastMove[0]+1][aiLastMove[1]];
        // const vertShotDown = playerBoard[aiLastMove[0]][aiLastMove[1]+1];
        randAdjShot = randMoves[Math.floor(Math.random() * 4)];
        colIdx = randAdjShot[0];
        //horizonal guard
        if (colIdx === -1) colIdx = 0
        if (colIdx === 10) colIdx = 9
        rowIdx = randAdjShot[1];
        //vertical guard
        if (rowIdx === -1) rowIdx = 0
        if (rowIdx === 10) rowIdx = 9
        adjMoveCount++;
    }
    //ai will target random squares if their last move was not a hit
    else {
        colIdx = randColIdx;
        rowIdx = randRowIdx;
    }
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
        playerShipCount-= 1;
    }
    console.log(adjMoveCount);
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

function getRandomNumber09() {
    return Math.floor(Math.random() * 9);
}


// [null, null, null, null, null, null, null, null, null, null],
//         [null, null, null, null, null, null, null, null, null, null],
//         [null, null, null, null, null, null, null, null, null, null],
//         [null, null, null, null, null, null, null, null, null, null],
//         [null, null, null, null, null, null, null, null, null, null],
//         [null, null, null, null, null, null, null, null, null, null],
//         [null, null, null, null, null, null, null, null, null, null],
//         [null, null, null, null, null, null, null, null, null, null],
//         [null, null, null, null, null, null, null, null, null, null],
//         [null, null, null, null, null, null, null, null, null, null]