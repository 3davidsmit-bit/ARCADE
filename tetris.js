const canvas = document.getElementById("tetrisCanvas");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startTetris");
const overlay = document.getElementById("tetrisOverlay");
const restartBtn = document.getElementById("restartTetris");
const scoreEl = document.getElementById("tetrisScore");

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

let board = [];
let piece;
let gameInterval;
let score = 0;
let speed = 500; // ms per drop

const SHAPES = [
    [[1,1,1,1]], // I
    [[1,1],[1,1]], // O
    [[0,1,0],[1,1,1]], // T
    [[1,0,0],[1,1,1]], // L
    [[0,0,1],[1,1,1]], // J
    [[0,1,1],[1,1,0]], // S
    [[1,1,0],[0,1,1]]  // Z
];

const COLORS = ["cyan","yellow","purple","orange","blue","green","red"];

function createBoard(){
    board = [];
    for(let r=0;r<ROWS;r++){
        board[r] = Array(COLS).fill(0);
    }
}

function newPiece(){
    const type = Math.floor(Math.random()*SHAPES.length);
    return {
        x: Math.floor(COLS/2)-1,
        y: 0,
        shape: SHAPES[type],
        color: COLORS[type]
    };
}

function drawBlock(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*BLOCK_SIZE,y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
    ctx.strokeStyle = "#111";
    ctx.strokeRect(x*BLOCK_SIZE,y*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
}

function drawBoard(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let r=0;r<ROWS;r++){
        for(let c=0;c<COLS;c++){
            if(board[r][c]) drawBlock(c,r,board[r][c]);
        }
    }
}

function drawPiece(){
    piece.shape.forEach((row,r)=>{
        row.forEach((val,c)=>{
            if(val) drawBlock(piece.x+c,piece.y+r,piece.color);
        });
    });
}

function collision(xOff=0,yOff=0, newShape=piece.shape){
    for(let r=0;r<newShape.length;r++){
        for(let c=0;c<newShape[r].length;c++){
            if(newShape[r][c]){
                let newX = piece.x + c + xOff;
                let newY = piece.y + r + yOff;
                if(newX<0 || newX>=COLS || newY>=ROWS) return true;
                if(board[newY][newX]) return true;
            }
        }
    }
    return false;
}

function lockPiece(){
    piece.shape.forEach((row,r)=>{
        row.forEach((val,c)=>{
            if(val) board[piece.y+r][piece.x+c] = piece.color;
        });
    });
    clearLines();
    piece = newPiece();
    if(collision()) gameOver();
}

function clearLines(){
    let lines = 0;
    for(let r=ROWS-1;r>=0;r--){
        if(board[r].every(cell=>cell!==0)){
            board.splice(r,1);
            board.unshift(Array(COLS).fill(0));
            lines++;
            r++; 
        }
    }
    if(lines>0){
        score += lines*10;
        scoreEl.textContent = "Score: "+score;
        speed = Math.max(100,500 - Math.floor(score/50)*50); // versnellen
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop,speed);
    }
}

function movePiece(dx,dy){
    if(!collision(dx,dy)) piece.x += dx, piece.y += dy;
    else if(dy) lockPiece();
}

function rotate(){
    const newShape = piece.shape[0].length === piece.shape.length ? piece.shape : piece.shape[0].map((_,i)=>piece.shape.map(row=>row[i]).reverse());
    if(!collision(0,0,newShape)) piece.shape=newShape;
}

function gameLoop(){
    movePiece(0,1);
    drawBoard();
    drawPiece();
}

function gameOver(){
    clearInterval(gameInterval);
    overlay.style.display="flex";
}

startBtn.addEventListener("click",()=>{
    createBoard();
    piece = newPiece();
    score = 0;
    scoreEl.textContent="Score: 0";
    speed = 500;
    overlay.style.display="none";
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop,speed);
    drawBoard();
    drawPiece();
});

restartBtn.addEventListener("click",()=>{
    startBtn.click();
});

// AWSD Controls
document.addEventListener("keydown",e=>{
    if(!piece) return;
    if(e.key==='a' || e.key==='A') movePiece(-1,0);
    if(e.key==='d' || e.key==='D') movePiece(1,0);
    if(e.key==='s' || e.key==='S') movePiece(0,1);
    if(e.key==='w' || e.key==='W') rotate();
    drawBoard();
    drawPiece();
});
