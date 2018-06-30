module.exports = {
  extends: ['eslint:recommended', 'google'],
  parserOptions: {
    ecmaVersion: 8
  },
  rules: {
    'linebreak-style': ['warn', 'windows'],
    'comma-dangle': ['error', 'never']
  }
};