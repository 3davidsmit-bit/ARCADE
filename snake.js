const canvasS = document.getElementById('snakeCanvas');
const ctxS = canvasS.getContext('2d');
const startBtnS = document.getElementById('startSnake');
const overlayS = document.createElement('div');
const scoreElS = document.getElementById('snakeScore');
const difficultySelect = document.getElementById('difficulty');

overlayS.className = 'game-over-overlay';
overlayS.innerHTML = `<div class="blink">GAME OVER</div><button id="restartSnakeOverlay">Restart</button>`;
document.querySelector('main').appendChild(overlayS);
const restartOverlayBtn = document.getElementById('restartSnakeOverlay');

let snake, direction, food, scoreS, intervalS, gameOverS, speed;
let readyToMove = false;

function initSnake(){
    snake=[{x:200,y:200}];
    direction={x:0,y:0};
    readyToMove=false;
    spawnFood();
    scoreS=0;
    gameOverS=false;
    scoreElS.textContent="Score: 0";

    // snelheid bepalen op basis van moeilijkheid
    const diff = difficultySelect.value;
    if(diff==='easy') speed = 150;
    else if(diff==='medium') speed = 100;
    else speed = 70;

    clearInterval(intervalS);
    intervalS=setInterval(gameLoopS,speed);
    overlayS.style.display='none';
    drawSnake();
}

function spawnFood(){
    food={x: Math.floor(Math.random()*20)*20, y:Math.floor(Math.random()*20)*20};
}

function drawSnake(){
    ctxS.fillStyle='#111';
    ctxS.fillRect(0,0,canvasS.width,canvasS.height);

    ctxS.strokeStyle='white';
    ctxS.lineWidth=4;
    ctxS.strokeRect(0,0,canvasS.width,canvasS.height);

    ctxS.fillStyle='lime';
    snake.forEach(part=>{
        ctxS.fillRect(part.x,part.y,20,20);
        ctxS.strokeStyle='#111';
        ctxS.strokeRect(part.x,part.y,20,20);
    });

    ctxS.fillStyle='red';
    ctxS.fillRect(food.x,food.y,20,20);
}

function moveSnake(){
    if(!readyToMove) return;

    const head={x:snake[0].x+direction.x, y:snake[0].y+direction.y};
    if(head.x<0||head.x>=canvasS.width||head.y<0||head.y>=canvasS.height||
       snake.some(s=>s.x===head.x && s.y===head.y)){
        gameOverS=true;
        clearInterval(intervalS);
        overlayS.style.display='flex';
        direction={x:0,y:0};
        return;
    }

    snake.unshift(head);

    if(head.x===food.x && head.y===food.y){
        scoreS++;
        scoreElS.textContent="Score: "+scoreS;
        spawnFood();
    } else snake.pop();
}

function gameLoopS(){
    if(!gameOverS){
        moveSnake();
        drawSnake();
    }
}

// AWSD Controls
document.addEventListener('keydown', e=>{
    if(!snake) return;
    if(!readyToMove && ['w','a','s','d','W','A','S','D'].includes(e.key)) readyToMove=true;

    if((e.key==='a'||e.key==='A') && direction.x===0) direction={x:-20,y:0};
    if((e.key==='d'||e.key==='D') && direction.x===0) direction={x:20,y:0};
    if((e.key==='w'||e.key==='W') && direction.y===0) direction={x:0,y:-20};
    if((e.key==='s'||e.key==='S') && direction.y===0) direction={x:0,y:20};

    drawSnake();
});

startBtnS.addEventListener('click',()=>{initSnake();});
restartOverlayBtn.addEventListener('click',()=>{initSnake();});
