const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const aspectRatio = 400 / 600; // original width / height
canvas.height = window.innerHeight;
canvas.width = canvas.height * aspectRatio;

// Set background color
ctx.fillStyle = 'lightblue';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Game variables
let bird = { x: 50, y: 150, velocityY: 0, width: 30, height: 30 };
let gravity = 0.6;
let jump = -8;
let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;
let score = 0;
let highScore = getCookie('highScore') || 0;
let gameRunning = true;
let frameCount = 0;
var debugMode = false;
let gameStarted = false;

// Bird image
let birdImg = new Image();
birdImg.src = 'bird2.png';  // Make sure this path is correct

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
    bird.velocityY += gravity;
    bird.y += bird.velocityY;
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver();
    }
}

function addPipe() {
    // Ensure there's always enough space for a bottom pipe
    let minTopPipeHeight = 100; // Minimum height for the top pipe
    let maxTopPipeHeight = canvas.height - pipeGap - 100; // Maximum height for the top pipe
    let topPipeHeight = Math.floor(Math.random() * (maxTopPipeHeight - minTopPipeHeight + 1)) + minTopPipeHeight;
    pipes.push({ x: canvas.width, y: topPipeHeight });
}

function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(function(pipe) {
        let topPipeHeight = pipe.y;
        let bottomPipeY = topPipeHeight + pipeGap;
        ctx.fillRect(pipe.x, 0, pipeWidth, topPipeHeight);
        ctx.fillRect(pipe.x, bottomPipeY, pipeWidth, canvas.height - bottomPipeY);
    });
}

function updatePipes() {
    if (frameCount % 120 === 0) { // Change from 90 to 180
        addPipe();
    }
    pipes.forEach(function(pipe, index) {
        pipe.x -= 2;
        if (pipe.x + pipeWidth < -pipeWidth) { // Change from 0 to -pipeWidth
            pipes.splice(index, 1);
        }
        if (pipe.x + pipeWidth < bird.x && !pipe.scored) {
            score++;
            pipe.scored = true; // Mark the pipe as scored
        }
        if (gameRunning && collisionDetection(pipe)) {
            gameOver();
        }
    });
}

function collisionDetection(pipe) {
    let birdRight = bird.x + bird.width;
    let birdBottom = bird.y + bird.height;
    let pipeRight = pipe.x + pipeWidth;
    let pipeBottom = pipe.y + pipeGap;

    // Check for collision with the top pipe
    if (
        birdRight > pipe.x &&
        bird.x < pipeRight &&
        bird.y < pipe.y
    ) {
        return true;
    }

    // Check for collision with the bottom pipe
    if (
        birdRight > pipe.x &&
        bird.x < pipeRight &&
        birdBottom > pipeBottom
    ) {
        return true;
    }

    return false;
}

function drawDebug() {
    // Debug: Draw collision boxes
    pipes.forEach(function(pipe) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.y);

        ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - (pipe.y + pipeGap));
    });

    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function gameOver() {
    gameRunning = false;
    updateHighScore();
    ctx.fillStyle = 'black';
    ctx.font = '36px Arial';
    ctx.fillText('Game Over', 100, canvas.height / 2);
    ctx.fillText(`Score: ${score}`, 130, canvas.height / 2 + 40);
    ctx.fillText(`High Score: ${highScore}`, 100, canvas.height / 2 + 80);
    document.getElementById('restartButton').style.display = 'block';
}

function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        setCookie('highScore', highScore, 365);
    }
}

function restartGame() {
    bird = { x: 50, y: 150, velocityY: 0, width: 30, height: 30 };
    pipes = [];
    score = 0;
    gameRunning = true;
    frameCount = 0;
    document.getElementById('restartButton').style.display = 'none';
    gameStarted = false;
    //debugMode = window.debugMode || false;  // Keep the debug mode state
    gameLoop();
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && gameRunning) {
        bird.velocityY = jump;
        gameStarted = true;
    }
});

canvas.addEventListener('click', function(event) {
    if (gameRunning) {
        bird.velocityY = jump;
        gameStarted = true;
    }
});

canvas.addEventListener('touchstart', function(event) {
    if (gameRunning) {
        bird.velocityY = jump;
        gameStarted = true;
    }
    event.preventDefault(); // Prevent the default action to avoid scrolling the page
}, false);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set and draw the background color
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBird();
    if (debugMode) {
        drawDebug();  // Debugging collision boxes
    }  
    if (gameStarted) {  // Add this line
        drawPipes();
        updateBird();
        updatePipes();
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';

    // Draw the score
        ctx.fillText(score.toString(), 10, 30);
  
        if (gameRunning) {
            requestAnimationFrame(gameLoop);
        }
        frameCount++;
    } else {
        requestAnimationFrame(gameLoop);
    }
}

document.getElementById('restartButton').addEventListener('click', restartGame);

gameLoop();
