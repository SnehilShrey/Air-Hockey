import { CONFIG } from "../config.js";

export const player = {
    x: 150,
    y: CONFIG.HEIGHT / 2,
    radius: 20,
    vx: 0,
    vy: 0,
    prevX: 150,
    prevY: CONFIG.HEIGHT / 2
};

export const ai = {
    x: CONFIG.WIDTH - 150,
    y: CONFIG.HEIGHT / 2,
    radius: 20,
    speed: 6
};

const canvas = document.getElementById("gameCanvas");

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    player.prevX = player.x;
    player.prevY = player.y;

    player.x = Math.min(mouseX, CONFIG.WIDTH / 2 - player.radius);
    player.y = mouseY;

    if (player.y - player.radius < 0)
        player.y = player.radius;

    if (player.y + player.radius > CONFIG.HEIGHT)
        player.y = CONFIG.HEIGHT - player.radius;

    if (player.x - player.radius < 0)
        player.x = player.radius;

    player.vx = player.x - player.prevX;
    player.vy = player.y - player.prevY;
});