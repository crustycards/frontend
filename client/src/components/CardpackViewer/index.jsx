import React, { Component } from 'react';
import api from '../../apiInterface';
import { connect } from 'react-redux';
import { FlatButton, LinearProgress } from 'material-ui';
import { GridList, GridTile } from 'material-ui/GridList';
import CardAdder from './CardAdder.jsx';
import CAHCard from '../CAHCard.jsx';
import fileSelect from 'file-select';
import cardpackFileHandler from '../../helpers/cardpackFileHandler';

class CardpackViewer extends Component {
  constructor (props) {
    super(props);
    this.numCardsOnTab = 20;
    this.cardpackId = this.props.cardpackId;
    this.addCards = this.addCards.bind(this);
    this.downloadStringifiedCards = this.downloadStringifiedCards.bind(this);
    this.uploadStringifiedCards = this.uploadStringifiedCards.bind(this);
    this.nextTab = this.nextTab.bind(this);
    this.previousTab = this.previousTab.bind(this);
    this.state = {
      newCardName: '',
      newCardType: 'white',
      newCardAnswerFields: 1,
      cardpack: undefined,
      tab: 0
    };
    this.fetchCurrentCardpack();
  }

  fetchCurrentCardpack () {
    api.getCardpack(this.cardpackId)
      .then((cardpack) => {
        this.setState({cardpack});
      })
      .catch(() => {
        this.setState({cardpack: null});
      });
  }

  addCards (cards) {
    return api.createCards(this.cardpackId, cards);
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
    };
    // Start file download.
    download(this.state.cardpack.name, cardpackFileHandler.stringify({whiteCards: this.state.cardpack.whiteCards, blackCards: this.state.cardpack.blackCards}));
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

    let isOwner = this.props.currentUser && this.state.cardpack && this.state.cardpack.owner && this.props.currentUser.id === this.state.cardpack.owner.id;
    let cards = [];

    let tabStart = this.state.tab * this.numCardsOnTab;
    let tabEnd = tabStart + this.numCardsOnTab;
    for (let i = tabStart; i < tabEnd; i++) {
      let card = this.state.cards[i];
      if (!card) {
        break;
      }
      cards.push(<GridTile key={i}><CAHCard card={card} isOwner={isOwner} showTime={true} /></GridTile>);
    }

    return (
      <div className='panel'>
        <div>{this.state.cardpack ? <div className='center'>{this.state.cardpack.name}</div> : <LinearProgress/>}</div>
        {isOwner ? <CardAdder addCards={this.addCards} /> : null}
        {this.state.cardpack ?
          <div>
            <FlatButton label={'Download'} onClick={this.downloadStringifiedCards} />
            {isOwner ? <FlatButton label={'Upload'} onClick={this.uploadStringifiedCards} /> : null}
            <div className='center'>
              {this.state.cards.length > this.numCardsOnTab ?
                <div>
                  <FlatButton label={'Previous'} onClick={this.previousTab} disabled={this.state.tab === 0} />
                  <FlatButton label={'Next'} onClick={this.nextTab} disabled={tabEnd >= this.state.cards.length} />
                </div>
                : null}
            </div>
            <GridList children={cards} cols={4} cellHeight='auto' />
          </div>
          : null}
      </div>
    );
  }
}

const mapStateToProps = ({global}) => ({
  currentUser: global.currentUser
});

export default connect(mapStateToProps)(CardpackViewer);