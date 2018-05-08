import React, { Component } from 'react';
import api from '../../apiInterface';
import { connect } from 'react-redux';
import { FlatButton, LinearProgress } from 'material-ui';
import { Tabs, Tab } from 'material-ui/Tabs';
import CardAdder from './CardAdder.jsx';
import CAHCard from '../CAHCard.jsx';
import fileSelect from 'file-select';
import cardpackFileHandler from '../../helpers/cardpackFileHandler';
import TabbedList from '../TabbedList.jsx';
import SwipeableViews from 'react-swipeable-views';

class CardpackViewer extends Component {
  constructor (props) {
    super(props);
    this.numCardsOnTab = 20;
    this.cardpackId = this.props.cardpackId;
    this.addCards = this.addCards.bind(this);
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

  handleTabChange(value) {
    this.setState({slideIndex: value});
  }

  render () {
    if (this.state.cardpack === null) {
      return (
        <div className='panel'>Cardpack does not exist</div>
      );
    }

    let isOwner = this.props.currentUser && this.state.cardpack && this.state.cardpack.owner && this.props.currentUser.id === this.state.cardpack.owner.id;

    // cards.push(<CAHCard card={card} isOwner={isOwner} showTime={true} />);

    return (
      <div className='panel'>
        {this.state.cardpack ?
          <div>
            <div className='center'>{this.state.cardpack.name}</div>
            {isOwner ? <CardAdder addCards={this.addCards} /> : null}
            {this.state.cardpack ?
              <div>
                <FlatButton label={'Download'} onClick={this.downloadStringifiedCards} />
                {isOwner ? <FlatButton label={'Upload'} onClick={this.uploadStringifiedCards} /> : null}
              </div>
              : null}
            <div>
              <Tabs
                onChange={this.handleTabChange}
                value={this.state.slideIndex}
              >
                <Tab label='White Cards' value={0} />
                <Tab label='Black Cards' value={1} />
              </Tabs>
              <SwipeableViews
                index={this.state.slideIndex}
                onChangeIndex={this.handleTabChange}
              >
                <TabbedList elements={this.state.cardpack.whiteCards.map(card => <CAHCard card={card} isOwner={isOwner} showTime={true} />)} />
                <TabbedList elements={this.state.cardpack.blackCards.map(card => <CAHCard card={card} isOwner={isOwner} showTime={true} />)} />
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