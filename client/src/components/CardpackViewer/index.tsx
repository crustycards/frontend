import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {Button, LinearProgress, CircularProgress, Tab, Tabs} from '@material-ui/core';
import CardAdder from './CardAdder';
import CAHWhiteCard from '../shells/CAHWhiteCard';
import CAHBlackCard from '../shells/CAHBlackCard';
import {stringify, parse} from '../../helpers/cardpackFileHandler';
import TabbedList from '../TabbedList';
import SwipeableViews from 'react-swipeable-views';
import {upload, convertToText} from '../../helpers/fileUpload';
import {ApiContextWrapper} from '../../api/context';
import {Cardpack, User, JsonBlackCard, JsonWhiteCard} from '../../api/dao';
import Api from '../../api/model/api';

interface CardpackViewerProps {
  api: Api
  cardpackId: string
  user: User
}

interface CardpackViewerState {
  newCardName: string
  newCardType: string // TODO - Change to ENUM
  newCardAnswerFields: number
  cardpack: Cardpack,
  slideIndex: number
  isUploading: boolean
}

class CardpackViewer extends Component<CardpackViewerProps, CardpackViewerState> {
  constructor(props: CardpackViewerProps) {
    super(props);
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
    this.props.api.main.getCardpack(this.props.cardpackId)
      .then((cardpack) => {
        this.setState({cardpack});
      })
      .catch(() => {
        this.setState({cardpack: null});
      });
  }

  addWhiteCards(cards: JsonWhiteCard[]) {
    return this.props.api.main.createWhiteCards(this.props.cardpackId, cards).then((createdCards) => {
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

  addBlackCards(cards: JsonBlackCard[]) {
    return this.props.api.main.createBlackCards(this.state.cardpack.id, cards).then((createdCards) => {
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
    const download = (filename: string, text: string) => {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };
    // Start file download.
    download(this.state.cardpack.name, stringify({
      whiteCards: this.state.cardpack.whiteCards,
      blackCards: this.state.cardpack.blackCards
    }));
  }

  async uploadStringifiedCards() {
    const fileTexts = await upload({type: 'text/*', multiple: true}).then(convertToText);

    if (fileTexts) {
      const {whiteCards, blackCards} = fileTexts.map((file) => file.text).reduce((acc, text) => {
        const {whiteCards, blackCards} = parse(text);
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

  handleTabChange(_: any, value: number) {
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
                onChangeIndex={this.handleTabChange}
                index={this.state.slideIndex}
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

const ContextLinkedCardpackViewer = ApiContextWrapper(CardpackViewer);

const mapStateToProps = ({global: {user}}: any) => ({user});

export default connect(mapStateToProps)(ContextLinkedCardpackViewer);
