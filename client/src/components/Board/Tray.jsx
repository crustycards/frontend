import React from 'react';
import {connect} from 'react-redux';
import {GridList, GridTile} from 'material-ui/GridList';
import {playCard} from '../../store/modules/game';
import { bindActionCreators } from 'redux';
import Card from '../COHCard.jsx';

const Tray = ({hand, playCard}) => (
  <div> 
    <h4>Tray</h4>
    <GridList
      cols={4}
      cellHeight={200}
      padding={1}
    > 
      {hand.map(card => <Card 
        key={card.id} 
        card={card} 
        playHandler={() => playCard(card)} 
      />)}
    </GridList>
  </div>
);

const mapStateToProps = ({game}) => ({
  hand: game.hand
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  playCard
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Tray);