const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let win = 0;
let lose = 0;
let gameOver = false;

//creating the ball

let ballRadius = 14;
let ball = {
  dx: 2,
  dy: 2,
  x: canvas.width / 2,
  y: canvas.height / 2,
  w: ballRadius,
  h: ballRadius
};

let ballVx = 2;
let ballVy = 2;

//paddle

const paddleWidth = 20;
const paddleHeight = 80;
let player = {
  score: 0,
  lives: 3,
  dx: 0,
  dy: 0,
  speed: 3,
  x: canvas.width - 30,
  y: canvas.height / 2,
  w: paddleWidth,
  h: paddleHeight
};

let playerSpeed = 3;
let playerVx = 0;

//brick array
let bricks = [];
let brickCount = 0;

for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 10; j++) {
    bricks[brickCount] = {
      x: i * 25,
      y: j * 40,
      w: 15,
      h: 35,
      alive: true
    };

    brickCount++;
  }
}

const render = function() {
  //clear canvas
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  //set canvas color

  renderBricks();

  renderBall();

  renderPlayer();

  renderText();

  if (player.lives < 1) {
    gameOver = true;
  }
  window.requestAnimationFrame(render);
};

const renderPlayer = function() {
  let posX = player.x;
  let posY = player.y;

  posY = posY - player.dy * player.speed;

  player.x = posX;
  player.y = posY;

  drawRect("#000000", player.x, player.y, player.w, player.h);
};

const renderBall = function() {
  if (ball.x + ballRadius < 0) {
    ball.dx = -ball.dx;
  } else if (ball.x + ballRadius > canvas.width) {
    player.lives--;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
  }
  if (ball.y + ballRadius < 0 || ball.y + ballRadius > canvas.height) {
    ball.dy = -ball.dy;
  }

  if (isCollision(ball, player)) {
    ball.dx = -ball.dx;
    //ball.dy = -ball.dy;
  }

  if (!gameOver) {
    ball.x += ball.dx;
    ball.y += ball.dy;
  }

  drawRect("#000000", ball.x, ball.y, ball.w, ball.h);
};

const renderBricks = function() {
  for (let i = 0; i < bricks.length; i++) {
    if (bricks[i].alive) {
      if (!isCollision(ball, bricks[i])) {
        drawRect("#000000", bricks[i].x, bricks[i].y, bricks[i].w, bricks[i].h);
      } else {
        bricks[i].alive = false;
        player.score += 10;
      }
    }
  }
};

const renderText = function() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score:" + player.score, canvas.width - 150, 40);
  ctx.fillText("Lives:" + player.lives, canvas.width - 275, 40);

  if (gameOver) {
    ctx.font = "72px Arial";
    ctx.textAlign = "center";
    ctx.fillText("G A M E   O V E R", canvas.width / 2, canvas.height / 2);

    ctx.font = "24px Arial";
    ctx.fillText(
      "Space to Restart",
      canvas.width / 2,
      canvas.height - canvas.height / 3
    );
  }
};

const isCollision = function(object1, object2) {
  if (
    object1.x + object1.w > object2.x &&
    object1.x < object2.x + object2.w &&
    object2.y + object2.h > object1.y &&
    object2.y < object1.y + object1.h
  ) {
    return true;
  }
  return false;
};

const drawRect = function(color, x, y, w, h) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
};

const KEY_DOWN = 40;
const KEY_UP = 38;
const KEY_SPACE = 32;

const onKeyUp = function(e) {
  console.log("oneKeyUp", e);

  switch (e.keyCode) {
    case KEY_DOWN:
      if (!gameOver) {
        player.dy = 0;
      }
      break;
    case KEY_UP:
      if (!gameOver) {
        player.dy = 0;
      }
      break;
    case KEY_SPACE:
      if (gameOver) {
        gameOver = false;
        player.lives = 3;
        //TODO: reset the bricks, ball, and player
      }
      break;
  }
};

const onKeyDown = function(e) {
  console.log("onKeyDown", e);

  switch (e.keyCode) {
    case KEY_DOWN:
      if (!gameOver) {
        player.dy = -1;
      }
      break;
    case KEY_UP:
      if (!gameOver) {
        player.dy = 1;
      }
      break;
  }
};

document.addEventListener("keyup", onKeyUp, false);
document.addEventListener("keydown", onKeyDown, false);
render();
