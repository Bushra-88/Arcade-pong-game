const startText = document.getElementById("startText");
const paddle1 = document.getElementById("paddle1");
const paddle2 = document.getElementById("paddle2");
const ball = document.getElementById("ball");
const player1ScoreElement = document.getElementById("player1Score");
const player2ScoreElement = document.getElementById("player2Score");
const lossSound = document.getElementById("lossSound");
const wallSound = document.getElementById("wallSound");
const paddleSound = document.getElementById("paddleSound");
//Game Variables
let gameRunning = false;
let keyPressed = {};
let paddle1Speed = 0; // in the start
let paddle1Y = 150;
let paddle2Speed = 0;
let paddle2Y = 150;
let ballX = 290; //the game width/2 minus the ball width
let ballSpeedX = 2;
let ballY = 190;
let ballSpeedY = 2;
let player2Score = 0;
let player1Score = 0;
//Game Constants
const paddleAcceleration = 1;
const paddleDeceleration = 1;
const maxPaddleSpeed = 5;
const gameHeight = 400; // Height of the game area
const gameWidth = 600;

//Event Listener
document.addEventListener("keydown", startGame);
document.addEventListener("keydown", handelKeyDown);
document.addEventListener("keyup", handelKeyUp);
/**
 * Start the game by setting gameRunning to true, hiding the start text,
 * and removing the startGame event listener.
 */
function startGame() {
  gameRunning = true;
  startText.style.display = "none";
  document.removeEventListener("keydown", startGame);
  gameLoop();
}

//Make game loop to make the game running each 8ms
function gameLoop() {
  if (gameRunning) {
    updatePaddle1();
    updatePaddle2();
    moveBall();
    setTimeout(gameLoop, 8);
  }
}
//insert the pressedKey in the object
function handelKeyDown(e) {
  keyPressed[e.key] = true;
}
function handelKeyUp(e) {
  keyPressed[e.key] = false; //to handel the key press if u hold it is true if u not is false
}
/*Update the position of paddle 1 based on the current key presses. updates paddle1Y based on keyPressed["w"]*/
function updatePaddle1() {
  if (keyPressed["w"]) {
    paddle1Speed = Math.max(paddle1Speed - paddleAcceleration, -maxPaddleSpeed); //moving up is - and moving down is + "0-1,-5" it will return the max number=-1(the  5 is the maximum speed)
  } else if (keyPressed["s"]) {
    paddle1Speed = Math.min(paddle1Speed + paddleAcceleration, maxPaddleSpeed); //moving down is positive(+) "0+1,5"=> "1,5"we get the minimum "1"
  } else {
    if (paddle1Speed > 0) {
      paddle1Speed = Math.max(paddle1Speed - paddleDeceleration, 0); // 5>0 => "5-1,0"=4 make the paddle stop on pressKeyUp S
    } else if (paddle1Speed < 0) {
      paddle1Speed = Math.min(paddle1Speed + paddleDeceleration, 0); // the paddle1 stop if pressKeyUp W
    }
  }

  paddle1Y += paddle1Speed;
  // Keep the paddle inside the game area
  if (paddle1Y < 0) {
    paddle1Y = 0; // Prevent the paddle from moving above the top edge
  }
  if (paddle1Y > gameHeight - paddle1.clientHeight) {
    paddle1Y = gameHeight - paddle1.clientHeight; // Prevent the paddle from moving below the bottom edge
  }
  paddle1.style.top = paddle1Y + "px";
}

function updatePaddle2() {
  if (keyPressed["ArrowUp"]) {
    paddle2Speed = Math.max(paddle2Speed - paddleAcceleration, -maxPaddleSpeed);
  } else if (keyPressed["ArrowDown"]) {
    paddle2Speed = Math.min(paddle2Speed + paddleAcceleration, maxPaddleSpeed);
  } else {
    if (paddle2Speed > 0) {
      paddle2Speed = Math.max(paddle2Speed - paddleDeceleration, 0);
    } else if (paddle2Speed < 0) {
      paddle2Speed = Math.min(paddle2Speed + paddleDeceleration, 0);
    }
  }

  paddle2Y += paddle2Speed;
  // Keep the paddle inside the game area
  if (paddle2Y < 0) {
    paddle2Y = 0;
  }
  if (paddle2Y > gameHeight - paddle2.clientHeight) {
    paddle2Y = gameHeight - paddle2.clientHeight;
  }
  paddle2.style.top = paddle2Y + "px";
}

function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;
  //Wall collision
  if (ballY >= gameHeight - ball.clientHeight || ballY <= 0) {
    //0 means the top of the game area
    ballSpeedY = -ballSpeedY; // make it in the opposite direction
    playSound(wallSound);
  }

  // Paddle 1 collision
  if (
    ballX <= paddle1.clientWidth &&
    ballY >= paddle1Y && //the top pf the paddle
    ballY <= paddle1Y + paddle1.clientHeight //paddle1 clientHeight is the bottom corner of paddle 1
  ) {
    ballSpeedX = -ballSpeedX;
    playSound(paddleSound);
  }

  // Paddle 2 collision
  if (
    ballX >= gameWidth - paddle2.clientWidth - ball.clientWidth &&
    ballY >= paddle2Y &&
    ballY <= paddle2Y + paddle2.clientHeight //paddle2 clientHeight is the bottom corner of paddle 2
  ) {
    ballSpeedX = -ballSpeedX;
    playSound(paddleSound);
  }

  // Handel out of game area collision
  if (ballX <= 0) {
    player2Score++;
    playSound(lossSound);
    updateScoreboard();
    resetBall();
    pauseGame();
  } else if (ballX >= gameWidth - ball.clientWidth) {
    player1Score++;
    playSound(lossSound);
    updateScoreboard();
    resetBall();
    pauseGame();
  }
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}

//Update the score
function updateScoreboard() {
  player1ScoreElement.textContent = player1Score;
  player2ScoreElement.textContent = player2Score;
}

function resetBall() {
  ballX = gameWidth / 2 - ball.clientWidth / 2;
  ballY = gameHeight / 2 - ball.clientHeight / 2;
  ballSpeedX = Math.random() > 0.5 ? 2 : -2;
  ballSpeedY = Math.random() > 0.5 ? 2 : -2;
}

function pauseGame() {
  gameRunning = false;
  document.addEventListener("keydown", startGame);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}
