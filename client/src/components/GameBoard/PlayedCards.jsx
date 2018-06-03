import React, { Component } from 'react';
import { connect } from 'react-redux';
import WhiteCard from '../shells/CAHWhiteCard.jsx';
import { vote } from '../../gameServerInterface';
import { RaisedButton } from 'material-ui';

class PlayedCards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSetIndex: null
    };
  }

  render() {
    if (!this.props.game.whitePlayedAnonymous) {
      return null;
    } else {
      return (
        <div className={'panel'}>
          {this.props.currentUser.id === this.props.game.judgeId && <RaisedButton label={'Vote'} disabled={this.state.selectedSetIndex === null} onClick={() => { vote(this.props.game.whitePlayedAnonymous[this.state.selectedSetIndex][0].id); }} />}
          {this.props.game.whitePlayedAnonymous.map((cards, index) => (
            <div
              className={'subpanel'}
              key={index}
              onClick={() => {
                if (this.props.currentUser.id === this.props.game.judgeId) {
                  this.setState({selectedSetIndex: index});
                }
              }}
              style={index === this.state.selectedSetIndex ? {background: 'green', transition: 'background .25s ease'} : {transition: 'background .2s ease'}}
            >
              {cards.map((card, index) => <WhiteCard card={card} key={index} />)}
            </div>
          ))}
        </div>
      );
    }
  }
}

const mapStateToProps = ({game, user: {currentUser}}) => ({game, currentUser});

export default connect(mapStateToProps)(PlayedCards);