// Setup game window using constant because window size will not change
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const aspectRatio = 400 / 600; // original width / height
canvas.height = window.innerHeight;
canvas.width = canvas.height * aspectRatio;

// Set background color
ctx.fillStyle = "lightblue";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Game variables
let bird = { x: 50, y: 150, velocityY: 0, width: 35, height: 35 };
let gravity = 0.8  // Scale gravity assuming 60 FPS as base
let jump = -10 // Scale jump strength
let pipes = [];
let pipeWidth = 50;
let pipeGap = canvas.height * 0.15
let score = 0;
let highScore = getCookie("highScore") || 0;
let gameRunning = true;
let frameCount = 0;
var debugMode = false;
let gameStarted = false;
let gamePaused = false;

let timeToNextPipe = 0;
let pipeInterval = 2000; // Time in milliseconds (e.g., 2000ms = 2 seconds between pipes)

// Bird image
let birdImg = new Image();
birdImg.src = "bird4.png"; // Bird

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function updateBird(deltaTime) {
  bird.velocityY += gravity * (deltaTime / (1000/60));
  bird.y += bird.velocityY * (deltaTime / (1000/60));
  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    gameOver();
  }
}

function addPipe() {
  // Must always have a bottom pipe
  let minTopPipeHeight = 100; // Minimum height for the top pipe
  let maxTopPipeHeight = canvas.height - pipeGap - 100; // Maximum height for the top pipe
  let topPipeHeight =
    Math.floor(Math.random() * (maxTopPipeHeight - minTopPipeHeight + 1)) +
    minTopPipeHeight;
  pipes.push({ x: canvas.width, y: topPipeHeight });
}

function drawPipes() {
  ctx.fillStyle = "#af185b";
  pipes.forEach(function (pipe) {
    let topPipeHeight = pipe.y;
    let bottomPipeY = topPipeHeight + pipeGap;
    ctx.fillRect(pipe.x, 0, pipeWidth, topPipeHeight);
    ctx.fillRect(pipe.x, bottomPipeY, pipeWidth, canvas.height - bottomPipeY);
  });
}

function updatePipes(deltaTime) {
  if (frameCount % 400 === 0) {
    // Change from 90 to 180 - Gap between each set of pipes
    addPipe();
  }

  // timeToNextPipe -= deltaTime;
  // if (timeToNextPipe <= 0) {
  //   addPipe();
  //   timeToNextPipe = pipeInterval + timeToNextPipe; // Reset timer, adding overflow to keep timing consistent
  // }
  pipes.forEach(function (pipe, index) {
    pipe.x -= 2 * (deltaTime / (1000/60)); // Adjust speed if necessary // Move pipes based on deltaTime
    if (pipe.x + pipeWidth < -pipeWidth) {
      // Change from 0 to -pipeWidth
      pipes.splice(index, 1);
    }
    if (pipe.x + pipeWidth < bird.x && !pipe.scored) {
      score++;
      pipe.scored = true; // Mark the pipe as scored - tracking scores
    }
    if (gameRunning && collisionDetection(pipe)) {
      gameOver(); // you die
    }
  });
}

function collisionDetection(pipe) {
  let birdRight = bird.x + bird.width;
  let birdBottom = bird.y + bird.height;
  let pipeRight = pipe.x + pipeWidth;
  let pipeTop = pipe.y;
  let pipeBottom = pipe.y + pipeGap;

  // Check for collision with the top pipe
  if (birdRight > pipe.x && bird.x < pipeRight && bird.y < pipeTop) {
    return true;
  }

  // Check for collision with the bottom pipe
  if (birdRight > pipe.x && bird.x < pipeRight && birdBottom > pipeBottom) {
    return true;
  }

  return false;
}
function timeUntilFloorCollision() {
  let distanceToFloor = canvas.height - (bird.y + bird.height);
  let velocityY = bird.velocityY;
  let time =
    (-velocityY +
      Math.sqrt(velocityY * velocityY + 2 * gravity * distanceToFloor)) /
    gravity;

  // Check for NaN or negative values
  if (isNaN(time) || time < 0) {
    return 0;
  }
  return time;
}

function perfectJump() {
  // Find the next pipe
  console.log("Perfect jump");
  let nextPipe = pipes.find((pipe) => pipe.x + pipe.width > bird.x);

  // Check if the bird is at the same height as the bottom of the next pipe's gap
  if (nextPipe && bird.y >= nextPipe.y + nextPipe.gap) {
    // Make the bird jump
    bird.velocityY = -jump; // Assuming a negative velocityY makes the bird move upwards
  }
}

function drawDebug() {
  // Debug: Draw collision boxes
  console.log("Debug mode on");
  pipes.forEach(function (pipe) {
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);

    ctx.fillStyle = "rgba(0, 0, 255, 0.3)";
    ctx.fillRect(
      pipe.x,
      pipe.y + pipeGap,
      pipeWidth,
      canvas.height - (pipe.y + pipeGap)
    );

    // Highlight the hitbox of the pipes in red
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(pipe.x, 0, pipeWidth, pipe.y);
    ctx.strokeRect(
      pipe.x,
      pipe.y + pipeGap,
      pipeWidth,
      canvas.height - (pipe.y + pipeGap)
    );
  });

  ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

  // Highlight the hitbox of the bird in red
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeRect(bird.x, bird.y, bird.width, bird.height);

  drawGravityArrow();
}

function drawGravityArrow() {
  let velocityY = bird.velocityY;
  let distanceToFloor = canvas.height - (bird.y + bird.height);
  let timeToCollision =
    (-velocityY +
      Math.sqrt(velocityY * velocityY + 2 * gravity * distanceToFloor)) /
    gravity;

  // Check for NaN or negative values
  if (isNaN(timeToCollision) || timeToCollision < 0) {
    timeToCollision = 0;
  }

  // Only draw if there is significant velocity
  if (Math.abs(velocityY) > 1) {
    // Set the color and style for the arrow
    ctx.strokeStyle = "purple";
    ctx.fillStyle = "purple";
    ctx.lineWidth = 2;

    // Calculate the center of the bird
    let centerX = bird.x + bird.width / 2;
    let centerY = bird.y + bird.height / 2;

    // Calculate the end point of the arrow based on velocity
    let endX = centerX;
    let endY = centerY + velocityY * 10; // Scale the length of the arrow

    // Draw the line for the arrow
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw the arrow head
    let arrowHeadSize = 5;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - arrowHeadSize, endY - arrowHeadSize);
    ctx.lineTo(endX + arrowHeadSize, endY - arrowHeadSize);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText(`${timeToCollision.toFixed(2)}ms`, endX + 10, endY);
  }
}

function gameOver() {
  gameRunning = false;
  gameStarted = false;
  updateHighScore();
  ctx.fillStyle = "black";
  ctx.font = "36px Arial";
  ctx.fillText("Game Over", 100, canvas.height / 2);
  ctx.fillText(`Score: ${score}`, 130, canvas.height / 2 + 40);
  ctx.fillText(`High Score: ${highScore}`, 100, canvas.height / 2 + 80);
  document.getElementById("restartButton").style.display = "block";
} // When die/failure

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    setCookie("highScore", highScore, 365);
  }
} // Store highest score in cookies

function restartGame() {
  // Self explainatry
  bird = { x: 50, y: 150, velocityY: 0, width: 30, height: 30 };
  pipes = [];
  score = 0;
  gameRunning = true;
  frameCount = 0;
  document.getElementById("restartButton").style.display = "none";
  gameStarted = false;
  //debugMode = window.debugMode || false;  // Keep the debug mode state
  gameLoop();
}

function setCookie(name, value, days) {
  // Set highscore
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
} // Don't touch

function getCookie(name) {
  // Gets high score
  let nameEQ = name + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
} // dont touch

document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    // Jump
    if (gameRunning) {
      bird.velocityY = jump;
      gameStarted = true;
    } else {
      restartGame();
    }
  }
  if (e.ctrlKey && e.altKey && e.shiftKey && e.key === "S") {
    // Toggle debugMode
    debugMode = !debugMode;
  }
  if (e.code === "Escape" && gameStarted) {
    //pause
    console.log(gameStarted);
    gamePaused = !gamePaused;
    if (gamePaused) {
      showPauseMenu();
    } else {
      requestAnimationFrame(gameLoop);
    }
  }
  if (e.ctrlKey && e.altKey && e.shiftKey && e.key === "H" && gameStarted) {
    // Activate the "hacker" shortcut key ++ Doesn't work
    perfectJump();
  }
}); // Trigger

canvas.addEventListener("click", function (event) {
  // left click on mouse
  if (gameRunning) {
    bird.velocityY = jump;
    gameStarted = true;
  } else {
    restartGame();
  }
}); // Another trigger

canvas.addEventListener(
  "touchstart",
  function (event) {
    // mobile clicks
    if (gameRunning) {
      bird.velocityY = jump;
      gameStarted = true;
    }
    event.preventDefault(); // Prevent the default action to avoid scrolling the page
  },
  false
); // Helps with mobile support

function showPauseMenu() {
  // Display pause menu
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Game Paused", canvas.width / 2 - 70, canvas.height / 2);
}

function hidePauseMenu() {
  // No need to clear the canvas here
  if (!gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}
let lastTime = 0;

function gameLoop(timestamp) {
  if (!gamePaused) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#A1DAC0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawBird();
    if (debugMode) {
      drawDebug(); // Debugging collision boxes
    }
    if (gameStarted) {
      drawPipes();
      updateBird(deltaTime);
      updatePipes(deltaTime);
      ctx.font = "20px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(score.toString(), 10, 30);
    }

    if (gamePaused) {
      showPauseMenu();
    } else if (gameRunning) {
      requestAnimationFrame(gameLoop);
    }

    frameCount++;
  } else {
    requestAnimationFrame(gameLoop);
  }
}

document.getElementById("restartButton").addEventListener("click", restartGame);

gameLoop();
