import { updateGame } from "./physics.js";
import { draw } from "./renderer.js";
import { CONFIG } from "../config.js";

function gameLoop() {

    for (let i = 0; i < CONFIG.SUB_STEPS; i++) {
        updateGame();
    }

    draw();
    requestAnimationFrame(gameLoop);
}

export function startGameLoop() {
    gameLoop();
}