import React from 'react';
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
    console.log('Creating cardpack...');
    axios.post('/api/cardpacks', {
      name: this.state.newCardpackName
    })
    .then((res) => {
      if (!res.data.error) {
        this.setState({cardpacks: [...this.state.cardpacks, res.data]});
      }
    });
  }

  render () {
    return (
    <div className='panel'>
      <div>Cardpack Manager</div>
      <input value={this.state.newCardpackName} type='text' onChange={this.handleNewCardpackNameChange.bind(this)} />
      <button onClick={this.createCardpack}>Create Cardpack</button>
      {this.state.cardpacks.map((cardpack, index) => {
        return <div key={index}>{cardpack.name}</div>
      })}
    </div>
    );
  }
}

export default CardpackManager;