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

const gameBoard = (() => {
    type diagnols = 1 | 2;
    const matrix:string[][] = [
        [],
        [],
        []
    ]
    const getRows = (rowNumber: number) => matrix[rowNumber].join('');
    const getColumns = (columnNumber: number) => {
        let column = '';
        for (let i = 0; i < matrix.length; i++) {
            column += matrix[i][columnNumber];
        }
        return column;
    }
    const getDiagnols = (diagnolNumber: diagnols) => {
        let diagnol = '';
        if (diagnolNumber === 1) {
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix.length; j++) {
                    if (i === j) {
                        diagnol += matrix[i][j];
                    }
                }
            }
        } else {
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix.length; j++) {
                    if ((i + j) === (matrix.length - 1)) {
                        diagnol += matrix[i][j];
                    }
                }
            }
        }
        return diagnol;
    }
})();