import React, { Component } from 'react';
import Navbar from '../components/Navbar.jsx';
import {connect} from 'react-redux';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import COHCard from '../components/COHCard.jsx';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    overflowY: 'auto',
  },
};

const Board = ({blackCard, whiteCards, gameName, players}) => (
  <div>
    <Navbar/>
    <div style={styles.root}>
      <GridList
        cols={4}
        cellHeight={200}
        padding={1}
        style={styles.gridList}
      > 
        {([blackCard].concat(whiteCards))
          .filter(card => !!card)
          .map((card, i) => (
            <COHCard card={card} key={i} />
          ))}
      </GridList>
    </div>
  </div>
);


const mapStateToProps = ({game}) => (
  {
    blackCard: game.blackCard,
    whiteCards: game.whiteCards,
    gameName: game.gameName,
    players: game.players 
  }
);

export default connect(mapStateToProps)(Board);
