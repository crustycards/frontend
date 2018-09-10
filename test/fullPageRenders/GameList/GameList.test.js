import GameList from '../../../client/src/pages/GameList.tsx';
import states from './GameList.states.json';
import {generateTests} from '../testGen';

generateTests(GameList, states);
