const canvas = document.getElementById('galaga-canvas');
const ctx = canvas.getContext('2d');

const W = canvas.width;
const H = canvas.height;

let keys = {};
let gameState = 'title';
let score = 0;
let highScore = parseInt(localStorage.getItem('galaga-high') || '0', 10);
let lives = 3;
let frame = 0;

const player = { x: W / 2, y: H - 40, w: 28, h: 24, speed: 4, cooldown: 0 };
let bullets = [];
let enemies = [];
let enemyBullets = [];
let particles = [];

const ENEMY_COLS = 8;
const ENEMY_ROWS = 4;
const ENEMY_W = 28;
const ENEMY_H = 22;
const ENEMY_GAP = 8;

function initEnemies() {
    enemies = [];
    const startX = (W - ENEMY_COLS * (ENEMY_W + ENEMY_GAP)) / 2 + ENEMY_W / 2;
    const startY = 60;

    for (let row = 0; row < ENEMY_ROWS; row++) {
        for (let col = 0; col < ENEMY_COLS; col++) {
            enemies.push({
                x: startX + col * (ENEMY_W + ENEMY_GAP),
                y: startY + row * (ENEMY_H + ENEMY_GAP),
                w: ENEMY_W,
                h: ENEMY_H,
                row,
                col,
                alive: true,
                diving: false,
                diveAngle: 0,
                diveSpeed: 0,
                originX: 0,
                originY: 0,
                shootTimer: Math.random() * 200 + 100,
            });
        }
    }
}

function resetGame() {
    score = 0;
    lives = 3;
    bullets = [];
    enemyBullets = [];
    particles = [];
    player.x = W / 2;
    player.cooldown = 0;
    initEnemies();
    updateHud();
}

function startGame() {
    resetGame();
    gameState = 'playing';
}

function drawStars() {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 40; i++) {
        const sx = (i * 137 + frame * 0.3) % W;
        const sy = (i * 89 + frame * 0.5) % H;
        const size = i % 3 === 0 ? 2 : 1;
        ctx.globalAlpha = 0.3 + (i % 5) * 0.1;
        ctx.fillRect(sx, sy, size, size);
    }
    ctx.globalAlpha = 1;
}

function drawPlayer() {
    const { x, y, w, h } = player;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(x, y - h / 2);
    ctx.lineTo(x - w / 2, y + h / 2);
    ctx.lineTo(x, y + h / 4);
    ctx.lineTo(x + w / 2, y + h / 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(x - 4, y + h / 4, 8, 6);
}

function drawEnemy(e) {
    if (!e.alive) return;
    const colors = ['#a855f7', '#ec4899', '#f59e0b', '#22c55e'];
    ctx.fillStyle = colors[e.row % colors.length];

    ctx.beginPath();
    ctx.moveTo(e.x, e.y - e.h / 2);
    ctx.lineTo(e.x - e.w / 2, e.y + e.h / 2);
    ctx.lineTo(e.x - e.w / 4, e.y);
    ctx.lineTo(e.x + e.w / 4, e.y);
    ctx.lineTo(e.x + e.w / 2, e.y + e.h / 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.fillRect(e.x - 6, e.y - 2, 4, 4);
    ctx.fillRect(e.x + 2, e.y - 2, 4, 4);
}

function drawBullet(b) {
    ctx.fillStyle = b.fromPlayer ? '#fbbf24' : '#ef4444';
    ctx.fillRect(b.x - 2, b.y - 6, 4, 10);
}

function drawParticles() {
    particles.forEach((p) => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    ctx.globalAlpha = 1;
}

function spawnParticles(x, y, color) {
    for (let i = 0; i < 12; i++) {
        particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            size: Math.random() * 3 + 2,
            life: 1,
            color,
        });
    }
}

function collide(a, b) {
    return Math.abs(a.x - b.x) < (a.w || 8) / 2 + (b.w || 8) / 2
        && Math.abs(a.y - b.y) < (a.h || 10) / 2 + (b.h || 10) / 2;
}

function updatePlayer() {
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
    player.x = Math.max(20, Math.min(W - 20, player.x));

    if (player.cooldown > 0) player.cooldown--;

    if ((keys[' '] || keys['ArrowUp']) && player.cooldown <= 0) {
        bullets.push({ x: player.x, y: player.y - 20, fromPlayer: true, w: 4, h: 10 });
        player.cooldown = 12;
    }
}

function updateEnemies() {
    const alive = enemies.filter((e) => e.alive);
    if (alive.length === 0) {
        initEnemies();
        return;
    }

    const sway = Math.sin(frame * 0.02) * 1.5;
    alive.forEach((e) => {
        if (!e.diving) {
            e.x += sway;
            e.shootTimer--;
            if (e.shootTimer <= 0 && Math.random() < 0.008) {
                enemyBullets.push({ x: e.x, y: e.y + 10, fromPlayer: false, w: 4, h: 10 });
                e.shootTimer = Math.random() * 150 + 80;
            }
            if (Math.random() < 0.0008 && e.row >= 2) {
                e.diving = true;
                e.diveAngle = Math.atan2(player.y - e.y, player.x - e.x);
                e.diveSpeed = 2.5 + e.row * 0.3;
                e.originX = e.x;
                e.originY = e.y;
            }
        } else {
            e.x += Math.cos(e.diveAngle) * e.diveSpeed;
            e.y += Math.sin(e.diveAngle) * e.diveSpeed;
            if (e.y > H + 30 || e.x < -30 || e.x > W + 30) {
                e.diving = false;
                e.x = e.originX;
                e.y = e.originY;
            }
        }
    });
}

function updateBullets() {
    bullets = bullets.filter((b) => {
        b.y -= 7;
        if (b.y < -10) return false;

        for (const e of enemies) {
            if (e.alive && collide(b, e)) {
                e.alive = false;
                spawnParticles(e.x, e.y, '#fbbf24');
                score += (4 - e.row) * 100;
                updateHud();
                return false;
            }
        }
        return true;
    });

    enemyBullets = enemyBullets.filter((b) => {
        b.y += 5;
        if (b.y > H + 10) return false;
        if (collide(b, player)) {
            loseLife();
            return false;
        }
        return true;
    });
}

function updateParticles() {
    particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;
        return p.life > 0;
    });
}

function checkEnemyCollision() {
    for (const e of enemies) {
        if (e.alive && collide(e, player)) {
            e.alive = false;
            spawnParticles(e.x, e.y, '#ef4444');
            loseLife();
        }
    }
}

function loseLife() {
    lives--;
    spawnParticles(player.x, player.y, '#38bdf8');
    updateHud();
    if (lives <= 0) {
        gameState = 'over';
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('galaga-high', String(highScore));
        }
    }
}

function updateHud() {
    document.getElementById('score').textContent = String(score).padStart(6, '0');
    document.getElementById('high-score').textContent = String(highScore).padStart(6, '0');
    document.getElementById('lives').textContent = '♥'.repeat(Math.max(0, lives));
}

function drawTitle() {
    drawStars();
    ctx.fillStyle = '#fbbf24';
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('GALAGA', W / 2, H / 2 - 40);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px "Press Start 2P"';
    ctx.fillText('PRESS SPACE', W / 2, H / 2 + 20);
    ctx.fillText('TO START', W / 2, H / 2 + 40);
}

function drawGameOver() {
    drawStars();
    enemies.forEach(drawEnemy);
    drawPlayer();

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#ef4444';
    ctx.font = '16px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', W / 2, H / 2 - 20);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '10px "Press Start 2P"';
    ctx.fillText(`SCORE ${score}`, W / 2, H / 2 + 20);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('PRESS SPACE', W / 2, H / 2 + 50);
}

function gameLoop() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    if (gameState === 'title') {
        drawTitle();
    } else if (gameState === 'playing') {
        drawStars();
        updatePlayer();
        updateEnemies();
        updateBullets();
        updateParticles();
        checkEnemyCollision();

        enemies.forEach(drawEnemy);
        bullets.forEach(drawBullet);
        enemyBullets.forEach(drawBullet);
        drawParticles();
        drawPlayer();
    } else if (gameState === 'over') {
        drawGameOver();
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' || e.key === 'ArrowUp') e.preventDefault();

    if (e.key === ' ' && gameState === 'title') startGame();
    if (e.key === ' ' && gameState === 'over') startGame();
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

updateHud();
initEnemies();
gameLoop();