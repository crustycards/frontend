import GameList from '../../../client/src/pages/GameList.jsx';
import states from './GameList.states.json';
import {generateTests} from '../testGen';

generateTests(GameList, states);
