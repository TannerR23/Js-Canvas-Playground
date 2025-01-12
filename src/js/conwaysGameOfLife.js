var canvas;
var context;
var currGeneration = [];
var isSimulating = false;
var simulationInterval;
var cellSize = 10;
var tickRate = 25;
var generations = 0;
var isCanvasMouseDown = false;
var cellToggleMode = null;

function resetGame(){
    isSimulating = false;
    generations = 0;
}

/*
*   Toggles the cell's state during mouse actions
*/
function toggleCellOnMouseEvent(event) {
    //Check we are still holding the mouse down
    if (event.type === "mousedown") {
        isCanvasMouseDown = true;
    }
    if (!isCanvasMouseDown) return;

    // Get mouse position and calculate cell coordinates
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const col = Math.floor((mouseX * (canvas.width / rect.width)) / cellSize);
    const row = Math.floor((mouseY * (canvas.height / rect.height)) / cellSize);

    // Determine the initial toggle mode on the first interaction
    if (cellToggleMode === null) {
        cellToggleMode = currGeneration[row][col] === 1 ? 0 : 1;
    }

    // Toggle cell only if it differs from toggleMode and re-draw
    if (currGeneration[row][col] !== cellToggleMode) {
        currGeneration[row][col] = cellToggleMode;
        drawGrid();
    }
}

/*
*   Function to initialise the canvas and context to be used throughout
*   Then call to generate a random game
*/
function initialisation(){
    canvas = document.getElementById("conways-game");
    context = canvas.getContext("2d");

    /* event listeners on canvas for mouse down and move to toggle cells */
    canvas.addEventListener("mousedown", toggleCellOnMouseEvent);
    canvas.addEventListener("mousemove", toggleCellOnMouseEvent);

    /* event listeners on canvas for mouse up or leave to stop toggling cells and reset the toggle mode */
    canvas.addEventListener("mouseup", () => {
        isCanvasMouseDown = false;
        cellToggleMode = null;
    });
    canvas.addEventListener("mouseleave", () => {
        isCanvasMouseDown = false;
        cellToggleMode = null;
    });

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

/*
*   Function to genearte a grid with random number of 'alive' and 'dead' cells
*/
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

/* 
    Function to continously simulate conways game at a certain tick rate
*/
function simulateConwaysGame(){
    isSimulating = true;

    //Clear any existing interval to avoid multiple simulations
    if (simulationInterval){
        clearInterval(simulationInterval);
    }

    //Run the simulation every set tick rate
    simulationInterval = setInterval(() => {
        if(!isSimulating){
            clearInterval(simulationInterval);
            return;
        }

        calcNextGeneration();
    }, tickRate);
}

/* 
*   Function to calculate the next generation of 'alive' cells
*   Function requires a row and col to know which cell
*/
function calcNextGeneration(){
    let nextGeneration = [];

    for (let row = 0; row < currGeneration.length; row++) {
        let nextRow = [];
        for (let col = 0; col < currGeneration[row].length; col++) {
            let cell = 0;
            let neighbours = countNeighbours(row, col);
            console.log(neighbours)

            if(currGeneration[row][col] === 1 && (neighbours === 2 || neighbours === 3)){
                cell = 1;
            }
            else if(currGeneration[row][col] === 0 && neighbours === 3){
                cell = 1;
            }
            nextRow.push(cell);
        }
        nextGeneration.push(nextRow);
    }

    currGeneration = nextGeneration;
    drawGrid();
}

/*
*   Function to count the 8 neighbours around a cell given a row and column and returns this value
*   To account for edge cases of canvas - its neighbour wraps around the 'world'
*/
function countNeighbours(row, col){
    let numNeighbours = 0;
    let rows = currGeneration.length;
    let cols = currGeneration[row].length;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            //Skip if we are looking at the cell we are trying to count its neighbours for
            if (i === 0 && j === 0) continue;

            //Modulo to wrap around to the other side
            let rowNeighbour = (row + i + rows) % rows;
            let colNeighbour = (col + j + cols) % cols;

            //If this neighbouring cell is alive -- increase neighbour count
            if(currGeneration[rowNeighbour][colNeighbour] === 1){
                numNeighbours++;
            }
        }
    }

    return numNeighbours
}

/* 
*   Function to set flag to stop the simulation
*/
function stopConwaysGame(){
    isSimulating = false;
}