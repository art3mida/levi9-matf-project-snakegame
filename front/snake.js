const board_border = 'black';
const board_background = "white";
const snake_col = 'lightblue';
const snake_border = 'darkblue';

let score = 0;
let changingDir = false;
let dx = 10;
let dy = 0;
let food_x;
let food_y;

let snake = [
  {x: 200, y: 200},
  {x: 190, y: 200},
  {x: 180, y: 200},
  {x: 170, y: 200},
  {x: 160, y: 200}
];

const snakeboard = document.getElementById("gameCanvas");
const snakeboard_ctx = gameCanvas.getContext("2d");

document.addEventListener("keydown", changeDirection);

generateFood();
main();

function main() {
  if(hasGameEnded()) {
    const name = prompt("Upisite ime:");
    sendResult(name, score).then(console.log('KRAJ'));
    return;
  }

  changingDir = false;

  setTimeout(function onTick() {
     clearCanvas();
     drawFood();
     advanceSnake();
     drawSnake();

    // Call main again
     main();
  }, 100);
}

const sendResult = async (username, result) => {
    try {
        const URL = 'http://localhost:5000/ended';
        const response = await fetch(URL, {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            mode : 'cors',
            body : JSON.stringify({
                name : username,
                score : result
            })
        });
        // const jsonResponse = await response.json();
        console.log(response.body);

    } catch (err) {
        console.error(err);
    }
}

function drawSnakePart(snakePart) {
  snakeboard_ctx.fillStyle = 'lightblue';
  snakeboard_ctx.strokestyle = 'darkblue';
  snakeboard_ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  snakeboard_ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

/*Function that prints the parts*/
function drawSnake() {
  snake.forEach(drawSnakePart);
}

function drawFood() {
      snakeboard_ctx.fillStyle = 'lightgreen';
      snakeboard_ctx.strokestyle = 'darkgreen';
      snakeboard_ctx.fillRect(food_x, food_y, 10, 10);
      snakeboard_ctx.strokeRect(food_x, food_y, 10, 10);
}

// draw a border around the canvas
function clearCanvas() {
  //  Select the colour to fill the drawing
  snakeboard_ctx.fillStyle = board_background;
  //  Select the colour for the border of the canvas
  snakeboard_ctx.strokestyle = board_border;
  // Draw a "filled" rectangle to cover the entire canvas
  snakeboard_ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
  // Draw a "border" around the entire canvas
  snakeboard_ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function advanceSnake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);

  const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
  if (has_eaten_food) {
    // Increase score
    score += 10;
    // Display score on screen
    document.getElementById('score').innerHTML = score;
    // Generate new food location
    generateFood();
  } else {
    // Remove the last part of snake body
    snake.pop();
  }
}

function changeDirection(event) {
   const LEFT_KEY = 37;
   const RIGHT_KEY = 39;
   const UP_KEY = 38;
   const DOWN_KEY = 40;

   if (changingDir) {
     return;
   }

   changingDir = true;
   const keyPressed = event.keyCode;
   const goingUp = dy === -10;
   const goingDown = dy === 10;
   const goingRight = dx === 10;
   const goingLeft = dx === -10;

     if (keyPressed === LEFT_KEY && !goingRight) {
          dx = -10;
          dy = 0;
     }

     if (keyPressed === UP_KEY && !goingDown) {
          dx = 0;
          dy = -10;
     }

     if (keyPressed === RIGHT_KEY && !goingLeft) {
          dx = 10;
          dy = 0;
     }

     if (keyPressed === DOWN_KEY && !goingUp) {
          dx = 0;
          dy = 10;
     }
  }

  function hasGameEnded() {
    for (let i = 3; i < snake.length; i++) {
      const has_collided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
      if (has_collided)
        return true;
    }
    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeboard.width - 10;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeboard.height - 10;

    return hitLeftWall ||  hitRightWall || hitToptWall || hitBottomWall;
  }

  function randomNum(min, max) {
     return Math.round((Math.random() * (max-min) + min) / 10) * 10;
  }

  function generateFood() {
   food_x = randomNum(0, snakeboard.width - 10);
   food_y = randomNum(0, snakeboard.height - 10);
   snake.forEach(function has_snake_eaten_food(part) {
    const has_eaten = part.x == food_x && part.y == food_y;
    if (has_eaten) gen_food();
  });
}
