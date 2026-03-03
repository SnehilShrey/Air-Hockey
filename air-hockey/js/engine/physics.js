import { CONFIG } from "../config.js";
import { puck, resetPuck } from "../entities/puck.js";
import { player, ai } from "../entities/paddle.js";

const FRICTION = 0.994;

let playerScore = 0;
let aiScore = 0;

export function updateGame() {

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
    const speed = Math.sqrt(puck.vx * puck.vx + puck.vy * puck.vy);

    if (speed > CONFIG.MAX_SPEED) {
        puck.vx = (puck.vx / speed) * CONFIG.MAX_SPEED;
        puck.vy = (puck.vy / speed) * CONFIG.MAX_SPEED;
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

        const restitution = 0.99;
        const impulse = -(1 + restitution) * velAlongNormal;

        puck.vx += impulse * nx;
        puck.vy += impulse * ny;

        if (!isPlayer) {
            puck.vx -= 1.5; // AI pushes back
        }
    }
}

function updateAI() {

    const defendLine = CONFIG.WIDTH * 0.75;
    const centerY = CONFIG.HEIGHT / 2;

    let targetX = defendLine;
    let targetY = centerY;

    // Only react if puck is moving toward AI
    if (puck.vx > 0) {

        // Predict where puck will reach defend line
        const time = (defendLine - puck.x) / puck.vx;

        if (time > 0) {

            let predictedY = puck.y + puck.vy * time;

            // Clamp inside board
            predictedY = Math.max(ai.radius, predictedY);
            predictedY = Math.min(CONFIG.HEIGHT - ai.radius, predictedY);

            targetY = predictedY;
        }
    }

    // IMPORTANT RULE:
    // AI never crosses puck's x position
    if (ai.x > puck.x - 10) {
        targetX = Math.min(defendLine, puck.x - 10);
    }

    moveAITo(targetX, targetY);
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