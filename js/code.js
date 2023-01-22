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
let playerShipCount, aiShipCount, turn, winner, playerBoard, aiBoard, gameStart, shipsPlaced;

/*----- cached elements  -----*/
const messageDisplay = document.querySelector('h1');
const playerBoardSquares = [...document.querySelectorAll('#player-board > div')];
const aiBoardSquares = [...document.querySelectorAll('#ai-board > div')];

/*----- event listeners -----*/
document.getElementById('ai-board').addEventListener('click', handleMove);

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
    turn = 1;
    winner = null;
    playerShipCount = 17;
    aiShipCount = 17;
    gameStart = true;
    shipsPlaced = 0;
    //playerChoosesShips()
    //aiChoosesShips();
    getWinner();
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
    aiShips.forEach(function(ship) {
        //randomy chooses if alignment is vertical or horizontal
        let vertAlign = Math.random() > 0.5 ? true : false;
        //random number between 0 and 9
        let randNum09 = Math.floor(Math.random() * 9)
        if (vertAlign) {

            //chooses random spaces to place ships 
            //Can't pick squares that arent null 
            const square = aiBoard[randNum09][randNum09];
            square = 's';
            for (i=0;i<ship.length;i++) {

            }
        }
        else {

        }
        randSpot
    })

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
    //obtain ai board index
    const square = e.target
    let shot = aiBoard[parseInt(square.id[1])][parseInt(square.id[3])];
    if (shot === null) aiBoard[parseInt(square.id[1])][parseInt(square.id[3])] = 'm';
    else if (shot === 's') {
        aiBoard[parseInt(square.id[1])][parseInt(square.id[3])] = 'h'};
        aiShipCount-= 1;
        console.log(aiShipCount);
    turn *= -1;
    render();
}

function getWinner() {
    if (aiShipCount === 0) {
        return console.log('player has won')
    }
    else if (playerShipCount === 0) {
        console.log('Ai has won')
    }
    else {
        return;
    }
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