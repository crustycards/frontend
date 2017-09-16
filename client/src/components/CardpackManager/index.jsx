import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { TextField, RaisedButton } from 'material-ui';
import Cardpack from './Cardpack.jsx';

class CardpackManager extends Component {
  constructor (props) {
    super(props);
    this.state = {
      newCardpackName: '',
      cardpacks: []
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.createCardpack = this.createCardpack.bind(this);
    this.createCardpack = this.createCardpack.bind(this);
    this.fetchCardpacks();

    props.socket.on('cardpackcreate', (data) => {
      let cardpack = JSON.parse(data);
      this.addCardpack(cardpack);
    });
    props.socket.on('cardpackdelete', (data) => {
      let cardpackId = JSON.parse(data).id;
      this.removeCardpack(cardpackId);
    });
  }

  componentDidMount () {
    this.intervalId = setInterval(this.forceUpdate.bind(this), 1000); // Refreshes the 'created at' relative time of all cardpacks
  }

  componentWillUnmount () {
    clearInterval(this.intervalId);
  }

  fetchCardpacks () {
    axios.get('/api/cardpacks')
    .then((response) => {
      this.setState({cardpacks: response.data});
    });
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
      axios.post('/api/cardpacks', {
        name: this.state.newCardpackName
      });
      this.setState({newCardpackName: ''});
    }
  }

  addCardpack(cardpack) {
    this.setState({cardpacks: [...this.state.cardpacks, cardpack]});
  }
  removeCardpack (id) {
    this.setState({cardpacks: this.state.cardpacks.filter((cardpack) => {
      return cardpack.id !== id;
    })});
  }

  render () {
    return (
    <div className='panel'>
      <div>Cardpack Manager</div>
      <TextField onKeyPress={this.handleKeyPress} floatingLabelText='Cardpack Name' type='text' value={this.state.newCardpackName} onChange={this.handleInputChange.bind(this, 'newCardpackName')} /><br/>
      <RaisedButton label='Create Cardpack' onClick={this.createCardpack} disabled={!this.state.newCardpackName} />
      {this.state.cardpacks.map((cardpack, index) => {
        return (
          <div key={index}>
            <Cardpack cardpack={cardpack} />
          </div>
        )
      })}
    </div>
    );
  }
}

const mapStateToProps = ({global}) => ({
  socket: global.socket
});

export default connect(mapStateToProps)(CardpackManager);