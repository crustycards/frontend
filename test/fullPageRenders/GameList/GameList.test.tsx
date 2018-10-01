import * as React from 'react';
import GameList from '../../../src/client/src/pages/GameList';
import {generateTests} from '../testGen';
const states = require('./GameList.states.json');

generateTests(() => (<GameList/>), states);
