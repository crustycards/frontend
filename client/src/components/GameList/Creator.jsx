import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { createGame } from '../../gameServerInterface';
import { connect } from 'react-redux';
import { RaisedButton, TextField, Checkbox, DropDownMenu, MenuItem } from 'material-ui';
import { List, ListItem } from 'material-ui/List';
import { setGameState } from '../../store/modules/game';

class GameCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameName: '',
      maxPlayers: 8,
      cardpacksSelected: []
    };
    this.maxPlayersDropdownItems = [];
    for (let i = 4; i <= 20; i++) {
      this.maxPlayersDropdownItems.push(<MenuItem value={i} key={i} primaryText={i}></MenuItem>);
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
    createGame(this.state.gameName, this.state.maxPlayers, this.state.cardpacksSelected);
  }

  render() {
    return (
      <div>
        <h2>Create Game</h2>
        <div className='content-wrap'>
          <div className='col-narrow center'>
            <TextField
              name='gameName'
              floatingLabelText='Game Name'
              value={this.state.gameName} 
              onChange={this.handleGameNameChange} 
            />
            <br/>
            <span>Max Players</span>
            <DropDownMenu maxHeight={300} value={this.state.maxPlayers} onChange={(event, index, value) => this.setState({maxPlayers: value})}>
              {this.maxPlayersDropdownItems}
            </DropDownMenu>
          </div>
          <div className='col-wide'>
            <div className='subpanel'>
              <h3>Cardpacks</h3>
              <List>
                {this.props.cardpacks.map(c => (
                  <ListItem
                    key={c.id}
                    leftCheckbox={<Checkbox
                      checked={this.state.cardpacksSelected.includes(c.id)}
                      onCheck={this.handleSelectChange.bind(this, c.id)}
                    />}
                    primaryText={c.name}
                  />
                ))}
              </List>
            </div>
          </div>
        </div>
        <div className='center'>
          <RaisedButton type='submit' label='Submit' onClick={this.handleSubmit} />
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