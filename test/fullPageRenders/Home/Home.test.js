import Home from '../../../client/src/pages/Home.jsx';
import states from './Home.states.json';
import {generateTests} from '../testGen';

generateTests(Home, states);
