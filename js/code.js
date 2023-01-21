/*----- constants -----*/
const markers = {
    null: '#',
    m: 'o',
    s: '-',
    h: 'x'
}

// const boardInfo = {
//     playerBoard: 'player-board',
//     aiBoard: 'ai-board'
// }

const messages = {

}

const ships_length = {
    destroyer: 2,
    cruiser: 3,
    submarine: 3,
    battleship: 4,
    carrier: 5
}

/*----- state variables -----*/
let turn, winner, playerBoard, aiBoard, gameStart;

/*----- cached elements  -----*/
const messageDisplay = document.querySelector('h1');
const playerBoardSquares = [...document.querySelectorAll('#player-board > div')];

/*----- event listeners -----*/
// document.getElementById('ai-board').addEventListener('click', handleMove);
document.getElementById('ships').addEventListener('click', handleChooseShips)

/*----- functions -----*/

init();

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
    turn = 1;
    winner = null;
    gameStart = false;
    render();
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
            square.innerText = `${markers[cell]}`
        });
    });
}

function renderAiBoard() {
    aiBoard.forEach(function(colArr, colIdx) {
        colArr.forEach(function(cell, rowIdx) {
            const square = document.querySelector(`#ai-board #c${colIdx}r${rowIdx}`);
            square.innerText = `${markers[cell]}`;
        });
    });
}

function renderMessage() {
    if (winner) messageDisplay.innerHTML = `${winner} has won`
    else if (gameStart === false) {
        messageDisplay.innerHTML = `Choose your ship placements`
    }
    else {
        //Game is still in play
        messageDisplay.innerHTML = `Hit!`
    }

}

function renderControls() {

}




function handleChooseShips(e) {
    //displays which ship is being targeted 
    e.target.style.color = 'red';
    //hovers over board
    document.getElementById('player-board').addEventListener('mouseover', (e) => {
        let square = e.target;
        square.style.backgroundColor = 'black';
        console.log(square);
        console.log(e.target.id);
        // let elAbove = document.getElementById(`c${square[]}`)

    });
    document.getElementById('player-board').addEventListener('mouseleave', (e) => {
        e.target.style.backgroundColor = 'blue';
    });
}

function handleMove(e) {
    //guard
    e.target.innerText = '4';
}



