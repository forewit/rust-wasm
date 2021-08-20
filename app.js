// imports
import init, * as rust from './pkg/rust_wasm.js';


(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.app = {}));
}(this, (function (exports) {
    'use strict';

    // do something
    async function run() {
        const wasm = await init();
        // ------- now we can use the functionality in the wasm -------

        // setup game-of-life
        const CELL_SIZE = 5; // px
        const GRID_COLOR = "#CCCCCC";
        const DEAD_COLOR = "#FFFFFF";
        const ALIVE_COLOR = "#000000";

        // Construct the universe, and get its width and height.
        const universe = rust.Universe.new();
        const width = universe.width();
        const height = universe.height();
        universe.add_spaceship();

        // Give the canvas room for all of our cells and a 1px border
        // around each of them.
        const canvas = document.getElementById("game-of-life-canvas");
        canvas.height = (CELL_SIZE + 1) * height + 1;
        canvas.width = (CELL_SIZE + 1) * width + 1;

        const ctx = canvas.getContext('2d');

        const renderLoop = () => {
            universe.tick();

            drawGrid();
            drawCells();

            requestAnimationFrame(renderLoop);
        };

        const drawGrid = () => {
            ctx.beginPath();
            ctx.strokeStyle = GRID_COLOR;

            // Vertical lines.
            for (let i = 0; i <= width; i++) {
                ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
                ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
            }

            // Horizontal lines.
            for (let j = 0; j <= height; j++) {
                ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
                ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
            }

            ctx.stroke();
        };

        const getIndex = (row, column) => {
            return row * width + column;
        };

        const drawCells = () => {
            const cellsPtr = universe.cells();
            const cells = new Uint8Array(wasm.memory.buffer, cellsPtr, width * height);

            ctx.beginPath();

            for (let row = 0; row < height; row++) {
                for (let col = 0; col < width; col++) {
                    const idx = getIndex(row, col);

                    ctx.fillStyle = cells[idx] === rust.Cell.Dead
                        ? DEAD_COLOR
                        : ALIVE_COLOR;

                    ctx.fillRect(
                        col * (CELL_SIZE + 1) + 1,
                        row * (CELL_SIZE + 1) + 1,
                        CELL_SIZE,
                        CELL_SIZE
                    );
                }
            }

            ctx.stroke();
        };

        // start rendering
        drawGrid();
        drawCells();
        requestAnimationFrame(renderLoop);
    }
    run();

    // define global exports
    exports.rust = rust;

    Object.defineProperty(exports, '__esModule', { value: true });
})));