module.exports = {
  extends: ['eslint:recommended', 'google'],
  parserOptions: {
    ecmaVersion: 6
  },
  rules: {
    'linebreak-style': ['warn', 'windows'],
    'comma-dangle': ['error', 'never']
  }
};