import {GridListTile} from '@material-ui/core';
import {mount, shallow} from 'enzyme';
import * as React from 'react';
import * as renderer from 'react-test-renderer';
import TabbedList from './TabbedList';

const generateListElements = (size: number) => {
  const elems = [];
  for (let i = 0; i < size; i++) {
    elems.push(<div>{`Element ${i + 1}`}</div>);
  }
  return elems;
};

it('matches snapshot of single page of elements', () => {
  const tree = renderer.create(<TabbedList>{generateListElements(4)}</TabbedList>).toJSON();

  expect(tree).toMatchSnapshot();
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

  expect(wrapper.state('tab')).toEqual(1);
  expect(wrapper.find(GridListTile).length).toEqual(2);
  expect(wrapper.find(GridListTile).first().text()).toEqual('Element 21');
  expect(wrapper.find(GridListTile).last().text()).toEqual('Element 22');

  wrapper.find('.previous-tab').first().simulate('click');

  expect(wrapper.state('tab')).toEqual(0);
  expect(wrapper.find(GridListTile).length).toEqual(20);
  expect(wrapper.find(GridListTile).first().text()).toEqual('Element 1');
  expect(wrapper.find(GridListTile).last().text()).toEqual('Element 20');
});

it('cannot go to previous tab if on first tab already', () => {
  const wrapper = shallow(<TabbedList>{generateListElements(22)}</TabbedList>);

  expect(wrapper.state('tab')).toEqual(0);
  expect(wrapper.find('.previous-tab').first().props().disabled).toEqual(true);
  wrapper.find('.previous-tab').first().simulate('click');
  expect(wrapper.state('tab')).toEqual(0);
});

it('cannot go to next tab if on last tab already', () => {
  const wrapper = shallow(<TabbedList>{generateListElements(22)}</TabbedList>);

  expect(wrapper.state('tab')).toEqual(0);
  expect(wrapper.find('.next-tab').first().props().disabled).toEqual(false);

  wrapper.find('.next-tab').first().simulate('click');

  expect(wrapper.state('tab')).toEqual(1);
  expect(wrapper.find('.next-tab').first().props().disabled).toEqual(true);

  wrapper.find('.next-tab').first().simulate('click');

  expect(wrapper.state('tab')).toEqual(1);
  expect(wrapper.find('.next-tab').first().props().disabled).toEqual(true);
});

it('only displays previous and next tab buttons when enough elements are present', () => {
  const wrapperWithoutTabs = shallow(<TabbedList>{generateListElements(20)}</TabbedList>);
  const wrapperWithTabs = shallow(<TabbedList>{generateListElements(21)}</TabbedList>);

  expect(wrapperWithoutTabs.find('.previous-tab').exists()).toEqual(false);
  expect(wrapperWithoutTabs.find('.next-tab').exists()).toEqual(false);

  expect(wrapperWithTabs.find('.previous-tab').exists()).toEqual(true);
  expect(wrapperWithTabs.find('.next-tab').exists()).toEqual(true);
});
