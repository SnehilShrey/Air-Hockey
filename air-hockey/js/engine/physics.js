import { CONFIG } from "../config.js";
import { puck, resetPuck } from "../entities/puck.js";
import { player, ai } from "../entities/paddle.js";

const FRICTION = 0.992;
const MAX_SPEED = 12;

export let playerScore = 0;
export let aiScore = 0;
export let gameState = "serve";

export function updateGame() {

    //if (gameState !== "playing") return;

    updateAI();

    puck.x += puck.vx;
    puck.y += puck.vy;

    puck.vx *= FRICTION;
    puck.vy *= FRICTION;

    clampSpeed();

    handleWallCollision();
    handlePlayerCollision();
    handleAICollision();
    checkGoal();
}

function clampSpeed() {
    const speed = Math.hypot(puck.vx, puck.vy);

    if (speed > MAX_SPEED) {
        const scale = MAX_SPEED / speed;
        puck.vx *= scale;
        puck.vy *= scale;
    }
}

function handleWallCollision() {

    if (puck.y - puck.radius <= 0) {
        puck.y = puck.radius;
        puck.vy *= -1;
    }

    if (puck.y + puck.radius >= CONFIG.HEIGHT) {
        puck.y = CONFIG.HEIGHT - puck.radius;
        puck.vy *= -1;
    }
}

function checkGoal() {

    const goalTop = (CONFIG.HEIGHT - CONFIG.GOAL_HEIGHT) / 2;
    const goalBottom = goalTop + CONFIG.GOAL_HEIGHT;

    // Right goal (player scores)
    if (puck.x + puck.radius >= CONFIG.WIDTH) {

        if (puck.y > goalTop && puck.y < goalBottom) {
            playerScore++;
            resetPuck();
            gameState = "serve";
        } else {
            puck.x = CONFIG.WIDTH - puck.radius;
            puck.vx *= -1;
        }
    }

    // Left goal (AI scores)
    if (puck.x - puck.radius <= 0) {

        if (puck.y > goalTop && puck.y < goalBottom) {
            aiScore++;
            resetPuck();
        } else {
            puck.x = puck.radius;
            puck.vx *= -1;
        }
    }

    if (playerScore >= CONFIG.WINNING_SCORE ||
    aiScore >= CONFIG.WINNING_SCORE) {

    gameState = "gameover";
}
}

function handlePlayerCollision() {

    circleCollision(player, true);
}

function handleAICollision() {

    circleCollision(ai, false);
}

function circleCollision(paddle, isPlayer) {

    const dx = puck.x - paddle.x;
    const dy = puck.y - paddle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDist = puck.radius + paddle.radius;

    if (distance < minDist) {

        const nx = dx / distance;
        const ny = dy / distance;

        const overlap = minDist - distance;

        puck.x += nx * overlap;
        puck.y += ny * overlap;

        const rvx = puck.vx - (isPlayer ? paddle.vx : 0);
        const rvy = puck.vy - (isPlayer ? paddle.vy : 0);

        const velAlongNormal = rvx * nx + rvy * ny;

        if (velAlongNormal > 0) return;

        const restitution = 0.1;
        const impulse = -(1 + restitution) * velAlongNormal;

        puck.vx += impulse * nx;
        puck.vy += impulse * ny;

        if (!isPlayer) {
            puck.vx -= 1.5; // AI pushes back
        }
    }
}

function updateAI() {

    const rightHalfStart = CONFIG.WIDTH / 2 + ai.radius;
    const rightEdge = CONFIG.WIDTH - ai.radius;

    // --- STRIKE MODE ---
    // If puck is on AI side → attack directly
    if (puck.x > CONFIG.WIDTH / 2) {

        moveAITo(puck.x, puck.y);

    } 
    // --- DEFENSIVE MODE ---
    else {

        // Stay near center but responsive vertically
        moveAITo(CONFIG.WIDTH - 120, puck.y);
    }

    // Hard restriction: AI never crosses half
    if (ai.x < rightHalfStart)
        ai.x = rightHalfStart;

    if (ai.x > rightEdge)
        ai.x = rightEdge;
}

function moveAITo(targetX, targetY) {

    const dx = targetX - ai.x;
    const dy = targetY - ai.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
        ai.x += (dx / distance) * ai.speed;
        ai.y += (dy / distance) * ai.speed;
    }

    // Restrict to right half
    if (ai.x - ai.radius < CONFIG.WIDTH / 2)
        ai.x = CONFIG.WIDTH / 2 + ai.radius;

    if (ai.x + ai.radius > CONFIG.WIDTH)
        ai.x = CONFIG.WIDTH - ai.radius;

    if (ai.y - ai.radius < 0)
        ai.y = ai.radius;

    if (ai.y + ai.radius > CONFIG.HEIGHT)
        ai.y = CONFIG.HEIGHT - ai.radius;
}

export function startRound() {
    if (gameState === "serve") {
        gameState = "playing";
    }
}