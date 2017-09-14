import React from 'react';
import { connect } from 'react-redux';
import { GridList } from 'material-ui/GridList';
import { playCard } from '../../store/modules/game';
import { bindActionCreators } from 'redux';
import Card from '../COHCard.jsx';
const style = {
  width: '100%',
  height: '220px',
  position: 'fixed',
  minHeight: '100px',
  bottom: '0px'
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

export default Tray;

// const mapStateToProps = ({game}) => ({
//   hand: game.hand
// });

// const mapDispatchToProps = (dispatch) => bindActionCreators({
//   playCard
// }, dispatch);

// export default connect(mapStateToProps, mapDispatchToProps)(Tray);