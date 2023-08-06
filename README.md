# tic-tac-toe

[Live Demo](https://ashish-krishna-k.github.io/tic-tac-toe/)

A simple tic-tac-toe game played on the browser either against another player locally or against the computer. This project is built as a part of [The Odin Project's](https://www.theodinproject.com/) JavaScript course. 

*This project was originally built during my first run of The Odin Project(see [old branch](https://github.com/Ashish-Krishna-K/tic-tac-toe/tree/old)). During my second run, i'm reworking the projects but this time with more knowledge and skills. During my second run I have decieed to use TypeScript for all my projects as a practice*

## The UI 

The UI is fairly simple, when the page first loads the user is presented an option to select an opponent between a "Player Two" or the "Computer", if the user chooses to play against a local player they will be prompted to input the names of Player One and Player Two, once the user chooses an opponent and/or provides the names the user can click start game. If the user chooses to omit providing the names then the default name of "Player One" and "Player Two" will be assigned respectively.
*By default, Player one will always be "X" and player two will be "O", there's no option to change this currently, however this is planned feature.*

On clicking start game the page changes to the well-known tic-tac-toe board with a heading indicating which player's turn it is currently.
Now the players can take turns marking a grid tile, if playing against each other or alternatively the single player can mark any grid tile and wait for the 
computer's turn to end. Once one of the player gets a 3 in a row, the game will end and the heading will display who won the game or it will display a draw status if the game ended without a winner.

The user can click on Restart Game at any point of time to play a fresh game, however if they wish to play against computer(or a second player if in single player mode) or if they wish to change player names they will have to refresh the game.
*Another planned feature is allowing the user to "exit" to get back to the home screen without manually reloading.*

## The script

*The Odin Project's challenge for this project was to encapsulate all code inside a module pattern/factory function, with the ultimate goal of not having a single piece of gloabal code, the benefits of this pattern of coding was immediately apparant when I had to add in the functionality of a computer player as the refactoring was fairly simple although such pattern of coding does require ample time spent in the planning of the structure*

I start off with declaring a couple types and an interface so as to make it simple to type annotate when passing arguments.

First we have the **_gameBoard_** module, the module has a private grid array and the following public methods:
- **updateValue**
- **getRows**
- **getColumns**
- **getDiagonal**
- **getCellValue**
- **getLength**
- **resetGrid**

The method names are self-describing, the goal of the gameBoard module is to handle all logic related to the actual game board/grid.

Next we have the **_player_** factory function which simply returns a object with name and marker properties.

The **_computerPlayer_** module handles the logic involved in the computer player's actions, the module has a private method **generateRandNumb**, who's sole purpose is to generate a random number that corresponds to the indices of the grid matrix. It also has a public method **generateMove**, this will generate a valid move for the AI player and return it in the form of an object.
*A planned feature is to integrate an unbeatable mode using Minimax algorithm*

The **_gameController_** module is where the bulk of the game's logic lies, all of the actions which corresponds to the game's logic is housed in this module, it has the following private properties

- numOfTurnsPlayed
- winner
- playerOne
- playerTwo
- opponent

and a few private methods as shown below:

- **createPlayers**
- **playComputerTurn**
- **checkWinner**
- **checkTurnResult**

and also these four public methods exposed to other modules:

- **toggleOpponent**
- **startGame**
- **resetGame**
- **playTurn**

All the above mentioned properties and methods are named in a self-describing manner, as such I will not go into detail in explaining what they do.

And the final module is the **_displayController_** module, it handles all the DOM manupilation as such this is where all the variables holding various DOM elements resides.

Since this modules is concerned with manipulating DOM elements it handles some of these tasks directly inside the IIFE such as handling start-game and reset-button clicks and also handling the toggling of game mode selection. This(according to my understanding), violates the principle of no side effects of Functional Programming. please let me know if my understanding is correct, and if yes suggest me ways to not repeat this error.

The **_displayController_** module exposes a few methods such as:

- **getPlayerNameInputs**
- **renderGrid**
- **updateResultDisplay**
- **declareWinner**

Once again, the method names are self describing and I will skip the explanations. In addition to the above public methods, the module also has a private method, **getGridCellsList** which simply returns a nodeList of all the grid cell buttons.

