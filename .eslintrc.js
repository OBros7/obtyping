module.exports = {
  extends: ['next/core-web-vitals', 'plugin:import/recommended', 'plugin:import/warnings', 'prettier'],
  rules: {},
  settings: {
    'import/resolver': {
      typescript: {
        // 何も書かなければ tsconfig.json を自動検出
      },
    },
  },
}
