class MazeSolver{
    constructor(canvas, context, maze){
        this.canvas = canvas;
        this.context = context;
        this.maze = maze;
        this.solvingCells = this.initialiseSovlingCells();
    }

    //Initalisation for solving cells
    initialiseSovlingCells(){
        let solvingCells = [];
        for (let row = 0; row < this.maze.maze.length; row++) {
            let currRow = [];
            for (let col = 0; col < this.maze.maze[row].length; col++) {
                currRow.push(new SolvingCell(this.maze.maze[row][col], this.maze.end));
            }
            solvingCells.push(currRow);
        }
        return solvingCells;
    }

    //Reconstructing the final solution
    reconstructPath(cameFrom, current) {
        this.maze.drawGrid();
        let positionToString = (cell) => `${cell.row}-${cell.col}`;
    
        let totalPath = [current];
        while (positionToString(current.cell) in cameFrom) {
            current = this.solvingCells[cameFrom[positionToString(current.cell)].row][cameFrom[positionToString(current.cell)].col];
            totalPath.unshift(current);
        }
    
        console.log("Path:", totalPath);
    
        for (let i = 0; i < totalPath.length; i++) {
            if (i > 0) {
                this.drawPath(totalPath[i].cell, "blue", totalPath[i-1].cell);
            } else {
                this.drawPath(totalPath[i].cell, "blue");
            }
        }
    }

    //Drawing solved path
    drawPath(cell, color, previousCell = null) {
        this.context.fillStyle = color;
    
        const centerX = cell.col * this.maze.mazeBlock + this.maze.mazeBlock / 2;
        const centerY = cell.row * this.maze.mazeBlock + this.maze.mazeBlock / 2;
        
        if (previousCell) {
            const prevCenterX = previousCell.col * this.maze.mazeBlock + this.maze.mazeBlock / 2;
            const prevCenterY = previousCell.row * this.maze.mazeBlock + this.maze.mazeBlock / 2;
    
            this.context.beginPath();
            this.context.moveTo(prevCenterX, prevCenterY);
            this.context.lineTo(centerX, centerY);
            this.context.strokeStyle = color;
            this.context.lineWidth = 2;
            this.context.stroke();
        }
    
        const radius = this.maze.mazeBlock / 5;
    
        if (cell !== this.maze.start && cell !== this.maze.end) {
            this.context.beginPath();
            this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            this.context.fill();
            this.context.stroke();
        }
    }

    //Animated version
    AStarAlgorithm() {
        let start = this.solvingCells[this.maze.start.row][this.maze.start.col];
        let openSet = [start];
        start.gScore = 0;
        start.fScore = start.hScore;
        let cameFrom = {};
        this.isAnimating = true;
    
        const step = () => {
            if (openSet.length > 0 && this.isAnimating) {
                console.log("Solving");
                let currentIndex = this.getIndexToLowestFScore(openSet);
                let current = openSet[currentIndex];
                this.drawPath(current.cell, "red");
    
                if (current.cell === this.maze.end) {
                    console.log("Finished successfully");
                    this.reconstructPath(cameFrom, current);
                    this.isAnimating = false;
                    return;
                }
    
                openSet.splice(currentIndex, 1);
                let neighbours = current.cell.neighbours;
                for (let i = 0; i < neighbours.length; i++) {
                    let neighbour = this.solvingCells[neighbours[i].row][neighbours[i].col];
                    let tentativeScore = current.gScore + 1;
    
                    if (tentativeScore < neighbour.gScore) {
                        let positionToString = (cell) => `${cell.row}-${cell.col}`;
                        cameFrom[positionToString(neighbour.cell)] = current.cell;
                        neighbour.gScore = tentativeScore;
                        neighbour.fScore = tentativeScore + neighbour.hScore;
    
                        if (!openSet.includes(neighbour)) {
                            openSet.push(neighbour);
                        }
                    }
                }
    
                setTimeout(step, this.tickRate);
            } else {
                console.log("Finished fail");
                this.isAnimating = false;
            }
        };
    
        step();
    }

    //Instant version
    // AStarAlgorithm() {
    //     let start = this.solvingCells[this.maze.start.row][this.maze.start.col];
    //     let openSet = [start];
    //     start.gScore = 0;
    //     start.fScore = start.hScore;
    //     let cameFrom = {};

    //     while(openSet.length > 0){
    //         console.log("Solving");
    //         let currentIndex = this.getIndexToLowestFScore(openSet);
    //         let current = openSet[currentIndex];
    //         this.drawPath(current.cell, "red")
    //         if(current.cell === this.maze.end){
    //             console.log("Finished successfully");
    //             return this.reconstructPath(cameFrom, current)
    //         }

    //         openSet.splice(currentIndex, 1);
    //         let neighbours = current.cell.neighbours;
    //         for(let i = 0; i < neighbours.length; i++){
    //             let neighbour = this.solvingCells[neighbours[i].row][neighbours[i].col];
    //             let tentativeScore = current.gScore + 1;
    //             console.log("TEst")
    //             console.log(tentativeScore)
    //             console.log(neighbour.gScore)
    //             if(tentativeScore < neighbour.gScore){
    //                 let positionToString = (cell) => `${cell.row}-${cell.col}`;
    //                 cameFrom[positionToString(neighbour.cell)] = current.cell;
    //                 neighbour.gScore = tentativeScore;
    //                 neighbour.fScore = tentativeScore + neighbour.hScore;
    //                 if(!openSet.includes(neighbour)){
    //                     console.log("testing")
    //                     openSet.push(neighbour)
    //                 }
    //             }
    //         }
    //     }

    //     console.log("Finished fail");
    // }

    //Method to get the lowest index f score in the current open set
    getIndexToLowestFScore(openSet){
        let lowestFScoreIndex = 0;
        for (let index = 0; index < openSet.length; index++) {
            if(openSet[index].fScore < openSet[lowestFScoreIndex].fScore){
                lowestFScoreIndex = index;
            }
        }

        return lowestFScoreIndex;
    }
}

//Class to hold information about the cell storing an fscore, gscore and hscore calculation
class SolvingCell{
    constructor(cell, mazeEnd){
        this.cell = cell;
        this.fScore = Infinity;
        this.gScore = Infinity;
        this.hScore = Math.abs(cell.row - mazeEnd.row) + Math.abs(cell.col - mazeEnd.col);
    }
}