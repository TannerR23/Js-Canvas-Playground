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
    currGeneration = [];
    generations = 0;
}

function initialisation(){
    canvas = document.getElementById("conways-game");
    context = canvas.getContext("2d");

    randomConwayGame();
}

function drawGrid(){
    console.log("Drawing")
    context.clearRect(0,0, canvas.width, canvas.height);
    context.strokeStyle = "black";
    context.fillStyle = "black";

    for (let row = 0; row < currGeneration.length; row++) {
        for (let col = 0; col < currGeneration[row].length; col++) {
            let x = col * cellSize;
            let y = row * cellSize;

            context.strokeRect(x, y, cellSize, cellSize);

            if(currGeneration[row][col] === 1){
                context.fillRect(x, y, cellSize, cellSize);
            }
        }
    }
}

function clearConwaysGame(){
    console.log("Clearing conways game");
}

function randomConwayGame(){
    resetGame();

    console.log(canvas.height)
    console.log(canvas.height / cellSize)
    console.log(canvas.width)
    console.log(canvas.width / cellSize)
    for (let row = 0; row < canvas.height / cellSize; row++) {
        let currRow = [];
        for (let col = 0; col < canvas.width / cellSize; col++) {
            currRow.push(Math.floor(Math.random() * 2));
        }
        currGeneration.push(currRow);
    }

    console.table(currGeneration)

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