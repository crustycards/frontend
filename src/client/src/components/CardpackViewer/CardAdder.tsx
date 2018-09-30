import * as React from 'react';
import {Component} from 'react';
import {FormControl, InputLabel, TextField, Select, Button, MenuItem} from '@material-ui/core';

interface GenericCardData {
  text: string
  answerFields: number
  type: string
}

interface CardAdderProps {
  type: string
  addCard(cardData: GenericCardData): void
}

interface CardAdderState {
  newCardName: string
  newCardAnswerFields: number
}

class CardAdder extends Component<CardAdderProps, CardAdderState> {
  constructor(props: CardAdderProps) {
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

  handleKeyPress(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter') {
      this.addCurrentCard();
    }
  }

  handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({newCardName: e.target.value});
  }

  changeAnswerField(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({newCardAnswerFields: parseInt(e.target.value)});
  }

  addCurrentCard() {
    if (this.state.newCardName) {
      this.props.addCard({
        text: this.state.newCardName,
        answerFields: this.state.newCardAnswerFields,
        type: this.props.type
      });
      this.setState({newCardName: ''});
    }
  }

  render() {
    return (
      <div>
        <div className='col-narrow'>
          <TextField
            onKeyPress={this.handleKeyPress}
            label='Name'
            type='text'
            value={this.state.newCardName}
            onChange={this.handleInputChange}
          />
          <Button
            disabled={!this.state.newCardName}
            className={'btn'}
            onClick={this.addCurrentCard}
          >
            Create Card
          </Button>
        </div>
        <div className='col-wide'>
          {this.props.type === 'black' &&
            <FormControl>
              <InputLabel style={{minWidth: '120px'}}>Answer Fields</InputLabel>
              <Select
                value={this.state.newCardAnswerFields}
                onChange={this.changeAnswerField}
              >
                <MenuItem value={1}>One</MenuItem>
                <MenuItem value={2}>Two</MenuItem>
                <MenuItem value={3}>Three</MenuItem>
              </Select>
            </FormControl>}
        </div>
      </div>
    );
  }
}

export default CardAdder;