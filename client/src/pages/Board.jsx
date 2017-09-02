import React, { Component } from 'react';
import Navbar from '../components/Navbar.jsx';
import {connect} from 'react-redux';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    height: 450,
    overflowY: 'auto',
  },
};

const Board = ({blackCard, whiteCards, gameName, players}) => (
  <div>
    <Navbar/>
    <div style={styles.root}>
      <GridList
        cols={2}
        cellHeight={200}
        padding={1}
        style={styles.gridList}
      > 
        {([blackCard].concat(whiteCards))
          .filter(card => !!card)
          .map(card => (
            <GridTile
              key={card.id}
              title={card.text}
              actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
              actionPosition="left"
              titlePosition="top"
              titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
            >
            </GridTile>
          ))}
      </GridList>
    </div>
  </div>
);


const mapStateToProps = ({game}) => (
  {
    blackCard: game.blackCard,
    whiteCards: game.cards,
    gameName: game.gameName,
    players: game.players 
  }
);

export default connect(mapStateToProps)(Board);
