import { CONFIG } from "../config.js";

export const puck = {
    x: CONFIG.WIDTH * 0.25,
    y: CONFIG.HEIGHT / 2,
    radius: 12,
    vx: 0,
    vy: 0
};

export function resetPuck() {
    puck.x = CONFIG.WIDTH * 0.25;
    puck.y = CONFIG.HEIGHT / 2;
    puck.vx = 0;
    puck.vy = 0;
}