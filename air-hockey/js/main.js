import { CONFIG } from "./config.js";
import "./engine/gameLoop.js";
import { startGameLoop } from "./engine/gameLoop.js";

startGameLoop();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size from config
canvas.width = CONFIG.WIDTH;
canvas.height = CONFIG.HEIGHT;

// Start engine
startGameLoop(ctx);

import { startRound } from "./engine/physics.js";

canvas.addEventListener("click", () => {
    startRound();
});