import React, { Component } from 'react';
import api from '../../apiInterface';
import { connect } from 'react-redux';
import { Button, LinearProgress, Tab, Tabs } from '@material-ui/core';
import CardAdder from './CardAdder.jsx';
import CAHWhiteCard from '../shells/CAHWhiteCard.jsx';
import CAHBlackCard from '../shells/CAHBlackCard.jsx';
import fileSelect from 'file-select';
import cardpackFileHandler from '../../helpers/cardpackFileHandler';
import TabbedList from '../TabbedList.jsx';
import SwipeableViews from 'react-swipeable-views';

class CardpackViewer extends Component {
  constructor (props) {
    super(props);
    this.numCardsOnTab = 20;
    this.cardpackId = this.props.cardpackId;
    this.addWhiteCards = this.addWhiteCards.bind(this);
    this.addBlackCards = this.addBlackCards.bind(this);
    this.downloadStringifiedCards = this.downloadStringifiedCards.bind(this);
    this.uploadStringifiedCards = this.uploadStringifiedCards.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.state = {
      newCardName: '',
      newCardType: 'white',
      newCardAnswerFields: 1,
      cardpack: undefined,
      slideIndex: 0
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

  addWhiteCards (cards) {
    return api.createWhiteCards(this.cardpackId, cards).then((createdCards) => {
      this.setState({cardpack: {...this.state.cardpack, whiteCards: [...this.state.cardpack.whiteCards, ...createdCards]}});
      return createdCards;
    });
  }

  addBlackCards (cards) {
    return api.createBlackCards(this.cardpackId, cards).then((createdCards) => {
      this.setState({cardpack: {...this.state.cardpack, blackCards: [...this.state.cardpack.blackCards, ...createdCards]}});
      return createdCards;
    });
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
              const { whiteCards, blackCards } = cardpackFileHandler.parse(text);
              this.addWhiteCards(whiteCards);
              this.addBlackCards(blackCards);
            };
            reader.readAsText(textFile);
          }
        });
    } else {
      alert('Your browser does not support file uploading');
    }
  }

  handleTabChange(_, value) {
    this.setState({slideIndex: value});
  }

  render () {
    if (this.state.cardpack === null) {
      return (
        <div className='panel'>Cardpack does not exist</div>
      );
    }

    let isOwner = this.props.currentUser && this.state.cardpack && this.state.cardpack.owner && this.props.currentUser.id === this.state.cardpack.owner.id;

    return (
      <div className='panel'>
        {this.state.cardpack ?
          <div>
            <div className='center'>{this.state.cardpack.name}</div>
            {isOwner && <CardAdder
              addCard={(cardData) => {
                cardData.type === 'white' ? this.addWhiteCards([{text: cardData.text}]) : this.addBlackCards([{text: cardData.text, answerFields: cardData.answerFields}]);
              }}
              type={!!this.state.slideIndex ? 'black' : 'white'}
            />}
            {this.state.cardpack ?
              <div>
                <Button onClick={this.downloadStringifiedCards}>
                  Download
                </Button>
                {
                  isOwner &&
                  <Button onClick={this.uploadStringifiedCards}>
                    Upload
                  </Button>
                }
              </div>
              : null}
            <div>
              <Tabs
                onChange={this.handleTabChange}
                value={this.state.slideIndex}
              >
                <Tab label='White Cards' />
                <Tab label='Black Cards' />
              </Tabs>
              <SwipeableViews
                index={this.state.slideIndex}
                onChangeIndex={this.handleTabChange}
              >
                <TabbedList elements={this.state.cardpack.whiteCards.map(card => <CAHWhiteCard card={card} isOwner={isOwner} onDelete={(cardId) => this.setState({cardpack: {...this.state.cardpack, whiteCards: this.state.cardpack.whiteCards.filter(card => card.id !== cardId)}})} />)} />
                <TabbedList columns={3} itemsPerTab={12} elements={this.state.cardpack.blackCards.map(card => <CAHBlackCard card={card} isOwner={isOwner} onDelete={(cardId) => this.setState({cardpack: {...this.state.cardpack, blackCards: this.state.cardpack.blackCards.filter(card => card.id !== cardId)}})} />)} />
              </SwipeableViews>
            </div>
          </div>
          :
          <LinearProgress/>}
      </div>
    );
  }
}

const mapStateToProps = ({user}) => ({
  currentUser: user.currentUser
});

export default connect(mapStateToProps)(CardpackViewer);