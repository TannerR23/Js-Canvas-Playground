var container = document.getElementById("container");

/*
*   Function to clear the page
*/
function clearPage(){
    container.innerHTML = '';
}

/*
*   Function to dynamically set up for conways game of life
*/
function onclickConwaysGame(){
    clearPage();

    //title setup
    let title = document.createElement("h1");
    title.innerHTML = "Conway's Game of Life";
    container.appendChild(title);

    //Canvas setup
    let canvas = createCanvas("conways-game")
    let context = getContext(canvas);

    const conwaysGame = new ConwaysGame(canvas, context);

    let btnContainer = document.createElement("div");
    btnContainer.className = "btn-container";

    let clearBtn = document.createElement("button");
    clearBtn.innerText = "Clear";
    clearBtn.onclick = conwaysGame.clearConwaysGame.bind(conwaysGame);
    let randomGameBtn = document.createElement("button");
    randomGameBtn.innerText = "Random Game";
    randomGameBtn.onclick = conwaysGame.randomConwayGame.bind(conwaysGame);
    let simulateBtn = document.createElement("button");
    simulateBtn.innerText = "Simulate";
    simulateBtn.onclick = conwaysGame.simulateConwaysGame.bind(conwaysGame);
    let stopBtn = document.createElement("button");
    stopBtn.innerText = "Stop";
    stopBtn.onclick = conwaysGame.stopConwaysGame.bind(conwaysGame);
    let stepThroughBtn = document.createElement("button");
    stepThroughBtn.innerText = "Step Through";
    stepThroughBtn.onclick = conwaysGame.calcNextGeneration.bind(conwaysGame);

    btnContainer.appendChild(clearBtn);
    btnContainer.appendChild(randomGameBtn);
    btnContainer.appendChild(simulateBtn);
    btnContainer.appendChild(stopBtn);
    btnContainer.appendChild(stepThroughBtn);
    container.appendChild(btnContainer);

    //Create a random game
    conwaysGame.randomConwayGame();
}

function onclickFallingSand(){
    clearPage();

    //title setup
    let title = document.createElement("h1");
    title.innerHTML = "Falling Sand Simulation";
    container.appendChild(title);

    //Canvas setup
    let canvas = createCanvas("sand-simulation-canvas");
    let context = getContext(canvas);

    const fallingSandSim = new FallingSandSimulation(canvas, context);

    let btnContainer = document.createElement("div");
    btnContainer.className = "btn-container";
    let clearBtn = document.createElement("button");
    clearBtn.innerText = "Clear";
    clearBtn.onclick = fallingSandSim.initialiseSand.bind(fallingSandSim);
    btnContainer.appendChild(clearBtn);
    container.appendChild(btnContainer);

    fallingSandSim.initialiseSand();
}

function onclickMazeGeneration(){
    clearPage();

    //title setup
    let title = document.createElement("h1");
    title.innerHTML = "Maze Generation / Solver";
    container.appendChild(title);

    //Canvas setup
    let canvas = createCanvas("sand-simulation-canvas", 500, 500);
    let context = getContext(canvas);

    const mazeGen = new MazeGeneration(canvas, context);

    let btnContainer = document.createElement("div");
    btnContainer.className = "btn-container";
    let newMazeBtn = document.createElement("button");
    newMazeBtn.innerText = "New Maze";
    // newMazeBtn.onclick =
    let solveBtn = document.createElement("button");
    solveBtn.innerText = "Solve";
    // solveBtn.onclick =
    btnContainer.appendChild(newMazeBtn);
    btnContainer.appendChild(solveBtn);
    container.appendChild(btnContainer);

    mazeGen.initialiseGrid();
    mazeGen.drawGrid();
}

/*
*   Function to create a canvas given optional arguments of classname, width and height
*/
function createCanvas(canvasClassName = null, width = null, height = null){
    canvas = document.createElement("canvas");
    if(canvasClassName){
        canvas.id = canvasClassName;
    }
    canvas.width = width || container.getBoundingClientRect().width;
    canvas.height = height || 500;
    container.appendChild(canvas);

    return canvas
}

function getContext(canvas){
    return canvas.getContext("2d");
}