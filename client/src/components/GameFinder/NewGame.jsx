import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { fetchCardPacks } from '../../store/modules/cardpacks';
import { connect } from 'react-redux';
import { RaisedButton, TextField, Checkbox } from 'material-ui';
import axios from 'axios';

class NewGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameName: '',
      selectedValue: 1,
      cardpacksSelected: []
    };
    this.handleGameNameChange = this.handleGameNameChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentWillMount() {
    this.props.fetchCardPacks();
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
    })
      .then(console.log)
      .catch(console.error);
  }

  render() {
    const styles = {
      block: {
        maxWidth: 250,
      },
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

const mapStateToProps = ({cardpacks}) => ({
  cardpacks: cardpacks.cardpacks
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCardPacks  
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NewGame);