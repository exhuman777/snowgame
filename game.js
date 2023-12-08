const gameContainer = document.getElementById('game-container');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const defeatedSnowmenDisplay = document.getElementById('defeatedSnowmenDisplay'); // Add an element with this ID in your HTML to display the count
const player = document.createElement('div');

player.id = 'player';
player.textContent = '😀';
gameContainer.appendChild(player);


const snowmen = [];
const snowballs = [];


const keyState = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

let defeatedSnowmenCount = 0;

const playerSpeed = 10;
const snowballSpeed = 10;
const snowmanSpeed = 1.2;
const snowmanSpawnRate = 0.01;

let canShoot = true;
let isGameOver = false;
let gameStarted = false;

let playerX = gameContainer.clientWidth / 2 - 30;
let playerY = gameContainer.clientHeight / 2 - 30;

player.style.left = `${playerX}px`;
player.style.top = `${playerY}px`;

function movePlayer(dx, dy) {
    playerX = Math.max(0, Math.min(gameContainer.clientWidth - 60, playerX + dx));
    playerY = Math.max(0, Math.min(gameContainer.clientHeight - 60, playerY + dy));

    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

function createSnowball(x, y) {
    const snowball = document.createElement('div');
    snowball.className = 'snowball';
    snowball.textContent = '❄️';
    snowball.style.left = `${x - 5}px`;
    snowball.style.top = `${y - 5}px`;
    gameContainer.appendChild(snowball);
    snowballs.push(snowball);
}

function moveSnowballs() {
    for (let i = snowballs.length - 1; i >= 0; i--) {
        let posY = parseInt(snowballs[i].style.top, 10) - snowballSpeed;
        snowballs[i].style.top = `${posY}px`;

        if (posY + snowballs[i].offsetHeight < 0) {
            gameContainer.removeChild(snowballs[i]);
            snowballs.splice(i, 1);
        }
    }
}

function createSnowman() {
    const snowman = document.createElement('div');
    snowman.className = 'snowman';
    snowman.textContent = '☃️';
    const posX = Math.random() * (gameContainer.clientWidth - 50);
    snowman.style.left = `${posX}px`;
    snowman.style.top = `0px`;
    gameContainer.appendChild(snowman);
    snowmen.push(snowman);
}

function moveSnowmen() {
    for (let i = snowmen.length - 1; i >= 0; i--) {
        let posY = parseInt(snowmen[i].style.top) + snowmanSpeed;
        snowmen[i].style.top = `${posY}px`;

        if (isColliding(player, snowmen[i])) {
            endGame();
        }

        if (posY > gameContainer.clientHeight) {
            gameContainer.removeChild(snowmen[i]);
            snowmen.splice(i, 1);
        } else {
            for (let j = snowballs.length - 1; j >= 0; j--) {
                if (isColliding(snowballs[j], snowmen[i])) {
                    gameContainer.removeChild(snowmen[i]);
                    gameContainer.removeChild(snowballs[j]);
                    snowmen.splice(i, 1);
                    snowballs.splice(j, 1);
                    defeatedSnowmenCount++;
                    updateDefeatedSnowmenDisplay();
                    break;
                }
            }
        }
    }
}

function isColliding(elem1, elem2) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();
    return !(rect1.top > rect2.bottom || rect1.right < rect2.left || rect1.bottom < rect2.top || rect1.left > rect2.right);
}

function updateDefeatedSnowmenDisplay() {
    defeatedSnowmenDisplay.textContent = `Defeated Snowmen: ${defeatedSnowmenCount}`;
}

function endGame() {
    isGameOver = true;
    gameStarted = false;
    alert("Game Over!");
    restartButton.style.display = 'block';
}
document.addEventListener('keydown', (event) => {
    if (isGameOver || !gameStarted) return;
    
    // Update keyState based on arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
        keyState[event.key] = true;
    }

    if (event.key === ' ' && canShoot) {
        createSnowball(playerX + 30, playerY - 10);
        canShoot = false;
        setTimeout(() => { canShoot = true; }, 500);
    }
});

document.addEventListener('keyup', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        keyState[event.key] = false;
    }
});



function startGame() {
    gameStarted = true;
    startButton.style.display = 'none';
    defeatedSnowmenCount = 0; // Reset count at the start of the game
    updateDefeatedSnowmenDisplay();
    gameLoop();
}

function restartGame() {
    if (!isGameOver) return;

    snowmen.forEach(snowman => gameContainer.removeChild(snowman));
    snowballs.forEach(snowball => gameContainer.removeChild(snowball));
    snowmen.length = 0;
    snowballs.length = 0;

    playerX = gameContainer.clientWidth / 2 - 30;
    playerY = gameContainer.clientHeight / 2 - 30;
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;

    isGameOver = false;
    gameStarted = true;
    restartButton.style.display = 'none';
    defeatedSnowmenCount = 0; // Reset count on restart
    updateDefeatedSnowmenDisplay();
    gameLoop();
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

function gameLoop() {
    if (isGameOver || !gameStarted) return;

    // Player movement based on arrow key states
    if (keyState.ArrowUp) movePlayer(0, -playerSpeed);
    if (keyState.ArrowDown) movePlayer(0, playerSpeed);
    if (keyState.ArrowLeft) movePlayer(-playerSpeed, 0);
    if (keyState.ArrowRight) movePlayer(playerSpeed, 0);

    moveSnowballs();
    moveSnowmen();

    if (Math.random() < snowmanSpawnRate) {
        createSnowman();
    }

    requestAnimationFrame(gameLoop);
}

