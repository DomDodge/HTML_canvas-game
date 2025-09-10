let canvas = document.getElementById("gameScreen");
let scoreText = document.getElementById("score-text");
let ctx;

// game variables
let movementX = 100;
let movementY = 350;
let speed = 5;
let direction = "none";
let nextDirection = "none";
let tileSize = 50; 
let collected = false;
let lastSpace = [200, 350];
let coords = [800, 350];
let previousDir = [];
let score = 0;

// Get Direction
document.addEventListener('keydown', function(event) {
    // Go Left
    if((event.key === "a" || event.key === "ArrowLeft") && direction != "right") {
        nextDirection = "left";
    }

    // Go Down
    if((event.key === "s" || event.key === "ArrowDown") && direction != "up") {
        nextDirection = "down";
    }

    // Go Right
    if((event.key === "d" || event.key === "ArrowRight") && direction != "left") {
        nextDirection = "right";
    }

    // Go Up
    if((event.key === "w" || event.key === "ArrowUp") && direction != "down") {
        nextDirection = "up";
    }
});

function movement() {
    if(Number.isInteger(movementX / tileSize) && Number.isInteger(movementY / tileSize)) {
        direction = nextDirection;
    }

    switch(direction) {
        case "right":
            movementX += speed;
            break;
        case "left":
            movementX -= speed;
            break;
        case "down":
            movementY += speed;
            break;
        case "up":
            movementY -= speed;
            break;
        default:
            movementX = movementX;
            movementY = movementY;
    }   
}

function isDead() {
    let dead = false;

    // Check if player is within bounds
    if(movementX < 0 || movementX > canvas.width - tileSize || movementY < 0 || movementY > canvas.height - tileSize) {
        dead = true;
    }  

    deadList = deadZone();
    for (let i = 0; i < deadList.length; i++) {
        let x = Math.round(movementX / tileSize) * tileSize;
        let y = Math.round(movementY / tileSize) * tileSize;

        if(x === deadList[i][0] && y === deadList[i][1]) {
            dead = true;
        }
    }

    return dead;
}

function drawGrid() {
    for (let y = 0; y < canvas.height; y += tileSize) {
        for (let x = 0; x < canvas.width; x += tileSize) {
            if((x / tileSize + y / tileSize) % 2 === 0) {
                ctx.fillStyle = "#91db69"
            } else {
                ctx.fillStyle = "#cddf6c";
            }
            ctx.fillRect(x, y, tileSize, tileSize);
        }
    }
}

function spawnAppleCords() {
    let xDist = (canvas.width / tileSize);
    let yDist = (canvas.height / tileSize);
    let randX = Math.floor(Math.random() * xDist);
    let randY = Math.floor(Math.random() * yDist);

    deadList = deadZone();
    for (let i = 0; i < deadList.length; i++) {
        if(randX === deadList[i][0] && randY === deadList[i][1]) {
            return spawnAppleCords();
        }
    }

    collected = false;
    return [randX * tileSize, randY * tileSize];
}

function storeDir() {
    // see if the players direction is a tile different from last direction
    if(Math.abs(lastSpace[0] - movementX) >= 50 || Math.abs(lastSpace[1] - movementY) >= 50) {
        lastSpace[0] = movementX;
        lastSpace[1] = movementY;
        previousDir.push([movementX, movementY]);
    }
}

function generateTail() {
    for(let i = 1; i < score + 1; i++) {
        let xVariance = 0;
        let yVariance = 0;

        lastDir = previousDir.at(-i);
        ctx.fillStyle = "navy";

        ctx.fillRect(lastDir[0], lastDir[1], tileSize, tileSize);
    }
}

function startGame() {
    ctx = canvas.getContext("2d");
    requestAnimationFrame(gameLoop);
}

function deadZone() {
    return previousDir.slice(-score, -1);
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    // Renter Cureent Apple
    coords = collected ? spawnAppleCords() : coords;
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(coords[0], coords[1], tileSize, tileSize);

    // Player
    movement();
    ctx.fillStyle = "navy";
    ctx.fillRect(movementX, movementY, tileSize, tileSize);
    // Get the tail
    generateTail();

    // Check if apple collected
    if(movementX === coords[0] && movementY === coords[1]) {
        score += 1;
        collected = true;
    }

    // Store Past Directions
    storeDir();

    scoreText.textContent = "score: " + score;

    // Loop forever
    if(isDead() == false) {
        requestAnimationFrame(gameLoop);
    }
}