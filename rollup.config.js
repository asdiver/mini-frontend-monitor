import typescript from '@rollup/plugin-typescript';

export default {
  input: 'tests/index.js',
  output: [{
    file: 'dist/index.js',
    format: 'es',
  }, {
    file: 'dist/index.ts',
    format: 'es',
  }],
  plugins: [typescript()],
};
