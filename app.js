console.log("app.js is loaded...")

import init, * as rust from './pkg/rust_wasm.js';

async function run() {
    await init();

    // And afterwards we can use all the functionality defined in wasm.
    rust.greet("Marc");
}

run();