import { CONFIG } from "./config.js";
import "./engine/gameLoop.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size from config
canvas.width = CONFIG.WIDTH;
canvas.height = CONFIG.HEIGHT;

// Start engine
startGameLoop(ctx);