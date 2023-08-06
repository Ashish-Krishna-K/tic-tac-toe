var gameBoard = (function () {
    // 2D array for storing the grid
    var grid = [
        [],
        [],
        []
    ];
    // x and y here represents rows and column number respectively
    var updateValue = function (row, column, marker) {
        grid[row][column] = marker;
    };
    // rows corresponds to the parent array inside our grid, so we simply return
    // the corresponding row as a string
    var getRows = function (rowNumber) { return grid[rowNumber].join(''); };
    // we loop through each row(parent array) and grab the nth element(n refers to
    // the passed in value) and return it as a string
    var getColumns = function (columnNumber) {
        var column = '';
        for (var i = 0; i < grid.length; i++) {
            column += grid[i][columnNumber];
        }
        return column;
    };
    // There is two possible diagonals, the primary and secondary diagonals
    // for the primary diagonal if row = column that's the diagonal element
    // for the secondary diagonal if row = totalRows - column - 1 then it's 
    // the diagonal element, this function accepts either 1 or 2 as input
    // (controlled by the diagonals type declared earlier) if the argument 
    // is 1 we return the primary diagonal, if it's 2 we return the secondary
    // diagonal
    var getDiagonal = function (diagonalNumber) {
        var diagonal = '';
        if (diagonalNumber === 1) {
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid.length; j++) {
                    if (i === j) {
                        diagonal += grid[i][j];
                    }
                }
            }
        }
        else {
            for (var i = 0; i < grid.length; i++) {
                for (var j = 0; j < grid.length; j++) {
                    if ((i + j) === (grid.length - 1)) {
                        // using Math to check row = totalRows - column -1
                        diagonal += grid[i][j];
                    }
                }
            }
        }
        return diagonal;
    };
    // Instead of accesssing the whole grid/matrix we will let outsiders only get
    // individual cell value
    var getCellValue = function (row, column) { return grid[row][column]; };
    // We expose only the required methods while keeping the matrix private.
    var getLength = function () { return grid.length; };
    var resetGrid = function () {
        grid.forEach(function (row) {
            row.splice(0, row.length);
        });
    };
    return {
        updateValue: updateValue,
        getRows: getRows,
        getColumns: getColumns,
        getDiagonal: getDiagonal,
        getCellValue: getCellValue,
        getLength: getLength,
        resetGrid: resetGrid
    };
})();
var player = function (playerName, marker) {
    var name = playerName;
    return {
        name: name,
        marker: marker
    };
};
var computerPlayer = (function () {
    // Generate a random number between 0 and 2
    var generateRandNumb = function () { return Math.floor(Math.random() * gameBoard.getLength()); };
    var generateMove = function () {
        var row = generateRandNumb();
        var column = generateRandNumb();
        // if the random-coordinates created is already marked,
        // we continue generating random coordinates untill we
        // generate one which is not already marked and then return
        // that as an object
        while (gameBoard.getCellValue(row, column)) {
            row = generateRandNumb();
            column = generateRandNumb();
        }
        return {
            row: row,
            column: column
        };
    };
    return {
        generateMove: generateMove
    };
})();
// The gameController module will hold all the logic related to
// the gameflow
var gameController = (function () {
    // numOfTurnsPlayed is used to determine both a draw result
    // and to track which player's turn is it currently.
    var numOfTurnsPlayed = 0;
    var winner = null;
    var playerOne = null;
    var playerTwo = null;
    var opponent = "Player";
    var toggleOpponent = function (targetValue) {
        if (targetValue === "human") {
            opponent = "Player";
        }
        if (targetValue === "computer") {
            opponent = "Computer";
        }
    };
    var createPlayers = function (playerOneName, playerTwoName) {
        playerOne = player(playerOneName, "X");
        playerTwo = player(playerTwoName, "O");
    };
    var playTurn = function (ev) {
        var _a;
        // Coordinates for each grid cell will be stored in x,y format as a value,
        // so we grab the value and split at the comma to get the coordinates array.
        var coordinates = (_a = ev.target.value) === null || _a === void 0 ? void 0 : _a.split(',');
        var row = parseInt(coordinates[0]);
        var column = parseInt(coordinates[1]);
        // we'll check if the move made by player is valid
        if (gameBoard.getCellValue(row, column))
            return;
        // destructuring the displayController to grab only the required methods
        var updateResultDisplay = displayController.updateResultDisplay, renderGrid = displayController.renderGrid;
        // This if statement is purely to shut TypeScript lol
        if (playerOne !== null && playerTwo !== null) {
            // this is simple if the numOfTurnsPlayed is even we 
            // will place playerOne's marker, if it's odd we will 
            // place playerTwo's marker, since the coordinates array is
            // a string array we're converting the values into number
            gameBoard.updateValue(row, column, numOfTurnsPlayed % 2 === 0 ? playerOne.marker : playerTwo.marker);
            numOfTurnsPlayed++;
            // After each turn we re-render the grid
            renderGrid();
            // Updates the display area to show who play's next
            updateResultDisplay(numOfTurnsPlayed % 2 === 0 ? "".concat(playerOne.name, "'s Turn") : "".concat(playerTwo.name, "'s Turn"));
            // After each turn we check if there's a winner
            checkTurnResult();
            // Make computer's move in the case opponent is computer
            if (winner === null && opponent === "Computer") {
                // Put a delay of 5 seconds to prevent computer's play from appearing instantly
                setTimeout(playComputerTurn, 1000);
            }
        }
    };
    var playComputerTurn = function () {
        if (playerOne !== null && playerTwo !== null) {
            var computerMove = computerPlayer.generateMove();
            gameBoard.updateValue(computerMove.row, computerMove.column, playerTwo.marker);
            numOfTurnsPlayed++;
            displayController.renderGrid();
            displayController.updateResultDisplay(numOfTurnsPlayed % 2 === 0 ? "".concat(playerOne.name, "'s Turn") : "".concat(playerTwo.name, "'s Turn"));
            checkTurnResult();
        }
    };
    var checkWinner = function (marking) {
        switch (marking) {
            case ("XXX"):
                return playerOne;
            case ("OOO"):
                return playerTwo;
            default:
                return null;
        }
    };
    var checkTurnResult = function () {
        var declareWinner = displayController.declareWinner;
        // If the numOfTurnsPlayed is 8 or greater and the winner
        // is currently null it means the game is a draw
        if (numOfTurnsPlayed >= 9 && winner === null) {
            declareWinner(winner);
        }
        else {
            // check each row to see if there's a 3 in a row
            for (var i = 0; i < 3; i++) {
                var row = gameBoard.getRows(i);
                winner = checkWinner(row);
                if (winner !== null) {
                    declareWinner(winner);
                    return;
                }
                ;
            }
            // check each column to see if there's a 3 in a row
            for (var i = 0; i < 3; i++) {
                var column = gameBoard.getColumns(i);
                winner = checkWinner(column);
                if (winner !== null) {
                    declareWinner(winner);
                    return;
                }
                ;
            }
            // check each diagonal to see if there's a 3 in a row
            for (var i = 1; i < 3; i++) {
                var diagonal = gameBoard.getDiagonal(i);
                winner = checkWinner(diagonal);
                if (winner !== null) {
                    declareWinner(winner);
                    return;
                }
                ;
            }
            return;
        }
    };
    var startGame = function () {
        var playerOneNameInput = displayController.playerOneNameInput, playerTwoNameInput = displayController.playerTwoNameInput, updateResultDisplay = displayController.updateResultDisplay, renderGrid = displayController.renderGrid;
        if (opponent === "Player") {
            var playerOneName = playerOneNameInput.value || "Player One";
            var playerTwoName = playerTwoNameInput.value || "Player Two";
            // create new player objects passing the values of playerOneInput
            // and playerTwoInput as the playerNames
            createPlayers(playerOneName, playerTwoName);
            updateResultDisplay("".concat(playerOneName, "'s Turn"));
        }
        else {
            createPlayers("Player", "Computer");
            updateResultDisplay("Player's Turn");
        }
        renderGrid();
    };
    var resetGame = function () {
        numOfTurnsPlayed = 0;
        winner = null;
        gameBoard.resetGrid();
        displayController.updateResultDisplay("".concat(playerOne === null || playerOne === void 0 ? void 0 : playerOne.name, "'s Turn"));
        displayController.renderGrid();
    };
    return {
        toggleOpponent: toggleOpponent,
        startGame: startGame,
        resetGame: resetGame,
        playTurn: playTurn
    };
})();
var displayController = (function () {
    var playerNamesFrm = document.querySelector('section#form');
    var gridDisplay = document.querySelector('section#grid');
    var gameModeControls = document.querySelector('div.select-game-mode');
    var humanOpponentBtn = document.querySelector('button.select-human');
    var computerOpponenetBtn = document.querySelector('button.select-computer');
    var namesFrmDiv = document.querySelector('div.pseudo-form');
    var playerOneNameInput = document.querySelector('input#player-one');
    var playerTwoNameInput = document.querySelector('input#player-two');
    var startGameBtn = document.querySelector('button.start-game');
    var restartGameBtn = document.querySelector('button.reset-game');
    var resultDisplay = document.querySelector('h2.result-display');
    var gridContainer = document.querySelector('div.grid-container');
    gameModeControls === null || gameModeControls === void 0 ? void 0 : gameModeControls.childNodes.forEach(function (node) {
        node.addEventListener("click", function (ev) {
            var targetValue = ev.target.value;
            if (targetValue === "computer") {
                namesFrmDiv === null || namesFrmDiv === void 0 ? void 0 : namesFrmDiv.classList.add('hidden');
            }
            else if (targetValue === "human") {
                namesFrmDiv === null || namesFrmDiv === void 0 ? void 0 : namesFrmDiv.classList.remove('hidden');
            }
            gameController.toggleOpponent(targetValue);
        });
    });
    var updateResultDisplay = function (msg) {
        if (resultDisplay) {
            resultDisplay.textContent = msg;
        }
        ;
    };
    var renderGrid = function () {
        // remove the hidden class from grid section and add it to the 
        // input name section
        playerNamesFrm === null || playerNamesFrm === void 0 ? void 0 : playerNamesFrm.classList.add('hidden');
        gridDisplay === null || gridDisplay === void 0 ? void 0 : gridDisplay.classList.remove('hidden');
        // remove all child elements of gridContainer
        while (gridContainer === null || gridContainer === void 0 ? void 0 : gridContainer.firstChild) {
            gridContainer.removeChild(gridContainer.firstChild);
        }
        // use nested loops to create a new grid
        var length = gameBoard.getLength();
        for (var i = 0; i < length; i++) {
            var gridRow = document.createElement('div');
            gridRow.classList.add('grid-row');
            for (var j = 0; j < length; j++) {
                var cell = document.createElement('button');
                cell.classList.add('grid-cell');
                // assign the values of i and j as x and y coordinates
                cell.value = "".concat(i, ", ").concat(j);
                cell.textContent = gameBoard.getCellValue(i, j);
                cell.addEventListener("click", gameController.playTurn);
                gridRow.appendChild(cell);
            }
            gridContainer === null || gridContainer === void 0 ? void 0 : gridContainer.appendChild(gridRow);
        }
    };
    var getGridCellsList = function () { return document.querySelectorAll('button.grid-cell'); };
    var declareWinner = function (winner) {
        // if winner object is null, it's a draw and we display accordingly,
        // if not null we'll display the winner name
        updateResultDisplay(winner ? "".concat(winner.name, " wins the game!") : "It's a draw!");
        // once we declare winner we'll remove the event listener from the grid
        // buttons
        getGridCellsList().forEach(function (btn) {
            btn.removeEventListener("click", gameController.playTurn);
        });
    };
    startGameBtn.addEventListener("click", gameController.startGame);
    restartGameBtn.addEventListener("click", gameController.resetGame);
    return {
        playerOneNameInput: playerOneNameInput,
        playerTwoNameInput: playerTwoNameInput,
        renderGrid: renderGrid,
        updateResultDisplay: updateResultDisplay,
        startGameBtn: startGameBtn,
        restartGameBtn: restartGameBtn,
        declareWinner: declareWinner
    };
})();
