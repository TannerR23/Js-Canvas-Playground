class ConwaysGame{
    constructor(canvas, context){
        this.canvas = canvas;
        this.context = context;
        this.isSimulating = false;
        this.generations = 0;
        this.cellSize = 10;
        this.tickRate = 25;
        this.currGeneration = [];
        this.simulationInterval = null;
        this.isCanvasMouseDown = false;
        this.cellToggleMode = null;

        /* event listeners on canvas for mouse down and move to toggle cells */
        this.canvas.addEventListener("mousedown", this.toggleCellOnMouseEvent.bind(this));
        this.canvas.addEventListener("mousemove", this.toggleCellOnMouseEvent.bind(this));
    
        /* event listeners on canvas for mouse up or leave to stop toggling cells and reset the toggle mode */
        this.canvas.addEventListener("mouseup", () => {
            this.isCanvasMouseDown = false;
            this.cellToggleMode = null;
        });
        this.canvas.addEventListener("mouseleave", () => {
            this.isCanvasMouseDown = false;
            this.cellToggleMode = null;
        });
    }

    resetGame(){
        this.isSimulating = false;
        this.generations = 0;
    }
    
    /*
    *   Toggles the cell's state during mouse actions
    */
    toggleCellOnMouseEvent(event) {
        //Check we are still holding the mouse down
        if (event.type === "mousedown") {
            this.isCanvasMouseDown = true;
        }
        if (!this.isCanvasMouseDown) return;
    
        // Get mouse position and calculate cell coordinates
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
    
        const col = Math.floor((mouseX * (this.canvas.width / rect.width)) / this.cellSize);
        const row = Math.floor((mouseY * (this.canvas.height / rect.height)) / this.cellSize);
    
        // Determine the initial toggle mode on the first interaction
        if (this.cellToggleMode === null) {
            this.cellToggleMode = this.currGeneration[row][col] === 1 ? 0 : 1;
        }
    
        // Toggle cell only if it differs from toggleMode and re-draw
        if (this.currGeneration[row][col] !== this.cellToggleMode) {
            this.currGeneration[row][col] = this.cellToggleMode;
            this.drawGrid();
        }
    }
    
    /*
    *   Function to draw the grid using the 2d generation array
    */
    drawGrid(){
        this.context.clearRect(0,0, canvas.width, canvas.height);
        this.context.strokeStyle = "black";
        this.context.fillStyle = "black";
    
        for (let row = 0; row < this.currGeneration.length; row++) {
            for (let col = 0; col < this.currGeneration[row].length; col++) {
                let x = col * this.cellSize;
                let y = row * this.cellSize;
    
                this.context.strokeRect(x, y, this.cellSize, this.cellSize);
    
                //If the current cell is a 1, fill in the cell
                if(this.currGeneration[row][col] === 1){
                    this.context.fillRect(x, y, this.cellSize, this.cellSize);
                }
            }
        }
    }
    
    /*
    *   Function to clear the grid of all 'alive' cells
    */
    clearConwaysGame(){
        this.resetGame();
    
        for (var row = 0; row < this.currGeneration.length; row++) {
            for (var col = 0; col < this.currGeneration[row].length; col++) {
                this.currGeneration[row][col] = 0;
            }
        }
    
        this.drawGrid();
    }
    
    /*
    *   Function to genearte a grid with random number of 'alive' and 'dead' cells
    */
    randomConwayGame(){
        this.resetGame();
        this.currGeneration = [];
    
        for (let row = 0; row < this.canvas.height / this.cellSize; row++) {
            let currRow = [];
            for (let col = 0; col < this.canvas.width / this.cellSize; col++) {
                currRow.push(Math.floor(Math.random() * 2));
            }
            this.currGeneration.push(currRow);
        }
    
        this.drawGrid();
    }
    
    /* 
        Function to continously simulate conways game at a certain tick rate
    */
    simulateConwaysGame(){
        this.isSimulating = true;
    
        //Clear any existing interval to avoid multiple simulations
        if (this.simulationInterval){
            clearInterval(this.simulationInterval);
        }
    
        //Run the simulation every set tick rate
        this.simulationInterval = setInterval(() => {
            if(!this.isSimulating){
                clearInterval(this.simulationInterval);
                return;
            }
    
            this.calcNextGeneration();
        }, this.tickRate);
    }
    
    /* 
    *   Function to calculate the next generation of 'alive' cells
    *   Function requires a row and col to know which cell
    */
    calcNextGeneration(){
        let nextGeneration = [];
    
        for (let row = 0; row < this.currGeneration.length; row++) {
            let nextRow = [];
            for (let col = 0; col < this.currGeneration[row].length; col++) {
                let cell = 0;
                let neighbours = this.countNeighbours(row, col);
    
                if(this.currGeneration[row][col] === 1 && (neighbours === 2 || neighbours === 3)){
                    cell = 1;
                }
                else if(this.currGeneration[row][col] === 0 && neighbours === 3){
                    cell = 1;
                }
                nextRow.push(cell);
            }
            nextGeneration.push(nextRow);
        }
    
        this.currGeneration = nextGeneration;
        this.drawGrid();
    }
    
    /*
    *   Function to count the 8 neighbours around a cell given a row and column and returns this value
    *   To account for edge cases of canvas - its neighbour wraps around the 'world'
    */
    countNeighbours(row, col){
        let numNeighbours = 0;
        let rows = this.currGeneration.length;
        let cols = this.currGeneration[row].length;
    
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                //Skip if we are looking at the cell we are trying to count its neighbours for
                if (i === 0 && j === 0) continue;
    
                //Modulo to wrap around to the other side
                let rowNeighbour = (row + i + rows) % rows;
                let colNeighbour = (col + j + cols) % cols;
    
                //If this neighbouring cell is alive -- increase neighbour count
                if(this.currGeneration[rowNeighbour][colNeighbour] === 1){
                    numNeighbours++;
                }
            }
        }
    
        return numNeighbours
    }
    
    /* 
    *   Function to set flag to stop the simulation
    */
    stopConwaysGame(){
        this.isSimulating = false;
    }
}