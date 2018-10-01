import * as React from 'react';
import Home from '../../../src/client/src/pages/Home';
import {generateTests} from '../testGen';
const states = require('./Home.states.json');

generateTests(() => (<Home/>), states);
