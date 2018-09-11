import * as React from 'react';
import {Component} from 'react';
import {Button, GridList, GridListTile, withStyles} from '@material-ui/core';

const StyledGridListTile = withStyles({tile: {height: 'auto'}})((props) => (<GridListTile {...props}/>));

interface TabbedListProps {
  itemsPerTab?: number
  columns?: number
  children: React.ReactNode[]
}

interface TabbedListState {
  tab: number
  itemsPerTab: number
  columns: number
}

class TabbedList extends Component<TabbedListProps, TabbedListState> {
  constructor(props: TabbedListProps) {
    super(props);
    this.nextTab = this.nextTab.bind(this);
    this.previousTab = this.previousTab.bind(this);
    this.state = {
      tab: 0,
      itemsPerTab: props.itemsPerTab || 20,
      columns: props.columns || 4
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

    let tabStart = this.state.tab * this.state.itemsPerTab;
    let tabEnd = tabStart + this.state.itemsPerTab;
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
            this.props.children.length > this.state.itemsPerTab &&
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
                  Math.ceil(this.props.children.length / this.state.itemsPerTab)
                }
              </div>
            </div>
          }
        </div>
        <GridList cols={this.state.columns} cellHeight={'auto'}>
          {visibleElements}
        </GridList>
      </div>
    );
  }
}

export default TabbedList;