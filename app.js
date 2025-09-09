let canvas = document.getElementById("gameScreen")
let ctx;

// game variables
let movementX = 100;
let movementY = 350;
let speed = 5;
let direction = "none";
let nextDirection = "none";
let tileSize = 50; 

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

function startGame() {
    ctx = canvas.getContext("2d");
    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(50);

    movement();

    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(movementX, movementY, tileSize, tileSize);

    // Loop forever
    if(isDead() == false) {
        requestAnimationFrame(gameLoop);
    }
}