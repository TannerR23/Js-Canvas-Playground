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
    let canvas = document.createElement("canvas");
    canvas.id = "conways-game"
    canvas.width = container.getBoundingClientRect().width;
    canvas.height = 500;
    container.appendChild(canvas);

    let btnContainer = document.createElement("div");
    btnContainer.className = "btn-container";

    let clearBtn = document.createElement("button");
    clearBtn.innerText = "Clear";
    clearBtn.onclick = clearConwaysGame;
    let randomGameBtn = document.createElement("button");
    randomGameBtn.innerText = "Random Game";
    randomGameBtn.onclick = randomConwayGame;
    let simulateBtn = document.createElement("button");
    simulateBtn.innerText = "Simulate";
    simulateBtn.onclick = simulateConwaysGame;
    let stopBtn = document.createElement("button");
    stopBtn.innerText = "Stop";
    stopBtn.onclick = stopConwaysGame;
    let stepThroughBtn = document.createElement("button");
    stepThroughBtn.innerText = "Step Through";
    stepThroughBtn.onclick = calcNextGeneration;

    btnContainer.appendChild(clearBtn);
    btnContainer.appendChild(randomGameBtn);
    btnContainer.appendChild(simulateBtn);
    btnContainer.appendChild(stopBtn);
    btnContainer.appendChild(stepThroughBtn);
    container.appendChild(btnContainer);

    //Create a random game
    initialisation();
}