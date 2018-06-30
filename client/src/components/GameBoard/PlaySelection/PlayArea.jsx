import React from 'react'
import { connect } from 'react-redux'
import PlaySlot from './PlaySlot.jsx'

const PlayArea = ({currentBlackCard}) => {
  const elems = []
  for (let i = 0; i < currentBlackCard.answerFields; i++) {
    elems.push(<PlaySlot index={i} key={i}/>)
  }
  return <div>{elems}</div>
}

const mapStateToProps = ({game}) => ({
  currentBlackCard: game.currentBlackCard
})

export default connect(mapStateToProps)(PlayArea)
