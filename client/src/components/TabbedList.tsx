import * as React from 'react';
import {Component} from 'react';
import {Button, GridList, GridListTile, withStyles} from '@material-ui/core';

const StyledGridListTile = withStyles({tile: {height: 'auto'}})((props: any) => (<GridListTile {...props}/>));

interface TabbedListProps {
  itemsPerTab?: number
  columns?: number
  children: JSX.Element[]
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
    if (this.canGoToNextPage()) {
      this.setState({tab: this.state.tab + 1});
    }
  }

  previousTab() {
    if (this.canGoToPreviousPage()) {
      this.setState({tab: this.state.tab - 1});
    }
  }

  getTabRange() {
    const tabStart = this.state.tab * this.state.itemsPerTab;
    const tabEnd = tabStart + this.state.itemsPerTab;
    return {
      tabStart,
      tabEnd
    };
  }

  canGoToNextPage() {
    const {tabEnd} = this.getTabRange();
    return tabEnd < this.props.children.length;
  }

  canGoToPreviousPage() {
    return this.state.tab > 0;
  }

  render() {
    const visibleElements = [];

    const {tabStart, tabEnd} = this.getTabRange();
    // TODO - Convert for loop to map
    for (let i = tabStart; i < tabEnd; i++) {
      if (!this.props.children[i]) {
        break;
      }
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
                className={'previous-tab'}
                onClick={this.previousTab}
                disabled={!this.canGoToPreviousPage()}
              >
                Previous
              </Button>
              <Button
                className={'next-tab'}
                onClick={this.nextTab}
                disabled={!this.canGoToNextPage()}
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
