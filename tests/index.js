import { Monitor } from '../src/index.js';

const monitor = new Monitor(
  (contents) => {
    console.log(contents);
    const custom = new CustomEvent('report', { detail: contents });
    window.dispatchEvent(custom);
  },

);
