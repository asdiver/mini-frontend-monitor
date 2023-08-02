import { Monitor } from '../dist/index';

new Monitor(
  (contents) => {
    console.log(contents);
    const custom = new CustomEvent('report', { detail: contents });
    window.dispatchEvent(custom);
  },

);
