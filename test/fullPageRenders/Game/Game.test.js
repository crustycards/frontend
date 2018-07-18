import Game from '../../../client/src/pages/Game.jsx';
import states from './Game.states.json';
import {generateTests} from '../testGen';

generateTests(Game, states);
