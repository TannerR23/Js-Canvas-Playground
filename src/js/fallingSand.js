class FallingSandSimulation{
    constructor(canvas, context){
        this.isSimulating = false;
        this.canvas = canvas;
        this.context = context;
        this.sandSize = 10;
        this.tickRate = 25;
        this.sand = [];

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
        this.sand = [];
    
        for (let row = 0; row < this.canvas.height / this.sandSize; row++) {
            let currRow = [];
            for (let col = 0; col < this.canvas.width / this.sandSize; col++) {
                currRow.push(0);
            }
            this.sand.push(currRow);
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
    
        for (let row = 0; row < this.sand.length; row++) {
            for (let col = 0; col < this.sand[row].length; col++) {
                let x = col * this.sandSize;
                let y = row * this.sandSize;
    
                this.context.strokeRect(x, y, this.sandSize, this.sandSize);

                if(this.sand[row][col] === 1){
                    this.context.fillRect(x, y, this.sandSize, this.sandSize);
                }
            }
        }

        //call to start simulating
        this.simulate();
    }

    /*
    *   Function to simulate sand falling
    */
    simulate(){
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
    
            this.calcNextSandPositions();
        }, this.tickRate);
    }

    calcNextSandPositions(){

    }

    addSand(){
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
    
        console.log("Adding sand")
        this.sand[row][col] = 1;
        this.drawGrid();
    }
}
