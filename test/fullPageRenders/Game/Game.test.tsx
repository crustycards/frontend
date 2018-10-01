import * as React from 'react';
import Game from '../../../src/client/src/pages/Game';
import {generateTests} from '../testGen';
const states = require('./Game.states.json');

generateTests(() => (<Game/>), states);
