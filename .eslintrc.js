module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended', 'google'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    experimentalObjectRestSpread: true,
    ecmaFeatures: {
      jsx: true,
      modules: true
    }
  },
  parser: 'babel-eslint',
  rules: {
    'linebreak-style': ['warn', 'windows'],
    'comma-dangle': ['error', 'never'],
    'require-jsdoc': [0], // TODO - Remove
    'max-len': ['error', {code: 100}],
    'no-console': 1,
    'react/display-name': false, // TODO - Remove
    'react/prop-types': false, // TODO - Remove
    'new-cap': 0, // TODO - Remove
    'no-constant-condition': 0 // TODO - Remove
  },
  'globals': {
    describe: false,
    it: false
  },
  env: {
    node: true,
    browser: true,
    es6: true,
    jest: true
  }
};