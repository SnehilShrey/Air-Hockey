import { CONFIG } from "../config.js";
import { puck } from "../entities/puck.js";
import { player, ai } from "../entities/paddle.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = CONFIG.WIDTH;
canvas.height = CONFIG.HEIGHT;

export function draw() {

    ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

    // center line
    ctx.strokeStyle = "white";
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CONFIG.WIDTH / 2, 0);
    ctx.lineTo(CONFIG.WIDTH / 2, CONFIG.HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    const goalTop = (CONFIG.HEIGHT - CONFIG.GOAL_HEIGHT) / 2;

    ctx.fillStyle = "white";
    ctx.fillRect(0, goalTop, 10, CONFIG.GOAL_HEIGHT);
    ctx.fillRect(CONFIG.WIDTH - 10, goalTop, 10, CONFIG.GOAL_HEIGHT);

    // player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    // AI
    ctx.beginPath();
    ctx.arc(ai.x, ai.y, ai.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();

    // puck
    ctx.beginPath();
    ctx.arc(puck.x, puck.y, puck.radius, 0, Math.PI * 2);
    ctx.fillStyle = "cyan";
    ctx.fill();
}