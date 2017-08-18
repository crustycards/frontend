import React from 'react';
import Cardpack from './Cardpack.jsx';
import axios from 'axios';

class CardpackManager extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      newCardpackName: '',
      cardpacks: []
    }
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

  fetchCardpacks () {
    axios.get('/api/cardpacks')
    .then((response) => {
      this.setState({cardpacks: response.data});
    });
  }

  handleNewCardpackNameChange (e) {
    this.setState({newCardpackName: e.target.value});
  }

  createCardpack () {
    axios.post('/api/cardpacks', {
      name: this.state.newCardpackName
    });
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
      <input value={this.state.newCardpackName} type='text' onChange={this.handleNewCardpackNameChange.bind(this)} />
      <button onClick={this.createCardpack}>Create Cardpack</button>
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

export default CardpackManager;