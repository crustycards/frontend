import React from 'react';
import { connect } from 'react-redux';
import { GridList } from 'material-ui/GridList';
import { bindActionCreators } from 'redux';
import DraggableCard from './DraggableCard.jsx';
import { playCard } from '../../gameServerInterface';

const Tray = ({hand}) => (
  <div className='tray'>
    {hand.map(card =>
      <DraggableCard
        key={card.id}
        card={card}
        playHandler={() => playCard(card.id)}
      />
    )}
  </div>
);

const mapStateToProps = ({game}) => ({
  hand: game.hand
});

export default connect(mapStateToProps)(Tray);