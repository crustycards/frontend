import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { createGame } from '../../gameServerInterface';
import { connect } from 'react-redux';
import { Button, TextField, Checkbox, Select, MenuItem, List, ListItem, ListItemText } from '@material-ui/core';
import { setGameState } from '../../store/modules/game';

class GameCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameName: '',
      maxPlayers: 8,
      maxScore: 8,
      cardpacksSelected: []
    };
    this.maxPlayersDropdownItems = [];
    for (let i = 4; i <= 20; i++) {
      this.maxPlayersDropdownItems.push(<MenuItem value={i} key={i}>{i}</MenuItem>);
    }

    this.maxScoreDropdownItems = [];
    for (let i = 4; i <= 20; i++) {
      this.maxScoreDropdownItems.push(<MenuItem value={i} key={i}>{i}</MenuItem>);
    }

    this.handleGameNameChange = this.handleGameNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleGameNameChange(e) {
    this.setState({gameName: e.target.value});
  }

  handleSelectChange(id) {
    if (this.state.cardpacksSelected.includes(id)) {
      this.setState({cardpacksSelected: this.state.cardpacksSelected.filter(cId => cId !== id)});
    } else {
      this.setState({cardpacksSelected: [...this.state.cardpacksSelected, id]});
    }
  }

  handleSubmit() {
    createGame(this.state.gameName, this.state.maxPlayers, this.state.maxScore, this.state.cardpacksSelected);
  }

  render() {
    return (
      <div>
        <h2>Create Game</h2>
        <div className='content-wrap'>
          <div className='col-narrow center'>
            <TextField
              name='gameName'
              label='Game Name'
              value={this.state.gameName} 
              onChange={this.handleGameNameChange} 
            />
            <br/>
            <span>Max Players: </span>
            <Select value={this.state.maxPlayers} onChange={(e) => this.setState({maxPlayers: e.target.value})}>
              {this.maxPlayersDropdownItems}
            </Select>
            <br/>
            <span>Winning Score: </span>
            <Select value={this.state.maxScore} onChange={(e) => this.setState({maxScore: e.target.value})}>
              {this.maxScoreDropdownItems}
            </Select>
          </div>
          <div className='col-wide'>
            <div className='subpanel'>
              <h3>Cardpacks</h3>
              <List>
                {this.props.cardpacks.map(c => (
                  <ListItem
                    key={c.id}
                  >
                    <Checkbox
                      checked={this.state.cardpacksSelected.includes(c.id)}
                      onChange={this.handleSelectChange.bind(this, c.id)}
                    />
                    <ListItemText primary={c.name} />
                  </ListItem>
                ))}
              </List>
            </div>
          </div>
        </div>
        <div className='center'>
          <Button type='submit' onClick={this.handleSubmit}>Submit</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({user}) => ({
  cardpacks: user.cardpacks
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setGameState
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GameCreator);