import React from 'react';
import axios from 'axios';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';

class CardpackViewer extends React.Component {
  constructor (props) {
    super(props);
    this.socket = this.props.socket;
    this.cardpackId = this.props.cardpackId;
    this.addCard = this.addCard.bind(this);
    this.handleNewSelect = this.handleNewSelect.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.state = {
      currentUser: null,
      cards: [],
      newCardName: '',
      newCardType: 'white',
      cardpack: undefined
    };
    axios.get('/api/currentuser')
    .then((response) => {
      let currentUser = response.data;
      this.setState({currentUser});
    });
    this.fetchCurrentCardpack();
    this.fetchCards();

    this.socket.on('cardcreate', (cardString) => {
      let card = JSON.parse(cardString).card;
      this.renderNewCard(card);
    });
    this.socket.on('carddelete', (cardString) => {
      let card = JSON.parse(cardString).card;
      this.unrenderOldCard(card);
    });
  }

  handleNewSelect (e, index, newCardType) {
    this.setState({newCardType});
  }
  handleInputChange (property, e) {
    let stateChange = {};
    stateChange[property] = e.target.value;
    this.setState(stateChange);
  }
  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.addCard();
    }
  }

  renderNewCard (card) {
    this.setState({cards: [...this.state.cards, card]});
  }
  unrenderOldCard (card) {
    this.setState({cards: this.state.cards.filter((cardCurrent) => {
      return card.id !== cardCurrent.id;
    })});
  }

  fetchCurrentCardpack () {
    axios.get('/api/cardpacks/' + this.cardpackId)
    .then((response) => {
      let cardpack = response.data;
      this.setState({cardpack});
    })
    .catch(() => {
      this.setState({cardpack: null});
    });
  }
  fetchCards () {
    if (this.cardpackId) {
      axios.get('/api/cards/' + this.cardpackId)
      .then((response) => {
        let cards = response.data;
        this.setState({cards});
      })
      .catch((error) => {
        this.setState({cardpack: null});
      });
    }
  }

  addCard () {
    if (this.state.newCardName) {
      axios.post('/api/cards/' + this.cardpackId, {
        cardText: this.state.newCardName,
        cardType: this.state.newCardType
      });
      this.setState({newCardName: ''});
    }
  }
  removeCard (card) {
    axios.delete('/api/cards/' + card.id);
  }

  render () {
    const styles = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      },
      gridList: {
        width: 'auto',
        height: 500,
        overflowY: 'auto'
      }
    };

    if (this.state.cardpack === null) {
      return (
        <div className='panel'>Cardpack does not exist</div>
      );
    }

    let isOwner = this.state.currentUser && this.state.cardpack && this.state.cardpack.owner && this.state.currentUser.id === this.state.cardpack.owner.id;
    let cardAdder;
    if (isOwner) {
      cardAdder = (<div className='panel'>
        <TextField onKeyPress={this.handleKeyPress} floatingLabelText='Name' type='text' value={this.state.newCardName} onChange={this.handleInputChange.bind(this, 'newCardName')} /><br/>
        <DropDownMenu value={this.state.newCardType} onChange={this.handleNewSelect}>
          <MenuItem value={'white'} primaryText='White' />
          <MenuItem value={'black'} primaryText='Black' />
        </DropDownMenu>
        <RaisedButton label='Create Card' disabled={!this.state.newCardName} className='btn' onClick={this.addCard} />
      </div>);
    }
    let cards = [];

    this.state.cards.forEach((card, index) => {
      let cardElements = [];
      cardElements.push(
        <CardHeader
          title={card.text}
          subtitle={card.type}
          key={0}
        />
      );

      if (isOwner) {
        cardElements.push(
          <CardActions key={1}>
            <FlatButton label='Delete' onClick={this.removeCard.bind(this, card)} />
          </CardActions>
        );
      }

      let cardWrapper = card.type === 'black' ? (
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <Card className='card'>;
            {cardElements}
          </Card>
        </MuiThemeProvider>
      ) : (
        <Card className='card'>;
          {cardElements}
        </Card>
      );

      cards.push(<GridTile key={index}>{cardWrapper}</GridTile>);
    });

    return (
      <div className='panel'>
        <div>{this.state.cardpack ? this.state.cardpack.name : 'Loading...'}</div>
        {isOwner ? cardAdder : null}
        <GridList children={cards} cols={4} cellHeight='auto' style={styles.gridList} />
      </div>
    );
  }
}

export default CardpackViewer;