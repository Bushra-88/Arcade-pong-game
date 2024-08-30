const startText = document.getElementById("startText");
const paddle1 = document.getElementById("paddle1");

//Game Variables
let gameRunning = false;
let keyPressed = {};
let paddle1Speed = 0; // in the start
let paddle1Y = 150;
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
