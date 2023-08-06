// We only want X or O passed as markers hence declaring a type.
type Markers = "X" | "O";
// a diagonals type because we want getDiagonal to accept only 1 | 2 as inputs.
type Diagonals = 1 | 2;

const gameBoard = (() => {
    // 2D array for storing the grid
    const grid: Markers[][] = [
        [],
        [],
        []
    ];
    // x and y here represents rows and column number respectively
    const updateValue = (row: number, column: number, marker: Markers) => {
        grid[row][column] = marker;
    }
    // rows corresponds to the parent array inside our grid, so we simply return
    // the corresponding row as a string
    const getRows = (rowNumber: number) => grid[rowNumber].join('');
    // we loop through each row(parent array) and grab the nth element(n refers to
    // the passed in value) and return it as a string
    const getColumns = (columnNumber: number) => {
        let column = '';
        for (let i = 0; i < grid.length; i++) {
            column += grid[i][columnNumber];
        }
        return column;
    }
    // There is two possible diagonals, the primary and secondary diagonals
    // for the primary diagonal if row = column that's the diagonal element
    // for the secondary diagonal if row = totalRows - column - 1 then it's 
    // the diagonal element, this function accepts either 1 or 2 as input
    // (controlled by the diagonals type declared earlier) if the argument 
    // is 1 we return the primary diagonal, if it's 2 we return the secondary
    // diagonal
    const getDiagonal = (diagonalNumber: Diagonals) => {
        let diagonal = '';
        if (diagonalNumber === 1) {
            for (let i = 0; i < grid.length; i++) {
                for (let j = 0; j < grid.length; j++) {
                    if (i === j) {
                        diagonal += grid[i][j];
                    }
                }
            }
        } else {
            for (let i = 0; i < grid.length; i++) {
                for (let j = 0; j < grid.length; j++) {
                    if ((i + j) === (grid.length - 1)) {
                        // using Math to check row = totalRows - column -1
                        diagonal += grid[i][j];
                    }
                }
            }
        }
        return diagonal;
    }
    // Instead of accesssing the whole grid/matrix we will let outsiders only get
    // individual cell value
    const getCellValue = (row: number, column: number) => grid[row][column];
    // We expose only the required methods while keeping the matrix private.
    const getLength = () => grid.length;

    const resetGrid = () => {
        grid.forEach(row => {
            row.splice(0, row.length);
        })
    }
    return {
        updateValue,
        getRows,
        getColumns,
        getDiagonal,
        getCellValue,
        getLength,
        resetGrid
    }
})();

// A player interface to avoid implicit any errors while defining,
// functions that expect a player object
interface Player {
    name: string,
    marker: Markers
}
const player = (playerName: string, marker: Markers): Player => {
    const name = playerName;
    return {
        name,
        marker
    }
}

const computerPlayer = (() => {
    // Generate a random number between 0 and 2
    const generateRandNumb = () => Math.floor(Math.random() * gameBoard.getLength());
    const generateMove = () => {
        let row = generateRandNumb();
        let column = generateRandNumb();
        // if the random-coordinates created is already marked,
        // we continue generating random coordinates untill we
        // generate one which is not already marked and then return
        // that as an object
        while (gameBoard.getCellValue(row, column)) {
            row = generateRandNumb();
            column = generateRandNumb();
        }
        return {
            row,
            column
        }
    }
    return {
        generateMove
    }
})()

// The gameController module will hold all the logic related to
// the gameflow
const gameController = (() => {
    // numOfTurnsPlayed is used to determine both a draw result
    // and to track which player's turn is it currently.
    let numOfTurnsPlayed = 0;
    let winner: Player | null = null;
    let playerOne: Player | null = null;
    let playerTwo: Player | null = null;
    let opponent: "Player" | "Computer" = "Player";

    const toggleOpponent = (targetValue: string) => {
        
    }

    const createPlayers = (playerOneName: string, playerTwoName: string) => {
        playerOne = player(playerOneName, "X");
        playerTwo = player(playerTwoName, "O");
    }

    const playTurn = (ev: MouseEvent) => {
        // Coordinates for each grid cell will be stored in x,y format as a value,
        // so we grab the value and split at the comma to get the coordinates array.
        const coordinates = (ev.target as HTMLButtonElement).value?.split(',') as string[];
        const row = parseInt(coordinates[0]);
        const column = parseInt(coordinates[1]);
        // we'll check if the move made by player is valid
        if (gameBoard.getCellValue(row, column)) return;
        // destructuring the displayController to grab only the required methods
        const { updateResultDisplay, renderGrid } = displayController;
        // This if statement is purely to shut TypeScript lol
        if (playerOne !== null && playerTwo !== null) {
            // this is simple if the numOfTurnsPlayed is even we 
            // will place playerOne's marker, if it's odd we will 
            // place playerTwo's marker, since the coordinates array is
            // a string array we're converting the values into number
            gameBoard.updateValue(row, column,
                numOfTurnsPlayed % 2 === 0 ? playerOne.marker : playerTwo.marker);
            numOfTurnsPlayed++
            // After each turn we re-render the grid
            renderGrid();
            // Updates the display area to show who play's next
            updateResultDisplay(numOfTurnsPlayed % 2 === 0 ? `${playerOne.name}'s Turn` : `${playerTwo.name}'s Turn`);
            // After each turn we check if there's a winner
            checkTurnResult();
        }
    }

    const checkWinner = (marking: string) => {
        switch (marking) {
            case ("XXX"):
                return playerOne;
            case ("OOO"):
                return playerTwo;
            default:
                return null;
        }
    }

    const checkTurnResult = () => {
        const { declareWinner } = displayController;
        // If the numOfTurnsPlayed is 8 or greater and the winner
        // is currently null it means the game is a draw
        if (numOfTurnsPlayed >= 9 && winner === null) {
            declareWinner(winner);
        } else {
            // check each row to see if there's a 3 in a row
            for (let i = 0; i < 3; i++) {
                const row = gameBoard.getRows(i);
                winner = checkWinner(row);
                if (winner !== null) {
                    declareWinner(winner);
                    return;
                };
            }
            // check each column to see if there's a 3 in a row
            for (let i = 0; i < 3; i++) {
                const column = gameBoard.getColumns(i);
                winner = checkWinner(column);
                if (winner !== null) {
                    declareWinner(winner);
                    return;
                };
            }
            // check each diagonal to see if there's a 3 in a row
            for (let i = 1 as Diagonals; i < 3; i++) {
                const diagonal = gameBoard.getDiagonal(i);
                winner = checkWinner(diagonal);
                if (winner !== null) {
                    declareWinner(winner);
                    return;
                };
            }
            return;
        }
    }

    const startGame = () => {
        const {
            playerOneNameInput,
            playerTwoNameInput,
            updateResultDisplay,
            renderGrid,
        } = displayController

        const playerOneName = (playerOneNameInput as HTMLInputElement).value || "Player One";
        const playerTwoName = (playerTwoNameInput as HTMLInputElement).value || "Player Two";

        // create new player objects passing the values of playerOneInput
        // and playerTwoInput as the playerNames
        createPlayers(playerOneName, playerTwoName);
        updateResultDisplay(`${playerOneName}'s Turn`)
        renderGrid();
    }

    const resetGame = () => {
        numOfTurnsPlayed = 0;
        winner = null;
        gameBoard.resetGrid();
        displayController.updateResultDisplay(`${playerOne?.name}'s Turn`);
        displayController.renderGrid();
    }

    return {
        toggleOpponent,
        startGame,
        resetGame,
        playTurn
    }

})();

const displayController = (() => {
    const playerNamesFrm = document.querySelector('section#form');
    const gridDisplay = document.querySelector('section#grid');
    const gameModeControls = document.querySelector('div.select-game-mode');
    const humanOpponentBtn = document.querySelector('button.select-human');
    const computerOpponenetBtn = document.querySelector('button.select-computer');
    const namesFrmDiv = document.querySelector('div.pseudo-form');
    const playerOneNameInput = document.querySelector('input#player-one');
    const playerTwoNameInput = document.querySelector('input#player-two');
    const startGameBtn = document.querySelector('button.start-game');
    const restartGameBtn = document.querySelector('button.reset-game');
    const resultDisplay = document.querySelector('h2.result-display');
    const gridContainer = document.querySelector('div.grid-container');

    gameModeControls?.childNodes.forEach(node => {
        (node as HTMLButtonElement).addEventListener("click", (ev) => {
            const targetValue = (ev.target as HTMLButtonElement).value;
            if (targetValue === "computer") {
                namesFrmDiv?.classList.add('hidden');
            } else if (targetValue === "human") {
                namesFrmDiv?.classList.remove('hidden');
            }
            gameController.toggleOpponent(targetValue);
        });
    });

    const updateResultDisplay = (msg: string) => {
        if (resultDisplay) {
            resultDisplay.textContent = msg
        };
    }
    const renderGrid = () => {
        // remove the hidden class from grid section and add it to the 
        // input name section
        playerNamesFrm?.classList.add('hidden');
        gridDisplay?.classList.remove('hidden');
        // remove all child elements of gridContainer
        while (gridContainer?.firstChild) {
            gridContainer.removeChild(gridContainer.firstChild);
        }
        // use nested loops to create a new grid
        const length = gameBoard.getLength();
        for (let i = 0; i < length; i++) {
            const gridRow = document.createElement('div');
            gridRow.classList.add('grid-row');
            for (let j = 0; j < length; j++) {
                const cell = document.createElement('button');
                cell.classList.add('grid-cell');
                // assign the values of i and j as x and y coordinates
                cell.value = `${i}, ${j}`;
                cell.textContent = gameBoard.getCellValue(i, j);
                cell.addEventListener("click", gameController.playTurn)
                gridRow.appendChild(cell);
            }
            gridContainer?.appendChild(gridRow);
        }
    }
    const getGridCellsList = () => document.querySelectorAll('button.grid-cell');

    const declareWinner = (winner: Player | null) => {
        // if winner object is null, it's a draw and we display accordingly,
        // if not null we'll display the winner name
        updateResultDisplay(winner ? `${winner.name} wins the game!` : "It's a draw!");
        // once we declare winner we'll remove the event listener from the grid
        // buttons
        getGridCellsList().forEach(btn => {
            (btn as HTMLButtonElement).removeEventListener("click", gameController.playTurn);
        })
    }

    (startGameBtn as HTMLButtonElement).addEventListener("click", gameController.startGame);
    (restartGameBtn as HTMLButtonElement).addEventListener("click", gameController.resetGame);

    return {
        playerOneNameInput,
        playerTwoNameInput,
        renderGrid,
        updateResultDisplay,
        startGameBtn,
        restartGameBtn,
        declareWinner
    }
})();
