// Initial Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameObjects = [];
let player, currentLevel = 0;
const levels = [];

// Game Loop
function gameLoop() {
    updateGame();
    renderGame();
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

// Game Update Function
function updateGame() {
    gameObjects.forEach(obj => obj.update());
    if (player.health <= 0) resetGame();
}

// Game Render Function
function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameObjects.forEach(obj => obj.render(ctx));
    drawUI();
}

// Reset Game
function resetGame() {
    player = new Player(50, 500);
    gameObjects.length = 0;
    loadLevel(currentLevel);
}

// Physics System
function applyPhysics(obj) {
    obj.velocityY += obj.gravity;
    obj.x += obj.velocityX;
    obj.y += obj.velocityY;

    // Basic Collision Detection
    if (obj.y + obj.height > canvas.height) {
        obj.y = canvas.height - obj.height;
        obj.velocityY = 0;
    }
}

// Basic AI System
function enemyAI(enemy) {
    if (Math.abs(enemy.x - player.x) < 200) {
        enemy.velocityX = player.x > enemy.x ? 1 : -1;
    } else {
        enemy.velocityX = 0;
    }
}

// Game Objects
class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityX = 0;
        this.velocityY = 0;
        this.gravity = 0.5;
    }

    update() {
        applyPhysics(this);
    }

    render(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Player Class
class Player extends GameObject {
    constructor(x, y) {
        super(x, y, 50, 50);
        this.health = 100;
    }

    update() {
        super.update();
        if (keys['ArrowLeft']) this.velocityX = -3;
        if (keys['ArrowRight']) this.velocityX = 3;
        if (keys['ArrowUp'] && this.y + this.height >= canvas.height) this.velocityY = -10;
    }
}

// Enemy Class
class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y, 50, 50);
    }

    update() {
        super.update();
        enemyAI(this);
    }
}

// UI
function drawUI() {
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, player.health * 2, 20); // Health Bar
    ctx.fillStyle = 'white';
    ctx.fillText(`Health: ${player.health}`, 10, 50);
}

// Levels
function loadLevel(levelIndex) {
    const level = levels[levelIndex];
    level.platforms.forEach(p => gameObjects.push(new GameObject(p.x, p.y, p.width, p.height)));
    level.enemies.forEach(e => gameObjects.push(new Enemy(e.x, e.y)));
    gameObjects.push(player);
}

// Define Levels
levels.push({
    platforms: [{ x: 0, y: 550, width: 800, height: 50 }, { x: 200, y: 400, width: 100, height: 20 }],
    enemies: [{ x: 400, y: 500 }]
});

// Input Handling
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Initialize Game
resetGame();
