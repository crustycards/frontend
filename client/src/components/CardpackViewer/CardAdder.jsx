import React, { Component } from 'react';
import { TextField, SelectField, RaisedButton, DropDownMenu, MenuItem } from 'material-ui';

class CardAdder extends Component {
  constructor (props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.changeAnswerField = this.changeAnswerField.bind(this);
    this.addCurrentCard = this.addCurrentCard.bind(this);
    this.state = {
      newCardName: '',
      newCardAnswerFields: 1
    };
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.addCurrentCard();
    }
  }

  handleInputChange (property, e) {
    let stateChange = {};
    stateChange[property] = e.target.value;
    this.setState(stateChange);
  }

  changeAnswerField (event, index, value) {
    this.setState({newCardAnswerFields: value});
  }

  addCurrentCard () {
    if (this.state.newCardName) {
      this.props.addCard({
        text: this.state.newCardName,
        answerFields: this.state.newCardAnswerFields,
        type: this.props.type
      });
      this.setState({newCardName: ''});
    }
  }

  render () {
    return (
      <div>
        <div className='col-narrow'>
          <TextField onKeyPress={this.handleKeyPress} floatingLabelText='Name' type='text' value={this.state.newCardName} onChange={this.handleInputChange.bind(this, 'newCardName')} />
          <RaisedButton label='Create Card' disabled={!this.state.newCardName} className='btn' onClick={this.addCurrentCard} />
        </div>
        <div className='col-wide'>
          {this.props.type === 'black' &&
            <SelectField
              floatingLabelText='Answer Fields'
              value={this.state.newCardAnswerFields}
              onChange={this.changeAnswerField}
            >
              <MenuItem value={1} primaryText='One' />
              <MenuItem value={2} primaryText='Two' />
              <MenuItem value={3} primaryText='Three' />
            </SelectField>}
        </div>
      </div>
    );
  }
}

module.exports = CardAdder;