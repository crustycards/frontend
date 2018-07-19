import React, {Component} from 'react';
import api from '../../api/apiInterface';
import {connect} from 'react-redux';
import {Button, LinearProgress, CircularProgress, Tab, Tabs} from '@material-ui/core';
import CardAdder from './CardAdder.jsx';
import CAHWhiteCard from '../shells/CAHWhiteCard.jsx';
import CAHBlackCard from '../shells/CAHBlackCard.jsx';
import cardpackFileHandler from '../../helpers/cardpackFileHandler';
import TabbedList from '../TabbedList.jsx';
import SwipeableViews from 'react-swipeable-views';
import {upload, convertToText} from '../../helpers/fileUpload';

class CardpackViewer extends Component {
  constructor(props) {
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
      slideIndex: 0,
      isUploading: false
    };
    this.fetchCurrentCardpack();
  }

  fetchCurrentCardpack() {
    api.getCardpack(this.cardpackId)
      .then((cardpack) => {
        this.setState({cardpack});
      })
      .catch(() => {
        this.setState({cardpack: null});
      });
  }

  addWhiteCards(cards) {
    return api.createWhiteCards(this.cardpackId, cards).then((createdCards) => {
      this.setState({
        cardpack: {
          ...this.state.cardpack,
          whiteCards: [
            ...this.state.cardpack.whiteCards,
            ...createdCards
          ]
        }
      });
      return createdCards;
    });
  }

  addBlackCards(cards) {
    return api.createBlackCards(this.cardpackId, cards).then((createdCards) => {
      this.setState({
        cardpack: {
          ...this.state.cardpack,
          blackCards: [
            ...this.state.cardpack.blackCards,
            ...createdCards
          ]
        }
      });
      return createdCards;
    });
  }

  downloadStringifiedCards() {
    let download = (filename, text) => {
      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };
    // Start file download.
    download(this.state.cardpack.name, cardpackFileHandler.stringify({
      whiteCards: this.state.cardpack.whiteCards,
      blackCards: this.state.cardpack.blackCards
    }));
  }

  async uploadStringifiedCards() {
    const fileTexts = await upload({type: 'text/*', multiple: true}).then(convertToText);

    if (fileTexts) {
      const {whiteCards, blackCards} = fileTexts.map((file) => file.text).reduce((acc, text) => {
        const {whiteCards, blackCards} = cardpackFileHandler.parse(text);
        return {
          whiteCards: whiteCards.concat(acc.whiteCards),
          blackCards: blackCards.concat(acc.blackCards)
        };
      }, {whiteCards: [], blackCards: []});

      this.setState({isUploading: true}, () => {
        Promise.all([
          this.addWhiteCards(whiteCards),
          this.addBlackCards(blackCards)
        ]).then(() => this.setState({isUploading: false}));
      });
    }
  }

  handleTabChange(_, value) {
    this.setState({slideIndex: value});
  }

  render() {
    if (this.state.cardpack === null) {
      return (
        <div className='panel'>Cardpack does not exist</div>
      );
    }

    let isOwner = this.props.user &&
      this.state.cardpack &&
      this.state.cardpack.owner &&
      this.props.user.id === this.state.cardpack.owner.id;

    return (
      <div className='panel'>
        {this.state.cardpack ?
          <div>
            <div className='center'>{this.state.cardpack.name}</div>
            {isOwner && <CardAdder
              addCard={(cardData) => {
                cardData.type === 'white' ?
                  this.addWhiteCards([{text: cardData.text}])
                  :
                  this.addBlackCards([
                    {
                      text: cardData.text,
                      answerFields: cardData.answerFields
                    }
                  ]);
              }}
              type={this.state.slideIndex ? 'black' : 'white'}
            />}
            {this.state.cardpack ?
              <div>
                <Button onClick={this.downloadStringifiedCards}>
                  Download
                </Button>
                {
                  isOwner &&
                  <Button disabled={this.state.isUploading} onClick={this.uploadStringifiedCards}>
                    Upload
                  </Button>
                }
              </div>
              : null}
            {this.state.isUploading && <CircularProgress/>}
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
                <TabbedList>
                  {this.state.cardpack.whiteCards.map((card, index) =>
                    <CAHWhiteCard
                      key={index}
                      card={card}
                      isOwner={isOwner}
                      onDelete={(cardId) => this.setState({
                        cardpack: {
                          ...this.state.cardpack,
                          whiteCards: this.state.cardpack.whiteCards.filter(
                            (card) => card.id !== cardId
                          )
                        }
                      })}
                    />
                  )}
                </TabbedList>
                <TabbedList
                  columns={3}
                  itemsPerTab={12}
                >
                  {this.state.cardpack.blackCards.map((card, index) =>
                    <CAHBlackCard
                      key={index}
                      card={card}
                      isOwner={isOwner}
                      onDelete={(cardId) => this.setState({
                        cardpack: {
                          ...this.state.cardpack,
                          blackCards: this.state.cardpack.blackCards.filter(
                            (card) => card.id !== cardId
                          )
                        }
                      })}
                    />
                  )}
                </TabbedList>
              </SwipeableViews>
            </div>
          </div>
          :
          <LinearProgress/>}
      </div>
    );
  }
}

const mapStateToProps = ({global: {user}}) => ({user});

export default connect(mapStateToProps)(CardpackViewer);
