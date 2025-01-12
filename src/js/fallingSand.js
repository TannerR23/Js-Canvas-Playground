class FallingSandSimulation{
    constructor(canvas, context){
        this.isSimulating = false;
        this.canvas = canvas;
        this.context = context;
        this.sandSize = 10;
        this.tickRate = 25;
        this.brushSize = 2;
        this.sandBox = [];

        /* event listeners on canvas for mouse down and move to toggle cells */
        this.canvas.addEventListener("mousedown", this.addSand.bind(this));
        this.canvas.addEventListener("mousemove", this.addSand.bind(this));
    
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

    initialiseSand(){
        this.sandBox = [];

    
        for (let row = 0; row < this.canvas.height / this.sandSize; row++) {
            let currRow = [];
            for (let col = 0; col < this.canvas.width / this.sandSize; col++) {
                currRow.push(0);
            }
            this.sandBox.push(currRow);
        }
    
        this.drawGrid();
    }

    /*
    *   Function to draw the grid using the 2d generation array
    */
    drawGrid(){
        this.context.clearRect(0,0, canvas.width, canvas.height);
        this.context.strokeStyle = "black";
        this.context.fillStyle = "black";
    
        for (let row = 0; row < this.sandBox.length; row++) {
            for (let col = 0; col < this.sandBox[row].length; col++) {
                let x = col * this.sandSize;
                let y = row * this.sandSize;
    
                this.context.strokeRect(x, y, this.sandSize, this.sandSize);

                if(this.sandBox[row][col] === 1){
                    this.context.fillRect(x, y, this.sandSize, this.sandSize);
                }
            }
        }
    }

    /*
    *   Function to simulate sand falling
    */
    simulate(){    
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
    
            this.calcNextSandPositions();
        }, this.tickRate);
    }

    calcNextSandPositions(){
        let newSandBox = [];

        //Initialise new sandBox
        for (let row = 0; row < this.canvas.height / this.sandSize; row++) {
            let currRow = [];
            for (let col = 0; col < this.canvas.width / this.sandSize; col++) {
                currRow.push(0);
            }
            newSandBox.push(currRow);
        }

        for (let row = 0; row < this.sandBox.length; row++) {
            for (let col = 0; col < this.sandBox[row].length; col++) {
                let canFallLeft = true;
                let canFallRight = true;
                if(col+1 >= this.sandBox[row].length){
                    canFallRight = false;
                }
                
                if(col-1 < 0){
                    canFallLeft = false;
                }

                if (this.sandBox[row][col] === 1) {
                    // Sand stays in same pos if at bottom of grid
                    if (row + 1 >= this.sandBox.length) {
                        newSandBox[row][col] = 1;
                    }
                    else if(this.sandBox[row + 1][col] === 1){
                        if(canFallLeft && canFallRight && this.sandBox[row + 1][col - 1] === 0 && this.sandBox[row + 1][col + 1] === 0){
                            const randomDir = Math.random() < 0.5 ? -1 : 1;
                            newSandBox[row + 1][col + randomDir] = 1;
                        }
                        else if(canFallLeft && this.sandBox[row + 1][col - 1] === 0){
                            newSandBox[row + 1][col - 1] = 1;
                        }
                        else if(canFallRight && this.sandBox[row + 1][col + 1] === 0){
                            newSandBox[row + 1][col + 1] = 1;
                        }
                        else{
                            newSandBox[row][col] = 1;
                        }
                    }
                    // Sand falls to the next row if empty
                    else if (this.sandBox[row + 1][col] === 0) {
                        newSandBox[row + 1][col] = 1;
                    } 
                }
            }
        }

        this.sandBox = newSandBox;
        this.drawGrid();
    }

    addSand(){
        this.isSimulating = true;

        //Check we are still holding the mouse down
        if (event.type === "mousedown") {
            this.isCanvasMouseDown = true;
        }
        if (!this.isCanvasMouseDown) return;
    
        // Get mouse position and calculate cell coordinates
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
    
        const col = Math.floor((mouseX * (this.canvas.width / rect.width)) / this.sandSize);
        const row = Math.floor((mouseY * (this.canvas.height / rect.height)) / this.sandSize);
    
        let brush = Math.ceil(this.brushSize/2);
        for (let i = -brush; i <= brush; i++) {
            for (let j = -brush; j <= brush; j++) {
                this.sandBox[row + i][col + j] = 1;
            }
        }

        this.drawGrid();

        // Start simulation if it's not already running
        if (!this.simulationInterval) {
            this.simulate();
        }
    }
}
