import * as React from 'react';
import TabbedList from './TabbedList';
import {shallow, mount} from 'enzyme';
import {GridListTile} from '@material-ui/core';

const generateListElements = (size: number) => {
  const elems = [];
  for (let i = 0; i < size; i++) {
    elems.push(<div>{`Element ${i + 1}`}</div>);
  }
  return elems;
};

it('matches snapshot of single page of elements', () => {
  const wrapper = shallow(<TabbedList>{generateListElements(4)}</TabbedList>);

  expect(wrapper).toMatchSnapshot();
});

it('renders correct number of elements', () => {
  const wrapper = mount(<TabbedList>{generateListElements(4)}</TabbedList>);

  expect(wrapper.find(GridListTile).length).toEqual(4);
});

it('renders no more than 20 elements at once', () => {
  const wrapper = mount(<TabbedList>{generateListElements(22)}</TabbedList>);

  expect(wrapper.find(GridListTile).length).toEqual(20);
  expect(wrapper.find(GridListTile).first().text()).toEqual('Element 1');
  expect(wrapper.find(GridListTile).last().text()).toEqual('Element 20');
});

it('can switch tabs', () => {
  const wrapper = mount(<TabbedList>{generateListElements(22)}</TabbedList>);

  wrapper.find('.next-tab').first().simulate('click');

  expect(wrapper.find(GridListTile).length).toEqual(2);
  expect(wrapper.find(GridListTile).first().text()).toEqual('Element 21');
  expect(wrapper.find(GridListTile).last().text()).toEqual('Element 22');

  wrapper.find('.previous-tab').first().simulate('click');

  expect(wrapper.find(GridListTile).length).toEqual(20);
  expect(wrapper.find(GridListTile).first().text()).toEqual('Element 1');
  expect(wrapper.find(GridListTile).last().text()).toEqual('Element 20');
});