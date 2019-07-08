import {Button} from '@material-ui/core';
import * as React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import {ApiContextWrapper} from '../../api/context';
import {GameData, User} from '../../api/dao';
import Api from '../../api/model/api';
import WhiteCard from '../shells/CAHWhiteCard';

interface PlayedCardsProps {
  api: Api;
  game: GameData;
  user: User;
}

interface PlayedCardsState {
  selectedSetIndex?: number;
}

class PlayedCards extends Component<PlayedCardsProps, PlayedCardsState> {
  constructor(props: PlayedCardsProps) {
    super(props);

    this.state = {
      selectedSetIndex: null
    };
  }

  public render() {
    if (this.props.game.stage === 'judgePhase') {
      return (
        <div className={'panel'}>
          {this.props.user.id === this.props.game.judgeId &&
            <Button
              variant={'contained'}
              color={'secondary'}
              disabled={this.state.selectedSetIndex === null}
              onClick={() => {
                this.props.api.game.vote(
                  this.props.game.whitePlayedAnonymous[this.state.selectedSetIndex][0].id
                );
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
                if (this.props.user.id === this.props.game.judgeId) {
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
      const winnerIsRealUser = !!this.props.game.winner.user;
      return (
        <div className={'panel'}>
          {this.props.game.whitePlayed.map((entry, index) => (
            <div
              style={(this.props.game.winner && winnerIsRealUser ?
                this.props.game.winner.user.id === entry.playerId.userId :
                this.props.game.winner.artificialPlayerName === entry.playerId.artificialPlayerUUID)
                ? {} : {opacity: 0.5}}
              className={'subpanel'}
              key={index}
            >
              <div>
                {
                  this.props.game.players.find((player) => player.id === entry.playerId.userId) ?
                    this.props.game.players.find((player) => player.id === entry.playerId.userId).name
                    :
                    entry.playerId.artificialPlayerUUID ? entry.playerId.artificialPlayerUUID :
                    'This user has left the game'
                }
              </div>
              {entry.cards.map((card, index) => (
                <WhiteCard
                  card={card}
                  key={index}
                />
              ))}
            </div>
          ))}
        </div>
      );
    } else {
      return null;
    }
  }
}

const ContextLinkedPlayedCards = ApiContextWrapper(PlayedCards);

const mapStateToProps = ({game, global: {user}}: any) => ({game, user});

export default connect(mapStateToProps)(ContextLinkedPlayedCards);
