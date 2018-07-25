import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button} from '@material-ui/core';
import {GridList, GridListTile, withStyles} from '@material-ui/core';

const StyledGridListTile = withStyles({
  tile: {
    height: 'auto'
  }
})((props) => (<GridListTile {...props}/>));

class TabbedList extends Component {
  constructor(props) {
    super(props);
    this.itemsPerTab = props.itemsPerTab || 20;
    this.columns = props.columns || 4;
    this.nextTab = this.nextTab.bind(this);
    this.previousTab = this.previousTab.bind(this);
    this.state = {
      tab: 0
    };
  }

  nextTab() {
    this.setState({tab: this.state.tab + 1});
  }

  previousTab() {
    this.setState({tab: this.state.tab - 1});
  }

  render() {
    const visibleElements = [];

    let tabStart = this.state.tab * this.itemsPerTab;
    let tabEnd = tabStart + this.itemsPerTab;
    // TODO - Convert for loop to map
    for (let i = tabStart; i < tabEnd; i++) {
      visibleElements.push(
        <StyledGridListTile
          key={i}
        >
          {this.props.children[i]}
        </StyledGridListTile>
      );
    }

    return (
      <div className='panel'>
        <div className='center'>
          {
            this.props.children.length > this.itemsPerTab &&
            <div>
              <Button
                onClick={this.previousTab}
                disabled={this.state.tab === 0}
              >
                Previous
              </Button>
              <Button
                onClick={this.nextTab}
                disabled={tabEnd >= this.props.children.length}
              >
                Next
              </Button>
              <div>
                Tab {
                  this.state.tab + 1
                } of {
                  Math.ceil(this.props.children.length / this.itemsPerTab)
                }
              </div>
            </div>
          }
        </div>
        <GridList cols={this.columns} cellHeight={'auto'}>
          {visibleElements}
        </GridList>
      </div>
    );
  }
}

TabbedList.propTypes = {
  itemsPerTab: PropTypes.number,
  columns: PropTypes.number
};

export default TabbedList;
