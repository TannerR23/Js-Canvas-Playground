var canvas;
var context;
var currGeneration = [];
var isSimulating = false;
var simulationInterval;
var cellSize = 5;
var tickRate = 25;
var generations = 0;

function resetGame(){
    isSimulating = false;
    generations = 0;
}

/*
*   Function to initialise the canvas and context to be used throughout
*   Then call to generate a random game
*/
function initialisation(){
    canvas = document.getElementById("conways-game");
    context = canvas.getContext("2d");

    randomConwayGame();
}

/*
*   Function to draw the grid using the 2d generation array
*/
function drawGrid(){
    context.clearRect(0,0, canvas.width, canvas.height);
    context.strokeStyle = "black";
    context.fillStyle = "black";

    for (let row = 0; row < currGeneration.length; row++) {
        for (let col = 0; col < currGeneration[row].length; col++) {
            let x = col * cellSize;
            let y = row * cellSize;

            context.strokeRect(x, y, cellSize, cellSize);

            //If the current cell is a 1, fill in the cell
            if(currGeneration[row][col] === 1){
                context.fillRect(x, y, cellSize, cellSize);
            }
        }
    }
}

/*
*   Function to clear the grid of all 'alive' cells
*/
function clearConwaysGame(){
    resetGame();

    for (var row = 0; row < currGeneration.length; row++) {
        for (var col = 0; col < currGeneration[row].length; col++) {
            currGeneration[row][col] = 0;
        }
    }

    drawGrid();
}

function randomConwayGame(){
    resetGame();
    currGeneration = [];

    for (let row = 0; row < canvas.height / cellSize; row++) {
        let currRow = [];
        for (let col = 0; col < canvas.width / cellSize; col++) {
            currRow.push(Math.floor(Math.random() * 2));
        }
        currGeneration.push(currRow);
    }

    drawGrid();
}

function simulateConwaysGame(){
    console.log("Clearing conways game");
}

function stopConwaysGame(){
    console.log("Clearing conways game");
}

function stepThroughConwaysGame(){
    console.log("Clearing conways game");
}