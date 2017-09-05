import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { fetchCardPacks } from '../../store/modules/cardpacks';
import { connect } from 'react-redux';
import axios from 'axios';

class NewGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameName: '',
      selectedValue: 1,
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

  handleSelectChange(c) {
    this.setState({selectedValue: c.id}, () => console.log(this.state.selectedValue));
  }

  handleSubmit(e) {
    console.log(this.state.selectedValue);
    axios.post('/api/games', {
      gameName: this.state.gameName,
      cardPackIds: [this.state.selectedValue]
    })
      .then(console.log)
      .catch(console.error);
  }

  render() {
    return (
      <div>
        <div>
          <label>
          GameName:
            <textarea 
              value={this.state.gameName} 
              onChange={this.handleGameNameChange} 
            />
          </label>
          <select> 
            {this.props.cardpacks.map(c => <option key={c.id} onClick={() => this.handleSelectChange(c)} value={c.id}>{c.name}</option>)}
          </select>
          <input type="submit" value="Submit" onClick={this.handleSubmit} />
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