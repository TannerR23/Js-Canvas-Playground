class MazeGeneration{
    constructor(canvas, context){
        this.canvas = canvas;
        this.context = context;
        this.maze = [];
        this.mazeBlock = 20;
        this.tickRate = 50;
        this.startPos = [0,0];
        this.stack = [];
        this.currCell;
        this.lastCell;
        this.isAnimating = true;
    }

    /*
    *   Fill an array of block objects
    */
    initialiseGrid(){
        this.maze = [];

        for (let row = 0; row < this.canvas.height / this.mazeBlock; row++) {
            let currRow = [];
            for (let col = 0; col < this.canvas.width / this.mazeBlock; col++) {
                currRow.push(new Block(row, col));
            }
            this.maze.push(currRow);
        }
    }

    /*
    *   Function to draw the maze to the canvas
    */
    drawGrid() {
        this.context.clearRect(0, 0, canvas.width, canvas.height);
        this.context.strokeStyle = "black";
    
        const wallDirections = [
            [[0, 0], [1, 0]], // Top wall
            [[1, 0], [1, 1]], // Right wall
            [[1, 1], [0, 1]], // Bottom wall
            [[0, 1], [0, 0]]  // Left wall
        ];
    
        for (let row = 0; row < this.maze.length; row++) {
            for (let col = 0; col < this.maze[row].length; col++) {
                let currBlock = this.maze[row][col];
                let x = col * this.mazeBlock;
                let y = row * this.mazeBlock;
    
                // Draw each wall of the block
                for (let wall = 0; wall < currBlock.walls.length; wall++) {
                    if (currBlock.walls[wall] === true) {
                        const [start, end] = wallDirections[wall];
                        this.context.beginPath();
                        this.context.moveTo(x + start[0] * this.mazeBlock, y + start[1] * this.mazeBlock);
                        this.context.lineTo(x + end[0] * this.mazeBlock, y + end[1] * this.mazeBlock);
                        this.context.closePath();
                        this.context.stroke();
                    }
                }
    
                // Highlight the current cell
                if (currBlock === this.currCell && this.isAnimating) {
                    this.context.fillStyle = "rgba(100, 100, 100, 0.25)";
                    this.context.fillRect(x, y, this.mazeBlock, this.mazeBlock);
                }
    
                // Highlight the last cell (farthest)
                if (this.lastCell && currBlock.row === this.lastCell.row && currBlock.col === this.lastCell.col) {
                    this.context.fillStyle = "rgba(0, 255, 0, 0.5)";
                    this.context.fillRect(x, y, this.mazeBlock, this.mazeBlock);
                }

                // Start pos highlight
                if (currBlock === this.maze[this.startPos[0]][this.startPos[1]]) {
                    this.context.fillStyle = "rgba(0, 100, 0, 0.5)";
                    this.context.fillRect(x, y, this.mazeBlock, this.mazeBlock);
                }
            }
        }
    }

    /*
    *   Function to generate a random maze
    */
    generateMaze() {
        this.initialiseGrid();
    
        this.currCell = this.maze[this.startPos[0]][this.startPos[1]];
        this.currCell.visited = true;
        this.stack.push(this.currCell);
    
        // Recursive loop for maze generation
        const step = () => {
            if (this.stack.length > 0) {
                this.currCell = this.stack.pop();
                let neighbours = this.getNeighbours(this.currCell);
    
                if (neighbours.length > 0) {
                    this.stack.push(this.currCell);
                    let randomNeighbourIndex = Math.floor(Math.random() * neighbours.length);
                    this.removeWall(this.currCell, neighbours[randomNeighbourIndex]);
                    this.currCell = neighbours[randomNeighbourIndex];
                    this.currCell.visited = true;
                    this.stack.push(this.currCell);
                }
    
                this.drawGrid();
    
                setTimeout(step, this.tickRate);
            } else {
                console.log("Maze generation complete!");
                this.lastCell = this.findFarthestCell();
                this.isAnimating = false;
                this.drawGrid(); 
            }
        };
    
        step();
    }

    findFarthestCell() {
        // Queue for BFS: stores { cell, distance from start }
        let queue = [{ cell: this.maze[this.startPos[0]][this.startPos[1]], distance: 0 }];
        let visited = new Set(); // Track visited cells
        let farthestCell = queue[0];
    
        while (queue.length > 0) {
            // Dequeue the current cell
            let { cell, distance } = queue.shift();
    
            // Check if this cell is the farthest so far
            if (distance > farthestCell.distance) {
                farthestCell = { cell, distance };
            }
    
            // Mark cell as visited
            visited.add(`${cell.row},${cell.col}`);
    
            // Get all unvisited neighbors of the current cell
            let neighbours = this.getConnectedNeighbours(cell);
            for (let neighbour of neighbours) {
                if (!visited.has(`${neighbour.row},${neighbour.col}`)) {
                    queue.push({ cell: neighbour, distance: distance + 1 });
                }
            }
        }
    
        // Return the farthest cell and its distance
        return farthestCell.cell;
    }
    
    // Helper method to find connected (reachable) neighbors of a cell
    getConnectedNeighbours(block) {
        let neighbours = [];
        // Top
        if (!block.walls[0] && block.row - 1 >= 0) {
            neighbours.push(this.maze[block.row - 1][block.col]);
        }
        // Right
        if (!block.walls[1] && block.col + 1 < this.maze[block.row].length) {
            neighbours.push(this.maze[block.row][block.col + 1]);
        }
        // Bottom
        if (!block.walls[2] && block.row + 1 < this.maze.length) {
            neighbours.push(this.maze[block.row + 1][block.col]);
        }
        // Left
        if (!block.walls[3] && block.col - 1 >= 0) {
            neighbours.push(this.maze[block.row][block.col - 1]);
        }
        return neighbours;
    }

    removeWall(block1, block2){
        if(block1.row - block2.row < 0){
            block1.walls[2] = false;
            block2.walls[0] = false;
        }

        if(block1.row - block2.row > 0){
            block1.walls[0] = false;
            block2.walls[2] = false;
        }

        if(block1.col - block2.col < 0){
            block1.walls[1] = false;
            block2.walls[3] = false;
        }

        if(block1.col - block2.col > 0){
            block1.walls[3] = false;
            block2.walls[1] = false;
        }
    }

    getNeighbours(block){
        let neighbours = [];
        //Top
        if (block.col - 1 >= 0 && this.maze[block.row][block.col - 1].visited === false) {
            neighbours.push(this.maze[block.row][block.col - 1]);
        }
        //Right
        if (block.col + 1 < this.maze[block.row].length && this.maze[block.row][block.col + 1].visited === false) {
            neighbours.push(this.maze[block.row][block.col + 1]);
        }
        //Bottom
        if (block.row + 1 < this.maze.length && this.maze[block.row + 1][block.col].visited === false) {
            neighbours.push(this.maze[block.row + 1][block.col]);
        }
        //Left
        if (block.row - 1 >= 0 && this.maze[block.row - 1][block.col].visited === false) {
            neighbours.push(this.maze[block.row - 1][block.col]);
        }
        return neighbours;
    }
}

//Class to keep track of which walls are visible or not
class Block{
    constructor(row, col){
        this.row = row;
        this.col = col;
        this.visited = false;
        this.walls = [true, true, true, true] //Top, right, bottom, left
    }   
}