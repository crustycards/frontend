import React, {Component} from 'react';
import {connect} from 'react-redux';
import WhiteCard from '../shells/CAHWhiteCard.jsx';
import {vote} from '../../gameServerInterface';
import {Button} from '@material-ui/core';

class PlayedCards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSetIndex: null
    };
  }

  render() {
    if (this.props.game.stage === 'judgePhase') {
      return (
        <div className={'panel'}>
          {this.props.currentUser.id === this.props.game.judgeId &&
            <Button
              variant={'contained'}
              color={'secondary'}
              disabled={this.state.selectedSetIndex === null}
              onClick={() => {
                vote(this.props.game.whitePlayedAnonymous[this.state.selectedSetIndex][0].id);
                this.setState({selectedSetIndex: null});
              }}
            >
              Vote
            </Button>
          }
          {this.props.game.whitePlayedAnonymous.map((cards, index) => (
            <div
              className={'subpanel'}
              key={index}
              onClick={() => {
                if (this.props.currentUser.id === this.props.game.judgeId) {
                  this.setState({selectedSetIndex: index});
                }
              }}
              style={index === this.state.selectedSetIndex ?
                {
                  background: 'green',
                  transition: 'background .25s ease'
                }
                :
                {
                  transition: 'background .2s ease'
                }
              }
            >
              {cards.map((card, index) => <WhiteCard card={card} key={index} />)}
            </div>
          ))}
        </div>
      );
    } else if (
      this.props.game.stage === 'roundEndPhase' ||
      (
        this.props.game.stage === 'notRunning' &&
        this.props.game.winner
      )
    ) {
      return (
        <div className={'panel'}>
          {Object.keys(this.props.game.whitePlayed).map((userId, index) => (
            <div
              style={this.props.game.winner.id === userId ? {} : {opacity: 0.5}}
              className={'subpanel'}
              key={index}
            >
              <div>
                {
                  this.props.game.players.find((player) => player.id === userId) ?
                    this.props.game.players.find((player) => player.id === userId).name
                    :
                    'This user has left the game'
                }
              </div>
              {this.props.game.whitePlayed[userId].map((card, index) => <WhiteCard card={card} key={index} />)}
            </div>
          ))}
        </div>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = ({game, user: {currentUser}}) => ({game, currentUser});

export default connect(mapStateToProps)(PlayedCards);
