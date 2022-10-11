
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
})();

function playerOnePlays(name, marker) {
}



// the page should display a form to accept inputs for player 1 & player 2 name and a start game button
// pressing start game should assign player names to respective object values and hide the form and then fire the createplayarea function
// the createplayarea function should first input some default message in the turnindicator div
// it should then create a grid of 9 buttons and assign a dataset value called index to each of the buttons which is the same as the gameboard array
// an eventlistener should be assigned to each button to fire a playgame function
// the playgame function will first check if the counter is equal to or greater than 8 if true it will return displaywinner as tie
// if it's false it will then check if the button pressed already has a text content if true it will not do anything
// if this is false it will check if the counter value is even or odd
// if even it will run playeroneplays function if odd it will run playertwoplays function
// playeroneplays & playertwoplays will frist change the turnindicator value to player name then it will change the corresponding index in board array's value to player marker
// then it will change the this button's text content to player marker
// it will then run checkwinner function
// checkwinner function if called by playeroneplays/playertwoplays will check each row, colum, and diagnol to have consecutive 'x'es
// if this is true it will change winstatus to true and winner to player name
// if false it will return nothing/maintains status quo
// after playeroneplays/playertwoplays is executed the playgame function will check winstatus if it's false it will continue
// if false it will return displaywinner


const frm = document.querySelector('form');
const frmBtn = frm.querySelector('button');
const playArea = document.querySelector('#play-area')

const gamePlay =(() => {

    const playArea = document.querySelector('#play-area');
    const gameBoardArea = document.querySelector('#gameboard');
    const turnIndicator = document.querySelector('#turn');
    const buttons = gameBoardArea.querySelectorAll('button');

    const hideForm = () => {
        playerOne.name = document.getElementById('player-one').value;
        playerTwo.name = document.getElementById('player-two').value;
        frm.hidden = true;
        playArea.hidden = false;    
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
        console.log(helpers.counter);
        console.log(gameBoardObj.board)  
    }

    const playerOnePlays = (marker, indexNumber, buttonVal) => {
        gameBoardObj.board[indexNumber] = marker;
        buttonVal.textContent = gameBoardObj.board[indexNumber];
        return;    
    }

    const playerTwoPlays = (marker, indexNumber, buttonVal) => {
        gameBoardObj.board[indexNumber] = marker;
        buttonVal.textContent = gameBoardObj.board[indexNumber];
        return;    
    }

    return { 
        hideForm,
        buttons,
        playGame
    }
})();

frmBtn.addEventListener('click', gamePlay.hideForm);

gamePlay.buttons.forEach(button => button.addEventListener('click', gamePlay.playGame))

