module.exports = {
  extends: ['eslint:recommended', 'google'],
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module'
  },
  rules: {
    'linebreak-style': ['warn', 'windows'],
    'comma-dangle': ['error', 'never'],
    'max-len': ['error', {code: 120}] // TODO - Decrease this to ~100
  },
  'globals': {
    describe: false,
    it: false
  },
  env: {
    node: true,
    browser: true,
    es6: true
  }
};