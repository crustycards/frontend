import Game from '../../../client/src/pages/Game.tsx';
import states from './Game.states.json';
import {generateTests} from '../testGen';

generateTests(Game, states);
