module.exports = {
  extends: [
    '@fastcoder/eslint-config-ts',
  ],
  rules:{
    // 取消else换行
    "@typescript-eslint/brace-style":"off",
    // 关闭必须接受new对象
    "no-new":"off",
    // todo
    "no-console":"off",
  }
};
