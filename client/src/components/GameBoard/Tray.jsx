import React from 'react';
import { connect } from 'react-redux';
import { GridList } from 'material-ui/GridList';
import { playCard } from '../../store/modules/game';
import { bindActionCreators } from 'redux';
import Card from '../COHCard.jsx';
const style = {
  width: '100%'
};

const Tray = ({hand, playCard}) => (
  <div style={style}>
    <GridList
      cols={hand.length}
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

const mapStateToProps = ({global}) => ({
  hand: global.currentGame.hand
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  playCard
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Tray);