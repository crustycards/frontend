import React, { Component } from 'react';
import api from '../../apiInterface';
import { connect } from 'react-redux';
import { TextField, RaisedButton } from 'material-ui';
import Cardpack from './Cardpack.jsx';

class CardpackManager extends Component {
  constructor (props) {
    super(props);
    this.state = {
      newCardpackName: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.createCardpack = this.createCardpack.bind(this);
  }

  componentDidMount () {
    this.intervalId = setInterval(this.forceUpdate.bind(this), 1000); // Refreshes the 'created at' relative time of all cardpacks
  }

  componentWillUnmount () {
    clearInterval(this.intervalId);
  }

  handleInputChange (property, e) {
    let stateChange = {};
    stateChange[property] = e.target.value;
    this.setState(stateChange);
  }
  
  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.createCardpack();
    }
  }

  createCardpack () {
    if (this.state.newCardpackName) {
      api.put('/cardpack', {
        name: this.state.newCardpackName,
        userId: this.props.currentUser.id
      });
      this.setState({newCardpackName: ''});
    }
  }

  render () {
    return (
      <div className='panel'>
        <div>Cardpack Manager</div>
        <TextField onKeyPress={this.handleKeyPress} floatingLabelText='Cardpack Name' type='text' value={this.state.newCardpackName} onChange={this.handleInputChange.bind(this, 'newCardpackName')} /><br/>
        <RaisedButton label='Create Cardpack' onClick={this.createCardpack} disabled={!this.state.newCardpackName} />
        {this.props.cardpacks.map((cardpack, index) => {
          return (
            <div key={index}>
              <Cardpack cardpack={cardpack} />
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = ({global}) => ({
  currentUser: global.currentUser,
  cardpacks: global.cardpacks
});

export default connect(mapStateToProps)(CardpackManager);