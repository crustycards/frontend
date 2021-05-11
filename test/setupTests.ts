import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import {toMatchImageSnapshot} from 'jest-image-snapshot';

expect.extend({toMatchImageSnapshot});
Enzyme.configure({adapter: new Adapter()});
