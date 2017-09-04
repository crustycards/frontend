import React from 'react';
import axios from 'axios';
import { FlatButton, LinearProgress } from 'material-ui';
import { GridList, GridTile } from 'material-ui/GridList';
import CardAdder from './CardAdder.jsx';
import COHCard from '../COHCard.jsx';
import fileSelect from 'file-select';
import cardpackFileHandler from '../../helpers/cardpackFileHandler';

class CardpackViewer extends React.Component {
  constructor (props) {
    super(props);
    this.numCardsOnTab = 20;
    this.socket = this.props.socket;
    this.cardpackId = this.props.cardpackId;
    this.addCards = this.addCards.bind(this);
    this.downloadStringifiedCards = this.downloadStringifiedCards.bind(this);
    this.uploadStringifiedCards = this.uploadStringifiedCards.bind(this);
    this.nextTab = this.nextTab.bind(this);
    this.previousTab = this.previousTab.bind(this);
    this.state = {
      currentUser: null,
      cards: [],
      cardsFetched: false,
      newCardName: '',
      newCardType: 'white',
      newCardAnswerFields: 1,
      cardpack: undefined,
      tab: 0
    };
    axios.get('/api/currentuser')
      .then((response) => {
        let currentUser = response.data;
        this.setState({currentUser});
      });
    this.fetchCurrentCardpack();
    this.fetchCards();

    this.socket.on('cardcreate', (cardString) => {
      let cards = JSON.parse(cardString).cards;
      this.renderNewCards(cards);
    });
    this.socket.on('carddelete', (cardString) => {
      let card = JSON.parse(cardString).card;
      this.unrenderOldCard(card);
    });
  }

  renderNewCards (cards) {
    this.setState({cards: [...this.state.cards, ...cards]});
  }
  unrenderOldCard (card) {
    this.setState({cards: this.state.cards.filter((cardCurrent) => {
      return card.id !== cardCurrent.id;
    })});
    // Switches to last tab if the last card on the current tab has been deleted
    if ((this.state.tab * this.numCardsOnTab >= this.state.cards.length) && this.state.tab > 0) {
      this.setState({tab: this.state.tab - 1});
    }
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
          this.setState({cards, cardsFetched: true});
        })
        .catch((error) => {
          this.setState({cardpack: null});
        });
    }
  }

  addCards (cards) {
    return axios.post('/api/cards/' + this.cardpackId, cards);
  }

  downloadStringifiedCards () {
    let download = (filename, text) => {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    // Start file download.
    download(this.state.cardpack.name, cardpackFileHandler.stringify(this.state.cards));
  }
  uploadStringifiedCards () {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      fileSelect({
        accept: 'text/*',
        multiple: false
      })
        .then((textFile) => {
          if (textFile) {
            let reader = new FileReader();
            reader.onload = (result) => {
              let text = result.currentTarget.result;
              this.addCards(cardpackFileHandler.parse(text));
            };
            reader.readAsText(textFile);
          }
        });
    } else {
      alert('Your browser does not support file uploading');
    }
  }

  nextTab () {
    this.setState({tab: this.state.tab + 1});
  }

  previousTab () {
    this.setState({tab: this.state.tab - 1});
  }

  render () {
    if (this.state.cardpack === null) {
      return (
        <div className='panel'>Cardpack does not exist</div>
      );
    }

    let isOwner = this.state.currentUser && this.state.cardpack && this.state.cardpack.owner && this.state.currentUser.id === this.state.cardpack.owner.id;
    let cards = [];

    let tabStart = this.state.tab * this.numCardsOnTab;
    let tabEnd = tabStart + this.numCardsOnTab;
    for (let i = tabStart; i < tabEnd; i++) {
      let card = this.state.cards[i];
      if (!card) {
        break;
      }
      cards.push(<GridTile key={i}><COHCard card={card} isOwner={isOwner} /></GridTile>);
    }

    return (
      <div className='panel'>
        <div>{this.state.cardpack && this.state.cardsFetched ? <div className='center'>{this.state.cardpack.name}</div> : <LinearProgress/>}</div>
        {isOwner && this.state.cardsFetched ? <CardAdder addCards={this.addCards} /> : null}
        {this.state.cardsFetched ?
          <div>
            <FlatButton label={'Download'} onClick={this.downloadStringifiedCards} />
            <FlatButton label={'Upload'} onClick={this.uploadStringifiedCards} />
            <div className='center'>
              <FlatButton label={'Previous'} onClick={this.previousTab} disabled={this.state.tab === 0} />
              <FlatButton label={'Next'} onClick={this.nextTab} disabled={tabEnd >= this.state.cards.length} />
            </div>
            <GridList children={cards} cols={4} cellHeight='auto' />
          </div>
        : null}
      </div>
    );
  }
}

export default CardpackViewer;