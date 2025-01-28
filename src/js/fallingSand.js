class FallingSandSimulation {
    constructor(canvas, context) {
        this.isSimulating = false;
        this.canvas = canvas;
        this.context = context;
        this.sandSize = 5;
        this.tickRate = 25;
        this.brushSize = 10;
        this.hue = 0;
        this.gradientColors = ["red", "orange", "yellow", "pink"];
        this.sandBox = [];

        /* Event listeners for canvas interactions */
        this.canvas.addEventListener("mousedown", this.addSand.bind(this));
        this.canvas.addEventListener("mousemove", this.addSand.bind(this));
        this.canvas.addEventListener("mouseup", () => {
            this.isCanvasMouseDown = false;
        });
        this.canvas.addEventListener("mouseleave", () => {
            this.isCanvasMouseDown = false;
        });
    }

    initialiseSand() {
        this.sandBox = [];

        for (let row = 0; row < this.canvas.height / this.sandSize; row++) {
            let currRow = [];
            for (let col = 0; col < this.canvas.width / this.sandSize; col++) {
                currRow.push(new Cell(row, col, 0, "white"));
            }
            this.sandBox.push(currRow);
        }

        this.drawGrid();
    }

    /*
    *   Function to draw the grid using the 2d generation array
    */
    drawGrid() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.strokeStyle = "black";
        // this.context.fillStyle = "black";

        for (let row = 0; row < this.sandBox.length; row++) {
            for (let col = 0; col < this.sandBox[row].length; col++) {
                const currCell = this.sandBox[row][col];
                const x = col * this.sandSize;
                const y = row * this.sandSize;

                // this.context.strokeRect(x, y, this.sandSize, this.sandSize);

                if (currCell.state === 1) {
                    this.context.fillStyle = currCell.colour;
                    this.context.fillRect(x, y, this.sandSize, this.sandSize);
                }
            }
        }
    }

    /*
    *   Function to simulate sand falling
    */
    simulate() {
        //Clear any existing interval to avoid multiple simulations
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
        }

        //Run the simulation every set tick rate
        this.simulationInterval = setInterval(() => {
            if (!this.isSimulating) {
                clearInterval(this.simulationInterval);
                return;
            }
            //Changing colour
            this.currentColorIndex = (this.currentColorIndex + 1) % this.gradientColors.length;
            this.hue = (this.hue + 1) % 360;

            this.calcNextSandPositions();
        }, this.tickRate);
    }

    calcNextSandPositions() {
        const newSandBox = this.sandBox.map((row) =>
            row.map((cell) => new Cell(cell.row, cell.col, 0, "white"))
        );

        for (let row = 0; row < this.sandBox.length; row++) {
            for (let col = 0; col < this.sandBox[row].length; col++) {
                const currCell = this.sandBox[row][col];

                //Check looking at a cell that contains sand
                if (currCell.state === 1) {
                    const canFallLeft = col - 1 >= 0;
                    const canFallRight = col + 1 < this.sandBox[row].length;

                    if (row + 1 >= this.sandBox.length) {
                        // Bottom of the grid, sand stays in place
                        newSandBox[row][col].state = 1;
                        newSandBox[row][col].colour = currCell.colour;
                    } else if (this.sandBox[row + 1][col].state === 0) {
                        // Fall straight down
                        newSandBox[row + 1][col].state = 1;
                        newSandBox[row + 1][col].colour = currCell.colour;
                    } else if (canFallLeft && canFallRight && this.sandBox[row + 1][col - 1].state === 0 && this.sandBox[row + 1][col + 1].state === 0) {
                        // Randomize left or right if both are available
                        const randomDir = Math.random() < 0.5 ? -1 : 1;
                        newSandBox[row + 1][col + randomDir].state = 1;
                        newSandBox[row + 1][col + randomDir].colour = currCell.colour;
                    } else if (canFallLeft && this.sandBox[row + 1][col - 1].state === 0) {
                        // Fall left
                        newSandBox[row + 1][col - 1].state = 1;
                        newSandBox[row + 1][col - 1].colour = currCell.colour;
                    } else if (canFallRight && this.sandBox[row + 1][col + 1].state === 0) {
                        // Fall right
                        newSandBox[row + 1][col + 1].state = 1;
                        newSandBox[row + 1][col + 1].colour = currCell.colour;
                    } else {
                        // Stay in place
                        newSandBox[row][col].state = 1;
                        newSandBox[row][col].colour = currCell.colour;
                    }
                }
            }
        }

        this.sandBox = newSandBox;
        this.drawGrid();
    }

    updateCell(cell) {
        this.context.fillStyle = cell.colour;
        this.context.fillRect(cell.x, cell.y, this.sandSize, this.sandSize);
    }

    addSand(event) {
        this.isSimulating = true;

        //Check we are still holding the mouse down
        if (event.type === "mousedown") {
            this.isCanvasMouseDown = true;
        }
        if (!this.isCanvasMouseDown) return;

        // Get mouse position and calculate cell coordinates
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const col = Math.floor((mouseX * this.canvas.width) / rect.width / this.sandSize);
        const row = Math.floor((mouseY * this.canvas.height) / rect.height / this.sandSize);

        const brush = Math.ceil(this.brushSize / 2);
        for (let i = -brush; i <= brush; i++) {
            for (let j = -brush; j <= brush; j++) {
                const r = row + i;
                const c = col + j;

                if (r >= 0 && r < this.sandBox.length && c >= 0 && c < this.sandBox[r].length) {
                    let newSand = new Cell(r, c, 1, `hsl(${this.hue}, 100%, 50%)`)
                    this.sandBox[r][c] = newSand;
                    this.updateCell(newSand)
                }
            }
        }

        // Start simulation if it's not already running
        if (!this.simulationInterval) {
            this.simulate();
        }
    }
}

class Cell {
    constructor(row, col, state, colour) {
        this.row = row;
        this.col = col;
        this.state = state;
        this.colour = colour;
    }
}
