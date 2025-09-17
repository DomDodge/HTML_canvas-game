let canvas = document.getElementById("gameScreen");
let scoreText = document.getElementById("score-text");
let ctx;

// game variables
let movementX = 100;
let movementY = 350;
let speed = 5;
let direction = "none";
let tileSize = 50; 
let collected = false;
let lastSpace = [200, 350];
let coords = [800, 350];
let previousDir = [[movementX - tileSize, movementY], [movementX - tileSize, movementY]];
let nextDirQue = [];
let score = 0;
let moveSounds = {
    'right': 'sounds/right.wav',
    'left': 'sounds/left.wav',
    'down': 'sounds/down.wav',
    'up': 'sounds/up.m4a'
};
let backgroundMusic = new Audio('sounds/snake_song.wav');
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

function playMoveSound() {
    let src = moveSounds[direction];
    if(src) {
        let sound = new Audio(src);
        sound.play();
        sound.loop = false;
    }
}

// Get Direction
document.addEventListener('keydown', function(event) {
    // Go Left
    if((event.key === "a" || event.key === "ArrowLeft") && direction != "right") {
        if (nextDirQue.at(-1) != "left" && nextDirQue.at(-1) != "right") { nextDirQue.push("left"); }
    }

    // Go Down
    if((event.key === "s" || event.key === "ArrowDown") && direction != "up") {
        if (nextDirQue.at(-1) != "down" && nextDirQue.at(-1) != "up") { nextDirQue.push("down"); }
    }

    // Go Right
    if((event.key === "d" || event.key === "ArrowRight") && direction != "left") {
        if (nextDirQue.at(-1) != "right" && nextDirQue.at(-1) != "left") { nextDirQue.push("right"); }
    }

    // Go Up
    if((event.key === "w" || event.key === "ArrowUp") && direction != "down") {
        if (nextDirQue.at(-1) != "up" && nextDirQue.at(-1) != "down") { nextDirQue.push("up"); }
    }

    // Player Death
    if(event.key === "r" && isDead()) {
        movementX = 100;
        movementY = 350;
        speed = 5;
        direction = "none";
        coords = [800, 350];
        previousDir = [[movementX - tileSize, movementY], [movementX - tileSize, movementY]];
        collected = false;
        score = 0;
        gameLoop();
    }
});

function movement() {
    if(Number.isInteger(movementX / tileSize) && Number.isInteger(movementY / tileSize)) {
        let tempDir = nextDirQue.shift()
        if (direction != tempDir && tempDir) {
            direction = tempDir;
            playMoveSound();
        }
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

    // Get positions taken by the snake body
    deadList = deadZone();
    for (let i = 0; i < deadList.length; i++) {
        if(randX * tileSize === deadList[i][0] && randY * tileSize === deadList[i][1]) {
            return spawnAppleCords();
        }
    }

    let colSound = new Audio('sounds/collected.wav');
    colSound.play();
    colSound.loop = false;

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

function getImage(current, prev, next) {
    let file;
    // Straight horizontal
    if (current[1] === prev[1] && current[1] === next[1]) {
        file = "images/body1.svg";
    }
    // Straight vertical
    else if (current[0] === prev[0] && current[0] === next[0]) {
        file = "images/body2.svg";
    }
    // Up-to-Right OR Right-to-Up
    else if ((prev[1] > current[1] && next[0] > current[0]) || (prev[0] > current[0] && next[1] > current[1])) {
        file = "images/body3.svg";
    }
    // Up-to-Left OR Left-to-Up
    else if ((prev[1] > current[1] && next[0] < current[0]) || (prev[0] < current[0] && next[1] > current[1])) {
        file = "images/body6.svg";
    }
    // Down-to-Right OR Right-to-Down
    else if ((prev[1] < current[1] && next[0] > current[0]) || (prev[0] > current[0] && next[1] < current[1])) {
        file = "images/body4.svg";
    }
    // Down-to-Left OR Left-to-Down
    else if ((prev[1] < current[1] && next[0] < current[0]) || (prev[0] < current[0] && next[1] < current[1])) {
        file = "images/body5.svg";
    }
    else {
        file = "images/body1.svg";
    }
    return file;
}

function getTail(current, prev, next) {
    let file;
    if(current[1] === prev[1] && current[0] < prev[0]) {
        file = "images/tail1.svg";
    }
    else if (current[0] === prev[0] && current[1] > prev[1]) {
        file = "images/tail2.svg";
    }
    else if (current[1] === prev[1] && current[0] > prev[0]) {
        file = "images/tail3.svg";
    }
    else if (current[0] === prev[0] && current[1] < prev[1]) {
        file = "images/tail4.svg";
    }

    return file;
}

function generateTail() {
    let prevPos, nextPos;
    let size = score + 1;
    for(let i = 1; i <= size; i++) {

        currentPos = previousDir.at(-i);
        nextPos = previousDir.at(-i - 1);

        if(i === 1) {
            prevPos = [movementX, movementY];
        }

        if (i < size) {
            renderSprite(getImage(currentPos, prevPos, nextPos), currentPos[0], currentPos[1], tileSize, tileSize)
        }
        else {
            renderSprite(getTail(currentPos, prevPos, nextPos), currentPos[0], currentPos[1], tileSize, tileSize);
        }
        prevPos = currentPos;
    }
}

function startGame() {
    ctx = canvas.getContext("2d");
    requestAnimationFrame(gameLoop);
}

function deadZone() {
    return previousDir.slice(-score, -1);
}

function renderSprite(file, posX, posY, sizeX, sizeY) {
    const sprite = new Image();
    sprite.src = file;
    ctx.drawImage(sprite, posX, posY, sizeX, sizeY);
}
function renderPlayer() {
    let file = null;
    switch(direction) {
        case "left":
            file = "images/head3.svg";
            break;
        case "up":
            file = "images/head2.svg";
            break;
        case "down":
            file = "images/head4.svg";
            break;
        default:
            file = "images/head1.svg";
            break;
    }
    renderSprite(file, movementX, movementY, tileSize, tileSize);
}

function renderInstruction() {
    ctx.fillStyle = "rgb(156, 156, 156, 0.9)";
    ctx.fillRect(300, 200, canvas.width / 2, canvas.height / 2);
        // Text objects
    ctx.textAlign = "center";

    ctx.font = "40px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("SNAKE GAME", 600, 275);

    ctx.font = "20px Arial";
    ctx.fillText("Press Arrow keys or WASD to start", 600, 325);
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    // Renter Cureent Apple
    coords = collected ? spawnAppleCords() : coords;
    renderSprite("images/apple.svg", coords[0], coords[1], tileSize, tileSize)

    // Get the tail
    generateTail();

    // Player
    movement();
    renderPlayer();

    // Check if apple collected
    if(movementX === coords[0] && movementY === coords[1]) {
        score += 1;
        collected = true;
    }

    // Store Past Directions
    storeDir();

    scoreText.textContent = "score: " + score;

    if(direction != "none" && isDead() == false) {
        backgroundMusic.play();
    }

    if (direction === "none") {
        renderInstruction();
    }

    // Loop forever
    if(isDead() == false) {
        requestAnimationFrame(gameLoop);
    }
    else {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;

        let deathSound = new Audio('sounds/death.wav');
        deathSound.play();
        deathSound.loop = false;
        // Death Panel
        ctx.fillStyle = "rgb(156, 156, 156, 0.9)";
        ctx.fillRect(300, 200, canvas.width / 2, canvas.height / 2);
        // Text objects
        ctx.textAlign = "center";

        ctx.font = "40px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("YOU DIED!", 600, 275);

        ctx.font = "20px Arial";
        ctx.fillText("Your score was: " + score, 600, 325);

        ctx.fillText("Press R to restart" , 600, 400);
    }
}