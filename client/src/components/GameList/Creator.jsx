import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RaisedButton, TextField, Checkbox } from 'material-ui';
import axios from 'axios';

class GameCreator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameName: '',
      cardpacksSelected: []
    };
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

  handleSubmit(e) {
    axios.post('/api/games', {
      gameName: this.state.gameName,
      cardpackIds: this.state.cardpacksSelected
    });
  }

  render() {
    const styles = {
      checkbox: {
        marginBottom: 16,
      }
    };
    return (
      <div>
        <div>
          <TextField
            name='gameName'
            floatingLabelText='Game Name'
            value={this.state.gameName} 
            onChange={this.handleGameNameChange} 
          />
          {this.props.cardpacks.map(c => (
            <Checkbox
              key={c.id}
              label={c.name}
              checked={this.state.cardpacksSelected.includes(c.id)}
              onCheck={this.handleSelectChange.bind(this, c.id)}
              style={styles.checkbox}
            />
          ))}
          <RaisedButton type="submit" label="Submit" onClick={this.handleSubmit} />
        </div> 
      </div>
    );
  }
}

const mapStateToProps = ({global}) => ({
  cardpacks: global.cardpacks
});

export default connect(mapStateToProps)(GameCreator);