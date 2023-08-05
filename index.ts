// The page loads with a form, for getting the names of Player 1 and Player 2.
// If the names are blank default to Player 1 and Player 2 respectively.

// When the user clicks on Play Game, apply the hidden class to the form section
// and remove the hidden class from the gameArea.

// The gameArea will have a h2 element indicating who's turn and their marker.
// Below the h2 it will have the grid of buttons where the users will play 
// the game by clicking on it.

// The gameBoard in script will be represented as a multi-dimensional array.
// Each co-ordinate in the grid will correspond to the index number in the grid,
// tied to the DOM through dataset.
// Basically the x-cooridinate in the board will correspond to the parent array,
// and y-coordinate will correspond to the child array.

// When the player click's on a grid tile, the corresponding array elemnt is 
// accesssed and the player's marker is appended to that array element.

// After each play, we will check the board for game completion, if there's a 
// winner/draw we will display it to the user and remove all event listeners 
// from the game board, if not we will proceed to the next play.

// We only want X or O passed as markers hence declaring a type.
type Markers = "X" | "O";

const gameBoard = (() => {
    // a diagonals type because we want getDiagonal to accept only 1 | 2 as inputs.
    type Diagonals = 1 | 2;
    // 2D array for storing the grid
    const grid:Markers[][] = [
        [],
        [],
        []
    ]
    // x and y here represents rows and column number respectively
    const updateValue = (row: number, column: number, marker:Markers) => {
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
    // We expose only the required methods while keeping the matrix private.
    return {
        updateValue,
        getRows,
        getColumns,
        getDiagonal
    }
})();

// A player interface to avoid implicit any errors while defining,
// functions that expect a player object
interface Player {
    name: string,
    marker: Markers
}
const player = (playerName: string, marker: Markers):Player => {
    const name = playerName;
    return {
        name,
        marker
    }
}

// The gameController module will hold all the logic related to
// the gameflow
const gameController  = (() => {
    // numOfTurnsPlayed is used to determine both a draw result
    // and to track which player's turn is it currently.
    let numOfTurnsPlayed = 0;
    let winner:Player | null = null;
    let playerOne:Player | null = null;
    let playerTwo:Player | null = null;

    const setPlayerOne = (playerName: string) => {
        playerOne = player(playerName, "X");
    }

    const setPlayerTwo = (playerName: string) => {
        playerTwo = player(playerName, "O");
    }

    const playTurn = (x:number, y:number) => {
        // This if statement is purely to shut TypeScript lol
        if (playerOne !== null && playerTwo !== null) {
            // this is simple if the numOfTurnsPlayed is even we 
            // will place playerOne's marker, if it's odd we will 
            // place playerTwo's marker
            gameBoard.updateValue(x, y, numOfTurnsPlayed % 2 === 0 ? playerOne.marker : playerTwo.marker);
            numOfTurnsPlayed++
        }
    }

    const checkTurnResult = () => {
        // If the numOfTurnsPlayed is 8 or greater and the winner
        // is currently null it means the game is a draw
        if (numOfTurnsPlayed >= 8 && winner === null) {
            // declare draw
        } else {
            // check each row to see if there's a 3 in a row
            for (let i = 0; i < 3; i++) {
                const row = gameBoard.getRows(i);
                winner = checkWinner(row);
                if (winner !== null) {
                    // declare winner
                    break;
                };
            }
            if (winner !== null) return;
            for (let i = 0; i < 3; i++) {
                const column = gameBoard.getColumns(i);
                winner = checkWinner(column);
                if (winner !== null) {
                    // declare winner
                    break;
                };
            }
            if (winner !== null) return;
            for (let i = 1; i < 3; i++) {
                const diagonal = gameBoard.getDiagonal(i);
                winner = checkWinner(diagonal);
                if (winner !== null) {
                    // declare winner
                    break;
                };
            }
            return;
        }
    }

    const checkWinner = (marking:string) => {
        switch (marking) {
            case ("XXX"):
                return playerOne;
            case ("OOO"):
                return playerTwo;
            default:
                return null;
        }
    }
})()