/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest', // ts-jestを使用するためのプリセット
  // testEnvironment: "node",
  testEnvironment: 'jest-environment-jsdom', // ここを確認
  // transform: {
  //   "^.+.tsx?$": ["ts-jest",{}],
  // },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}], // 正規表現のエスケープを修正
  },
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy', // CSSモジュールをスタブ化
  },
}
