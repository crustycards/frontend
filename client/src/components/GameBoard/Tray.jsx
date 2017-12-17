import React from 'react';
import { connect } from 'react-redux';
import { GridList } from 'material-ui/GridList';
import { bindActionCreators } from 'redux';
import Card from '../CAHCard.jsx';
const style = {
  width: '100%'
};

const Tray = ({hand}) => (
  <div style={style}>
    <GridList
      cols={hand.length}
      cellHeight={200}
      padding={1}
    >
      {hand.map(card =>
        <Card
          key={card.id} 
          card={card} 
          playHandler={() => console.log(card)} 
        />
      )}
    </GridList>
  </div>
);

const mapStateToProps = ({game}) => ({
  hand: game.hand
});

export default connect(mapStateToProps)(Tray);