import { Monitor } from '../../dist/index';

window.report = [];
new Monitor(
  (contents) => {
    window.report.push(...contents);
  },

);
