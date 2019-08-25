import * as React from 'react';
import Game from '../../../src/client/src/pages/Game';
import {generateTests} from '../testGen';
const states = require('./Game.states.json');

// TODO - Uncomment this test once Jest works better with esmodules.
// All that should be below this line once the test works is the generateTests() function.
// Currently it is failing on PlaySlot.tsx.
// More info on this issue here: https://github.com/react-dnd/react-dnd/issues/1453

// ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,global,jest){export * from './common';
// ^^^^^^

// SyntaxError: Unexpected token export

// 1 | import * as React from 'react';
// 2 | import {Component} from 'react';
// > 3 | import {ConnectDropTarget, DropTarget} from 'react-dnd';
// | ^
// 4 | import {connect} from 'react-redux';
// 5 | import {bindActionCreators, Dispatch} from 'redux';
// 6 | import {LocalGameData, WhiteCard} from '../../../api/dao';

// generateTests(() => (<Game/>), states);

// Placeholder test - Delete when the test above is fixed.
test('Placeholder', () => {});