import  { LEVEL, OBJECT_TYPE} from "./setup.js";
import {randomMovement} from "./ghostmoves.js";
// Classes
import GameBoard from "./GameBoard.js";
import Pacman from "./pacman.js";
import Ghost from "./Ghost.js";
//Sound
//import soundDot from "./Users/admin/Desktop/Myawesomeprograms/Javascripttrainings/portfolio/sounds/munch.wav";
//import soundPill from "./Users/admin/Desktop/Myawesomeprograms/Javascripttrainings/portfolio/sounds/pill.wav";
//import soundGameStart from "./Users/admin/Desktop/Myawesomeprograms/Javascripttrainings/portfolio/sounds/game_start.wav";
//import soundGameOver from "./Users/admin/Desktop/Myawesomeprograms/Javascripttrainings/portfolio/sounds/death.wav";
//import soundGhost from "./Users/admin/Desktop/Myawesomeprograms/Javascripttrainings/portfolio/sounds/eat_ghost.wav";
//Dom elements
const gameGrid = document.querySelector("#game");
const scoreTable = document.querySelector("#score");
const startButton = document.querySelector("#start-button");
//Game constants
const POWER_PILL_TIME = 10000; //ms
const GLOBAL_SPEED = 80; // ms
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL);
//Intial setup
let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;

//----AUDIO----//
/*function playAudio(audio) {
    const soundEffect = new Audio(audio);
    soundEffect.play();
}*/

//---GAME CONTROLLER---///
function gameOver(pacman, grid) {
    //playAudio(soundGameOver);

    document.removeEventListener("keydown", (e) => pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard)));

    gameBoard.showGameStatus(gameWin);

clearInterval(timer);
//Show startbutton
startButton.classList.remove("hide");

};

function checkCollision(pacman, ghosts) {
    const collidedGhost = ghosts.find((ghost) => pacman.pos === ghost.pos);

    if (collidedGhost) {
        if(pacman.powerPill) {
           //playAudio(soundGhost);
            gameBoard.removeObject(collidedGhost.pos, [OBJECT_TYPE.GHOST, OBJECT_TYPE.SCARED, collidedGhost.name ]);
            collidedGhost.pos = collidedGhost.startPos;
            score += 100;
        } else {
            gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
            gameBoard.rotateDiv(pacman.pos, 0);
            gameOver(pacman, gameGrid);
        }
    }
}

function gameLoop(pacman, ghosts) {
    //1.Move Pacman
    gameBoard.moveCharacter(pacman);
    //2. check Ghost collision on the old positions
    checkCollision(pacman,ghosts);
    //3. move Ghosts
    ghosts.forEach((ghost) => gameBoard.moveCharacter(ghost));
    //4. do a new ghost collision check on te new positions
    checkCollision(pacman, ghosts);
    //5. check if pacman eats a dot
    if(gameBoard.objectExist(pacman.pos,OBJECT_TYPE.DOT)){
        //playAudio(soundDot);

        gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
        //remove a dot
        gameBoard.dotCount--;
       //add score
       score +=10;
    }
       
   //6. check if pacman eats a power pill
   if(gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {
       //playAudio(soundPill);

       gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);
       pacman.powerPill = true;
       score +=50;

    clearTimeout(powerPillTimer);
    powerPillTimer= setTimeout (
        () => (pacman.powerPill = false), POWER_PILL_TIME
    );

   }
   //7. change ghost scare mode depending on power pill
   if(pacman.powerPill !== powerPillActive) {
       powerPillActive = pacman.powerPill;
       ghosts.forEach((ghost) => (ghost.isScared = pacman.powerPill));
   }
   //8. check if all dos have been eaten
   if(gameBoard.dotCount === 0) {
       gameWin = true;
       gameOver(pacman, gameGrid);
   }
   //9.show a new score    
   scoreTable.innerHTML =score;
}   

function startGame() {
   // playAudio(soundGameStart);

    gameWin = false;
    powerPillActive = false;
    score = 0;
    
    startButton.classList.add("hide");

    gameBoard.createGrid(LEVEL);


    const pacman = new Pacman(2, 287);
    gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
    document.addEventListener("keydown", (e) => pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard)));


const ghosts = [
    new Ghost (5, 188, randomMovement, OBJECT_TYPE.BLINKY),
    new Ghost (4, 209, randomMovement, OBJECT_TYPE.PINKY),
    new Ghost (3, 230, randomMovement, OBJECT_TYPE.INKY),
    new Ghost (2, 251, randomMovement, OBJECT_TYPE.CLYDE),

];

// GAMELOOP
timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
};


//initialize game
startButton.addEventListener("click", startGame);

