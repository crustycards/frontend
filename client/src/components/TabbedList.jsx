import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { GridList, GridTile } from 'material-ui/GridList';

class TabbedList extends Component {
  constructor (props) {
    super(props);
    this.itemsPerTab = props.itemsPerTab || 20;
    this.columns = props.columns || 4;
    this.nextTab = this.nextTab.bind(this);
    this.previousTab = this.previousTab.bind(this);
    this.state = {
      tab: 0
    };
  }

  nextTab () {
    this.setState({tab: this.state.tab + 1});
  }

  previousTab () {
    this.setState({tab: this.state.tab - 1});
  }

  render () {
    const visibleElements = [];

    let tabStart = this.state.tab * this.itemsPerTab;
    let tabEnd = tabStart + this.itemsPerTab;
    for (let i = tabStart; i < tabEnd; i++) {
      visibleElements.push(<GridTile key={i} style={{height: 'auto'}}>{this.props.elements[i]}</GridTile>);
    }

    return (
      <div className='panel'>
        <div className='center'>
          {
            this.props.elements.length > this.itemsPerTab &&
            <div>
              <Button onClick={this.previousTab} disabled={this.state.tab === 0}>Previous</Button>
              <Button onClick={this.nextTab} disabled={tabEnd >= this.props.elements.length}>Next</Button>
              <div>Tab {this.state.tab + 1} of {Math.ceil(this.props.elements.length / this.itemsPerTab)}</div>
            </div>
          }
        </div>
        <GridList children={visibleElements} cols={this.columns} cellHeight='auto' />
      </div>
    );
  }
}

TabbedList.propTypes = {
  itemsPerTab: PropTypes.number,
  columns: PropTypes.number,
  elements: PropTypes.arrayOf(PropTypes.element)
};

export default TabbedList;