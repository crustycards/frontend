import Home from '../../../client/src/pages/Home.tsx';
import states from './Home.states.json';
import {generateTests} from '../testGen';

generateTests(Home, states);
