import {
    findById,
    setInLocStorage,
    pullFromLocStorage,
    // clearLocStorage
} from '../common/utils.js';

const USER = 'USER';
const EIGHTDATA = 'EIGHTDATA';

let user = pullFromLocStorage(USER);

// GENERATED RESULTS DOM ELEMENTS //
let solvedCount = 0;
let movesCount = 0;
const resultsContainer = document.getElementById('results-display');
const winLoseMessageEl = document.createElement('p');
winLoseMessageEl.id = 'win-or-lose';
const solvedEl = document.createElement('p');
solvedEl.id = 'user-solved';
solvedEl.textContent = 'Solved: ' + solvedCount;

const movesEl = document.createElement('p');
movesEl.id = 'user-moves';
movesEl.classList.add('animate__animated', 'animate__bounce');
movesEl.textContent = 'Moves: ' + movesCount;

const movementMap = {
    9: [6, 8],
    8: [5, 7, 9],
    7: [4, 8],
    6: [3, 5, 9],
    5: [2, 4, 6, 8],
    4: [1, 5, 7],
    3: [2, 6],
    2: [1, 3, 5],
    1: [2, 4],
};

export function checkIfMovable(selectedTile) {
    const localStorageEightData = pullFromLocStorage(EIGHTDATA);
    let tile = findById(localStorageEightData, selectedTile);

    let emptyTile = findById(localStorageEightData, 9);
    let position = emptyTile.position;
    const moveable = movementMap[position];

    if (moveable.includes(tile.position)) {
        return true;
    } else {
        return false;
    }
}

export function moveTilesOnClick(selectedTile) {
    const localStorageEightData = pullFromLocStorage(EIGHTDATA);

    let emptyTile = localStorageEightData.find(tile => tile.id === 9);

    let emptyPosition = emptyTile.position;

    const selectedTileObject = findById(localStorageEightData, selectedTile);

    let selectedPosition = selectedTileObject.position;

    emptyTile.position = selectedPosition;

    selectedTileObject.position = emptyPosition;

    return localStorageEightData;
}

export function checkWinCondition(newTiles) {

    let condition = false;
    for (let i = 1; i < newTiles.length + 1; i++) {
        let tile = newTiles.find(item => item.position === i);
        // console.log(tile.position);
        // console.log(tile.id);
        if (tile.position !== tile.id) {
            condition = false;
            return false;
        } else {
            condition = true;
        }
    }
    return condition;
}

export function updateAndSetUserMoves() {
    movesCount++;
    movesEl.textContent = 'Moves: ' + movesCount;
    user.moves++;
    setInLocStorage(USER, user);
}

function winOrLose() {
    if (user.gamesWon >= 1) {
        return true;
    }
    else false;
}

export function renderResults() {
    solvedCount++;
    user.gamesWon++;
    solvedEl.textContent = 'Solved: ' + solvedCount;

    setInLocStorage(USER, user);

    let winState = winOrLose();

    // DISPLAY OF WINLOSE MESSAGE //
    winLoseMessageEl.style.display = 'flex';
    winLoseMessageEl.classList.add('animate__animated', 'animate__zoomInUp', 'animate__slow');
    winLoseMessageEl.addEventListener('animationend', () => {
        winLoseMessageEl.classList.remove('animate__zoomInUp');
        winLoseMessageEl.classList.add('animate__delay-2s', 'animate__hinge');
    });
    resultMessage(winState);

    resultsContainer.append(movesEl, solvedEl, winLoseMessageEl);

    function resultMessage(winState) {
        if (winState === true) {
            winLoseMessageEl.textContent = `Yahoo!!! Congrats, ${user.name}! You solved this puzzle in ${movesCount} moves!`;
        }
        else {
            winLoseMessageEl.textContent = `Awww, bummer! You couldn't solve the puzzle. Better luck next time, ${user.name}!`;
        }
        return winLoseMessageEl;
    }
}
