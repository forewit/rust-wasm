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
        await init();

        // And afterwards we can use all the functionality defined in wasm.
        rust.greet("Marc");
    }
    run();

    // define global exports
    exports.rust = rust;

    Object.defineProperty(exports, '__esModule', { value: true });
})));