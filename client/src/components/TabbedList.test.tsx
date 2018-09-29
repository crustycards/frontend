import * as React from 'react';
import TabbedList from './TabbedList';
import {shallow, mount} from 'enzyme';
import {GridListTile} from '@material-ui/core';

it('matches snapshot of single page of elements', () => {
  const wrapper = shallow(<TabbedList>{[
    <div>Element One</div>,
    <div>Element Two</div>,
    <div>Element Three</div>,
    <div>Element Four</div>
  ]}</TabbedList>);

  expect(wrapper).toMatchSnapshot();
});

it('renders correct number of elements', () => {
  const wrapper = mount(<TabbedList>{[
    <div>Element One</div>,
    <div>Element Two</div>,
    <div>Element Three</div>,
    <div>Element Four</div>
  ]}</TabbedList>);

  expect(wrapper.find(GridListTile).length).toEqual(4);
});

it('renders no more than 20 elements at once', () => {
  const wrapper = mount(<TabbedList>{[
    <div>Element One</div>,
    <div>Element Two</div>,
    <div>Element Three</div>,
    <div>Element Four</div>,
    <div>Element Five</div>,
    <div>Element Six</div>,
    <div>Element Seven</div>,
    <div>Element Eight</div>,
    <div>Element Nine</div>,
    <div>Element Ten</div>,
    <div>Element Eleven</div>,
    <div>Element Twelve</div>,
    <div>Element Thirteen</div>,
    <div>Element Fourteen</div>,
    <div>Element Fifteen</div>,
    <div>Element Sixteen</div>,
    <div>Element Seventeen</div>,
    <div>Element Eighteen</div>,
    <div>Element Nineteen</div>,
    <div>Element Twenty</div>,
    <div>Element Twenty One</div>,
    <div>Element Twenty Two</div>
  ]}</TabbedList>);

  expect(wrapper.find(GridListTile).length).toEqual(20);
});