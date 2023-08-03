import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'es',
    },
    plugins: [typescript()],
  }, {
    // 更新测试文件
    input: 'tests/interface/report-jump/entry-esm.js',
    output: {
      file: 'tests/interface/report-jump/entry.js',
      format: 'es',
    },
  }];
