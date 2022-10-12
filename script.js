const frm = document.querySelector('form');
const frmBtn = frm.querySelector('button');
const playArea = document.querySelector('#play-area')

const gameBoardObj = {
    board: ['', '', '', '', '', '', '', '', ''],
}

const playerOne = {
    name: 'Player 1',
    marker: 'X'
}

const playerTwo = {
    name: 'Player 2',
    marker: 'O'
}

const helpers = {
    counter: 0,
    winStatus: false,
    winner: ''
};

const createPlayarea =( () => {
    // this is a module that will return the reset game button which is accessed later

    const gameBoardArea = document.querySelector('#gameboard');
    const turnIndicator = document.querySelector('#turn');

    turnIndicator.textContent = 'Play Game!'    
    gameBoardObj.board.forEach(function(item, index){
        const displayButton = document.createElement('button');
        displayButton.classList.add('display');
        displayButton.dataset.index = index;
        displayButton.textContent = item;

        gameBoardArea.appendChild(displayButton);
    });

    const resetGameBtn = document.createElement('button');
    resetGameBtn.classList.add('reset')
    resetGameBtn.textContent = 'Reset Game'

    playArea.appendChild(resetGameBtn);

    return { resetGameBtn }

})();

const winArea = ( () => {
    //another module that returns 4 itmes all will be accessed in different situations later

    const resultArea = document.querySelector('#win-area');

    const displayResult = document.createElement('h1');
    displayResult.classList.add('winner-div');
    const playAgainBtn = document.createElement('button');
    playAgainBtn.classList.add('play-again');
    playAgainBtn.textContent = 'PLAY AGAIN'
    const exitGameBtn = document.createElement('button');
    exitGameBtn.classList.add('exit-game');
    exitGameBtn.textContent = 'EXIT GAME'

    resultArea.appendChild(displayResult);
    resultArea.appendChild(playAgainBtn);
    resultArea.appendChild(exitGameBtn);

    return { resultArea, displayResult, playAgainBtn, exitGameBtn }
})();

const gamePlay =(() => {

    // the main module has many different items some are public some are private

    const playArea = document.querySelector('#play-area');
    const gameBoardArea = document.querySelector('#gameboard');
    const turnIndicator = document.querySelector('#turn');
    const buttons = gameBoardArea.querySelectorAll('button');
    // the buttons is public as we need to access it to attach the event listener down the line

    const hideForm = () => {
        // this is also public as it's a event function
        playerOne.name = document.getElementById('player-one').value;
        playerTwo.name = document.getElementById('player-two').value;
        frm.hidden = true;
        frm.classList.add('hidden');
        playArea.hidden = false;
        playArea.classList.add('visible');    
    }

    const playGame = function () {

        if (this.textContent) {
            return;
        };

        const buttonIndex = this.dataset.index;
        const currentButton = this;

        const displayPlayerOneName = `${playerOne.name}'s turn(${playerOne.marker})`
        const displayPlayerTwoName = `${playerTwo.name}'s turn(${playerTwo.marker})`

        if (helpers.counter === 0 || helpers.counter === 2 || helpers.counter === 4 || helpers.counter === 6 || helpers.counter === 8) {
            playerOnePlays(playerOne.marker, buttonIndex, currentButton);
            turnIndicator.textContent = displayPlayerTwoName;
        } else if (helpers.counter === 1 || helpers.counter === 3 || helpers.counter === 5 || helpers.counter === 7) {
            playerTwoPlays(playerTwo.marker, buttonIndex, currentButton);
            turnIndicator.textContent = displayPlayerOneName;
        }
    
        helpers.counter++

    }

    const playerOnePlays = (marker, indexNumber, buttonVal) => {
        gameBoardObj.board[indexNumber] = marker;
        buttonVal.textContent = gameBoardObj.board[indexNumber];
        checkXWins(playerOne.marker);
        return;    
    }

    const playerTwoPlays = (marker, indexNumber, buttonVal) => {
        gameBoardObj.board[indexNumber] = marker;
        buttonVal.textContent = gameBoardObj.board[indexNumber];
        checkOWins(playerTwo.marker);
        return;    
    }

    // both the checkXWins and checkOWins are super long, inefficient and messy code as I couldn't figure out any other way to check for 3 same markers in a row.

    const checkXWins = (marker) => {
        if (gameBoardObj.board[0] === marker && gameBoardObj.board[1] === marker && gameBoardObj.board[2] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerOne.name
        }
        if (gameBoardObj.board[3] === marker && gameBoardObj.board[4] === marker && gameBoardObj.board[5] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerOne.name
        }
        if (gameBoardObj.board[6] === marker && gameBoardObj.board[7] === marker && gameBoardObj.board[8] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerOne.name
        }
        if (gameBoardObj.board[0] === marker && gameBoardObj.board[3] === marker && gameBoardObj.board[6] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerOne.name
        }
        if (gameBoardObj.board[1] === marker && gameBoardObj.board[4] === marker && gameBoardObj.board[7] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerOne.name
        }
        if (gameBoardObj.board[2] === marker && gameBoardObj.board[5] === marker && gameBoardObj.board[8] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerOne.name
        }
        if (gameBoardObj.board[0] === marker && gameBoardObj.board[4] === marker && gameBoardObj.board[8] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerOne.name
        }
        if (gameBoardObj.board[2] === marker && gameBoardObj.board[4] === marker && gameBoardObj.board[6] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerOne.name
        }
    }

    const checkOWins = (marker) => {
        if (gameBoardObj.board[0] === marker && gameBoardObj.board[1] === marker && gameBoardObj.board[2] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerTwo.name
        }
        if (gameBoardObj.board[3] === marker && gameBoardObj.board[4] === marker && gameBoardObj.board[5] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerTwo.name
        }
        if (gameBoardObj.board[6] === marker && gameBoardObj.board[7] === marker && gameBoardObj.board[8] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerTwo.name
        }
        if (gameBoardObj.board[0] === marker && gameBoardObj.board[3] === marker && gameBoardObj.board[6] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerTwo.name
        }
        if (gameBoardObj.board[1] === marker && gameBoardObj.board[4] === marker && gameBoardObj.board[7] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerTwo.name
        }
        if (gameBoardObj.board[2] === marker && gameBoardObj.board[5] === marker && gameBoardObj.board[8] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerTwo.name
        }
        if (gameBoardObj.board[0] === marker && gameBoardObj.board[4] === marker && gameBoardObj.board[8] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerTwo.name
        }
        if (gameBoardObj.board[2] === marker && gameBoardObj.board[4] === marker && gameBoardObj.board[6] === marker) {
            helpers.winStatus = true;
            helpers.winner = playerTwo.name
        }
    }

    const displaywinner = () => {

        if (helpers.winStatus) {
            playArea.hidden = true;
            playArea.classList.remove('visible')
            winArea.resultArea.hidden = false;
            winArea.resultArea.classList.add('visible')
            
            winArea.displayResult.textContent = `PLAYER "${helpers.winner}" WINS THE GAME`
        }

        if (helpers.counter === 9 && !helpers.winStatus) {
            playArea.hidden = true;
            playArea.classList.remove('visible')    
            winArea.resultArea.hidden = false;
            winArea.resultArea.classList.add('visible')
            
            winArea.displayResult.textContent = `IT'S A DRAW!!!`
        
        }
    }


    const resetGame = () => {
        gameBoardObj.board = ['', '', '', '', '', '', '', '', ''];
        helpers.counter = 0,
        helpers.winStatus = false,
        helpers.winner =  ''

        buttons.forEach(button => button.textContent = '')
    }

    return { 
        hideForm,
        buttons,
        playGame,
        displaywinner,
        resetGame
    }

})();

frmBtn.addEventListener('click', gamePlay.hideForm);

gamePlay.buttons.forEach(button => button.addEventListener('click', gamePlay.playGame));

gamePlay.buttons.forEach(button => button.addEventListener('click', gamePlay.displaywinner));

createPlayarea.resetGameBtn.addEventListener('click', gamePlay.resetGame);

winArea.playAgainBtn.addEventListener('click', function(){
    gamePlay.resetGame();

    playArea.hidden = false;
    playArea.classList.add('visible');    
    winArea.resultArea.hidden = true;
    winArea.resultArea.classList.remove('visible');
});

winArea.exitGameBtn.addEventListener('click', function(){
    console.log
    window.location.reload();
});




