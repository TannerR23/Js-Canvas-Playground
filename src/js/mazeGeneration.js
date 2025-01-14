class MazeGeneration{
    constructor(canvas, context){
        this.canvas = canvas;
        this.context = context;
        this.grid = [];
        this.mazeBlock = 50;
    }

    initialiseGrid(){
        this.grid = [];

        for (let row = 0; row < this.canvas.height / this.mazeBlock; row++) {
            let currRow = [];
            for (let col = 0; col < this.canvas.width / this.mazeBlock; col++) {
                currRow.push(0);
            }
            this.grid.push(currRow);
        }
    }

    drawGrid(){
        this.context.clearRect(0,0, canvas.width, canvas.height);
        this.context.strokeStyle = "black";
    
        for (let row = 0; row < this.grid.length; row++) {
            for (let col = 0; col < this.grid[row].length; col++) {
                let x = col * this.mazeBlock;
                let y = row * this.mazeBlock;
    
                this.context.strokeRect(x, y, this.mazeBlock, this.mazeBlock);
            }
        }
    }

    generateMaze(){

    }
}