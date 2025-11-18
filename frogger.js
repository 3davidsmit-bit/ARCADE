const canvasF = document.getElementById('froggerCanvas');
const ctxF = canvasF.getContext('2d');
const startBtnF = document.getElementById('startFrogger');
const overlayF = document.getElementById('froggerOverlay');
const restartBtnF = document.getElementById('restartFrogger');
const scoreElF = document.getElementById('froggerScore');

let frog, cars, scoreF, intervalF, spawnInterval, gameOverF, speedMultiplier;

function initFrogger(){
    frog={x:180,y:360,width:40,height:40};
    cars=[];
    scoreF=0; gameOverF=false; speedMultiplier=1;
    clearInterval(intervalF);
    clearInterval(spawnInterval);
    scoreElF.textContent="Score: 0";
    spawnCars();
    intervalF=setInterval(gameLoopF,20);
    spawnInterval=setInterval(spawnCars,5000);
    overlayF.style.display="none";
}

function spawnCars(){
    const laneYs = [80,160,240];
    laneYs.forEach(y=>{
        const speed = Math.random()*2+2*speedMultiplier;
        const color = ['red','orange','blue','purple','yellow'][Math.floor(Math.random()*5)];
        const x = Math.random()*canvasF.width;
        cars.push({x,y,width:40,height:40,speed,color});
    });
    speedMultiplier += 0.1;
}

function drawFrogger(){
    ctxF.fillStyle='darkgreen';
    ctxF.fillRect(0,0,canvasF.width,canvasF.height);
    ctxF.fillStyle='gray';
    [80,160,240].forEach(y=>ctxF.fillRect(0,y,canvasF.width,40));

    ctxF.fillStyle='lime';
    ctxF.fillRect(frog.x,frog.y,frog.width,frog.height);
    ctxF.strokeStyle='black';
    ctxF.strokeRect(frog.x,frog.y,frog.width,frog.height);

    cars.forEach(c=>{
        ctxF.fillStyle=c.color;
        ctxF.fillRect(c.x,c.y,c.width,c.height);
        ctxF.strokeStyle='black';
        ctxF.strokeRect(c.x,c.y,c.width,c.height);
    });
}

function moveCars(){
    cars.forEach(c=>{
        c.x += c.speed;
        if(c.x>canvasF.width) c.x=-c.width;
    });
}

function checkCollision(){
    for(let c of cars){
        if(frog.x < c.x+c.width && frog.x+frog.width > c.x && frog.y < c.y+c.height && frog.y+frog.height > c.y){
            gameOverF=true;
            clearInterval(intervalF);
            clearInterval(spawnInterval);
            overlayF.style.display="flex";
        }
    }
    if(frog.y<=0){
        scoreF++;
        scoreElF.textContent="Score: "+scoreF;
        frog.y=360;
    }
}

function gameLoopF(){
    if(!gameOverF){
        moveCars();
        drawFrogger();
        checkCollision();
    }
}

// AWSD controls
document.addEventListener('keydown',e=>{
    if(!frog) return;
    if(e.key==='a' || e.key==='A' && frog.x>0) frog.x-=20;
    if(e.key==='d' || e.key==='D' && frog.x<canvasF.width-frog.width) frog.x+=20;
    if(e.key==='w' || e.key==='W' && frog.y>0) frog.y-=20;
    if(e.key==='s' || e.key==='S' && frog.y<canvasF.height-frog.height) frog.y+=20;
    drawFrogger();
});

startBtnF.addEventListener('click',()=>{initFrogger();});
restartBtnF.addEventListener('click',()=>{initFrogger();});
