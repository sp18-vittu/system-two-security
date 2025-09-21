"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { window } = globalThis;
const local = {
    clear: () => {
        const { localStorage } = window;
        localStorage.clear();
    },
    getItem: (item_name) => {
        const { localStorage } = window;
        return localStorage.getItem(`SYNTH::${item_name}`);
    },
    setItem: (itemName, value) => {
        const { localStorage } = window;
        return localStorage.setItem(`SYNTH::${itemName}`, value);
    },
};
exports.default = local;
