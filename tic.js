const boardEl = document.getElementById('ticBoard');
const startBtnT = document.getElementById('startTic');
const difficultyEl = document.getElementById('difficulty');

let boardT, player='X', bot='O', gameOverT;
let overlayT, overlayText, overlayBtn;
let playerTurn = true; // speler mag klikken of niet

function initTic(){
    boardT = Array(9).fill('');
    player='X';
    gameOverT=false;
    playerTurn = true;

    // overlay setup (eerste keer)
    if(!overlayT){
        overlayT = document.createElement('div');
        overlayT.className = 'game-over-overlay';
        overlayT.style.display='none';

        overlayText = document.createElement('div');
        overlayText.className = 'blink';

        overlayBtn = document.createElement('button');
        overlayBtn.textContent='Restart';
        overlayBtn.className='start-btn';
        overlayBtn.addEventListener('click', ()=>{
            overlayT.style.display='none';
            initTic();
        });

        overlayT.appendChild(overlayText);
        overlayT.appendChild(overlayBtn);
        document.querySelector('main').appendChild(overlayT);
    }

    renderTic();
}

function renderTic(){
    boardEl.innerHTML='';
    boardEl.style.display='grid';
    boardEl.style.gridTemplateColumns='repeat(3,100px)';
    boardEl.style.gridGap='5px';
    boardT.forEach((val,i)=>{
        const cell = document.createElement('div');
        cell.style.width='100px';
        cell.style.height='100px';
        cell.style.display='flex';
        cell.style.alignItems='center';
        cell.style.justifyContent='center';
        cell.style.fontSize='2rem';
        cell.style.background='#222';
        cell.style.border='2px solid white';
        cell.style.cursor = playerTurn ? 'pointer' : 'default';
        cell.textContent=val;
        cell.addEventListener('click',()=>{playerMove(i)});
        boardEl.appendChild(cell);
    });
}

function playerMove(i){
    if(boardT[i]==='' && !gameOverT && playerTurn){
        boardT[i]=player;
        renderTic();

        if(checkWin(player)){
            gameOverT=true;
            showOverlay('YOU WIN!');
            return;
        }

        // schakel naar bot
        playerTurn = false;
        setTimeout(botMove, 2000);
    }
}

function botMove(){
    if(gameOverT) return;
    let empty = boardT.map((v,i)=>v===''?i:null).filter(v=>v!==null);
    if(empty.length===0) return;

    let choice;
    const difficulty = difficultyEl.value;
    if(difficulty==='easy'){
        choice = empty[Math.floor(Math.random()*empty.length)];
    } else if(difficulty==='medium'){
        choice = findWinningMove(bot) || empty[Math.floor(Math.random()*empty.length)];
    } else {
        choice = findWinningMove(bot) || findBlockingMove(player) || empty[Math.floor(Math.random()*empty.length)];
    }

    boardT[choice]=bot;
    renderTic();

    if(checkWin(bot)){
        gameOverT=true;
        showOverlay('BOT WINS!');
        return;
    }

    // na bot zet mag speler weer klikken
    playerTurn = true;
}

function findWinningMove(p){
    const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for(let win of wins){
        let vals = win.map(i=>boardT[i]);
        if(vals.filter(v=>v===p).length===2 && vals.includes('')) return win[vals.indexOf('')];
    }
    return null;
}

function findBlockingMove(p){
    return findWinningMove(p);
}

function checkWin(p){
    const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    return wins.some(w=>w.every(i=>boardT[i]===p));
}

function showOverlay(text){
    overlayText.textContent = text;
    overlayT.style.display = 'flex';
}

startBtnT.addEventListener('click',()=>{initTic();});
initTic();
