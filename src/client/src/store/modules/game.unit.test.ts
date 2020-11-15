import {CustomBlackCard, CustomWhiteCard} from '../../../../../proto-gen-out/api/model_pb';
import {
  BlankWhiteCard,
  GameView,
  PlayableWhiteCard,
  BlackCardInRound
} from '../../../../../proto-gen-out/api/game_service_pb';
import reducer from './game';
import {queueCard, setGameState, unqueueCard} from './game';

const createPlayableWhiteCard = (name: string): PlayableWhiteCard => {
  const playableWhiteCard = new PlayableWhiteCard();
  const customWhiteCard = new CustomWhiteCard();
  customWhiteCard.setName(name);
  customWhiteCard.setText(name);
  playableWhiteCard.setCustomWhiteCard(customWhiteCard);
  return playableWhiteCard;
};

const createPlayableBlankWhiteCard = (name: string): PlayableWhiteCard => {
  const playableWhiteCard = new PlayableWhiteCard();
  const blankWhiteCard = new BlankWhiteCard();
  blankWhiteCard.setId(name);
  blankWhiteCard.setOpenText(name);
  playableWhiteCard.setBlankWhiteCard(blankWhiteCard);
  return playableWhiteCard;
};

const createBlackCardInRound =
(name: string, answerFields: number): BlackCardInRound => {
  const card = new BlackCardInRound();
  const customBlackCard = new CustomBlackCard();
  customBlackCard.setName(name);
  customBlackCard.setText(name);
  customBlackCard.setAnswerFields(answerFields);
  card.setCustomBlackCard(customBlackCard);
  return card;
};

describe('setGameState', () => {
  it('Should remove queued cards that are no longer in the user\'s hand',
  () => {
    // Initialize reducer.
    const gameView = new GameView();
    gameView.setStage(GameView.Stage.PLAY_PHASE);
    gameView.addHand(createPlayableWhiteCard('1'));
    gameView.addHand(createPlayableWhiteCard('2'));
    gameView.addHand(createPlayableWhiteCard('3'));
    gameView.addHand(createPlayableWhiteCard('4'));
    gameView.setCurrentBlackCard(createBlackCardInRound('123', 3));
    let state = reducer(undefined, setGameState(gameView));

    // Removes cards from queue that are no longer in the user's hand.
    state = reducer(state, queueCard({card: createPlayableWhiteCard('1')}));
    state = reducer(state, queueCard({card: createPlayableWhiteCard('2')}));
    state = reducer(state, queueCard({card: createPlayableWhiteCard('3')}));
    expect(state.queuedCardIds).toEqual([
      {cardName: '1', cardType: 1},
      {cardName: '2', cardType: 1},
      {cardName: '3', cardType: 1}
    ]);
    gameView.clearHandList();
    gameView.addHand(createPlayableWhiteCard('3'));
    gameView.addHand(createPlayableWhiteCard('4'));
    gameView.addHand(createPlayableWhiteCard('5'));
    gameView.addHand(createPlayableWhiteCard('6'));
    state = reducer(state, setGameState(gameView));
    expect(state.queuedCardIds).toEqual([
      null,
      null,
      {cardName: '3', cardType: 1}
    ]);
  });

  it('Should clear card queue when game stage changes', () => {
    // Initialize reducer.
    const gameView = new GameView();
    gameView.setStage(GameView.Stage.PLAY_PHASE);
    gameView.addHand(createPlayableWhiteCard('1'));
    gameView.addHand(createPlayableWhiteCard('2'));
    gameView.addHand(createPlayableWhiteCard('3'));
    gameView.addHand(createPlayableWhiteCard('4'));
    gameView.setCurrentBlackCard(createBlackCardInRound('123', 3));
    let state = reducer(undefined, setGameState(gameView));

    // Removes cards from queue when game stage is no longer PLAY_PHASE.
    state = reducer(state, queueCard({card: createPlayableWhiteCard('1')}));
    state = reducer(state, queueCard({card: createPlayableWhiteCard('2')}));
    state = reducer(state, queueCard({card: createPlayableWhiteCard('3')}));
    expect(state.queuedCardIds).toEqual([
      {cardName: '1', cardType: 1},
      {cardName: '2', cardType: 1},
      {cardName: '3', cardType: 1}
    ]);
    gameView.setStage(GameView.Stage.JUDGE_PHASE);
    state = reducer(state, setGameState(gameView));
    expect(state.queuedCardIds).toEqual([]);
  });

  it('Should clear card queue when game no longer has an active black card',
  () => {
    // Initialize reducer.
    const gameView = new GameView();
    gameView.setStage(GameView.Stage.PLAY_PHASE);
    gameView.addHand(createPlayableWhiteCard('1'));
    gameView.addHand(createPlayableWhiteCard('2'));
    gameView.addHand(createPlayableWhiteCard('3'));
    gameView.addHand(createPlayableWhiteCard('4'));
    gameView.setCurrentBlackCard(createBlackCardInRound('123', 3));
    let state = reducer(undefined, setGameState(gameView));

    // Removes cards from queue when game no longer has an active black card.
    state = reducer(state, queueCard({card: createPlayableWhiteCard('1')}));
    state = reducer(state, queueCard({card: createPlayableWhiteCard('2')}));
    state = reducer(state, queueCard({card: createPlayableWhiteCard('3')}));
    expect(state.queuedCardIds).toEqual([
      {cardName: '1', cardType: 1},
      {cardName: '2', cardType: 1},
      {cardName: '3', cardType: 1}
    ]);
    gameView.clearCurrentBlackCard();
    state = reducer(state, setGameState(gameView));
    expect(state.queuedCardIds).toEqual([]);
  });

  it('Should remove queued cards when setting game state to empty value',
  () => {
    // Initialize reducer.
    const gameView = new GameView();
    gameView.setStage(GameView.Stage.PLAY_PHASE);
    gameView.addHand(createPlayableWhiteCard('1'));
    gameView.addHand(createPlayableWhiteCard('2'));
    gameView.addHand(createPlayableWhiteCard('3'));
    gameView.addHand(createPlayableWhiteCard('4'));
    gameView.setCurrentBlackCard(createBlackCardInRound('123', 3));
    let state = reducer(undefined, setGameState(gameView));

    // Card queue is emptied when game state is set to undefined.
    state = reducer(state, queueCard({card: createPlayableWhiteCard('1')}));
    state = reducer(state, queueCard({card: createPlayableWhiteCard('2')}));
    state = reducer(state, queueCard({card: createPlayableWhiteCard('3')}));
    expect(state.queuedCardIds).toEqual([
      {cardName: '1', cardType: 1},
      {cardName: '2', cardType: 1},
      {cardName: '3', cardType: 1}
    ]);
    state = reducer(state, setGameState(undefined));
    expect(state.queuedCardIds).toEqual([]);
  });
});

describe('queueCard', () => {
  it('Should handle empty card', () => {
    // Initialize reducer.
    const gameView = new GameView();
    gameView.setStage(GameView.Stage.PLAY_PHASE);
    gameView.addHand(createPlayableWhiteCard('1'));
    gameView.addHand(createPlayableWhiteCard('2'));
    gameView.addHand(createPlayableWhiteCard('3'));
    gameView.addHand(createPlayableWhiteCard('4'));
    gameView.setCurrentBlackCard(createBlackCardInRound('123', 3));
    let state = reducer(undefined, setGameState(gameView));

    // Queueing an empty card to the next available index has no effect.
    state = reducer(state, queueCard({card: new PlayableWhiteCard()}));
    expect(state.queuedCardIds).toEqual([null, null, null]);

    // Queueing an empty card to a specific index has no effect.
    state = reducer(state, queueCard({
      card: new PlayableWhiteCard(),
      index: 1
    }));
    expect(state.queuedCardIds).toEqual([null, null, null]);

    // Queueing an empty card over an existing card has no effect.
    state = reducer(state, queueCard({
      card: createPlayableWhiteCard('1'),
      index: 0
    }));
    expect(state.queuedCardIds).toEqual([
      {cardName: '1', cardType: 1},
      null,
      null
    ]);
    state = reducer(state, queueCard({
      card: new PlayableWhiteCard(),
      index: 0
    }));
    expect(state.queuedCardIds).toEqual([
      {cardName: '1', cardType: 1},
      null,
      null
    ]);
  });

  it('Should handle queueing outside of bounds', () => {
    // Initialize reducer.
    const gameView = new GameView();
    gameView.setStage(GameView.Stage.PLAY_PHASE);
    gameView.addHand(createPlayableWhiteCard('1'));
    gameView.addHand(createPlayableWhiteCard('2'));
    gameView.addHand(createPlayableWhiteCard('3'));
    gameView.addHand(createPlayableWhiteCard('4'));
    gameView.setCurrentBlackCard(createBlackCardInRound('123', 3));
    let state = reducer(undefined, setGameState(gameView));

    // Queueing a card with an index that's out of bounds has no effect.
    state = reducer(state, queueCard({
      card: createPlayableWhiteCard('1'),
      index: 3
    }));
    expect(state.queuedCardIds).toEqual([null, null, null]);
    state = reducer(state, queueCard({
      card: createPlayableWhiteCard('1'),
      index: -1
    }));
    expect(state.queuedCardIds).toEqual([null, null, null]);
  });

  it('Should queue card', () => {
    // Initialize reducer.
    const gameView = new GameView();
    gameView.setStage(GameView.Stage.PLAY_PHASE);
    gameView.addHand(createPlayableWhiteCard('1'));
    gameView.addHand(createPlayableWhiteCard('2'));
    gameView.addHand(createPlayableWhiteCard('3'));
    gameView.addHand(createPlayableWhiteCard('4'));
    gameView.setCurrentBlackCard(createBlackCardInRound('123', 3));
    let state = reducer(undefined, setGameState(gameView));

    // Can queue card to next available index.
    state = reducer(state, queueCard({card: createPlayableWhiteCard('1')}));
    expect(state.queuedCardIds).toEqual([
      {cardName: '1', cardType: 1},
      null,
      null
    ]);
    state = reducer(state, queueCard({card: createPlayableWhiteCard('2')}));
    expect(state.queuedCardIds).toEqual([
      {cardName: '1', cardType: 1},
      {cardName: '2', cardType: 1},
      null
    ]);

    // Can queue existing card to new empty index.
    state = reducer(state, queueCard({
      card: createPlayableWhiteCard('1'),
      index: 2
    }));
    expect(state.queuedCardIds).toEqual([
      null,
      {cardName: '2', cardType: 1},
      {cardName: '1', cardType: 1}
    ]);

    // Can queue existing card to new filled index to swap with that index.
    state = reducer(state, queueCard({
      card: createPlayableWhiteCard('2'),
      index: 2
    }));
    expect(state.queuedCardIds).toEqual([
      null,
      {cardName: '1', cardType: 1},
      {cardName: '2', cardType: 1}
    ]);

    // Can queue existing card to its current position.
    state = reducer(state, queueCard({
      card: createPlayableWhiteCard('1'),
      index: 1
    }));
    expect(state.queuedCardIds).toEqual([
      null,
      {cardName: '1', cardType: 1},
      {cardName: '2', cardType: 1}
    ]);

    // Can queue new card to filled index to replace that card.
    state = reducer(state, queueCard({
      card: createPlayableWhiteCard('3'),
      index: 2
    }));
    expect(state.queuedCardIds).toEqual([
      null,
      {cardName: '1', cardType: 1},
      {cardName: '3', cardType: 1}
    ]);

    // Can queue new blank card.
    state = reducer(state, queueCard({
      card: createPlayableBlankWhiteCard('4')
    }));
    expect(state.queuedCardIds).toEqual([
      {cardName: '4', cardType: 2},
      {cardName: '1', cardType: 1},
      {cardName: '3', cardType: 1}
    ]);
  });
});

describe('unqueueCard', () => {
  it('Should handle unqueueing non-existent card', () => {
    // Initialize reducer.
    const gameView = new GameView();
    gameView.setStage(GameView.Stage.PLAY_PHASE);
    gameView.addHand(createPlayableWhiteCard('1'));
    gameView.addHand(createPlayableWhiteCard('2'));
    gameView.addHand(createPlayableWhiteCard('3'));
    gameView.addHand(createPlayableWhiteCard('4'));
    gameView.setCurrentBlackCard(createBlackCardInRound('123', 3));
    let state = reducer(undefined, setGameState(gameView));

    // Unqueueing a card that's not in the queue has no effect.
    state = reducer(state, unqueueCard(createPlayableWhiteCard('1')));
    expect(state.queuedCardIds).toEqual([null, null, null]);
  });

  it('Should allow unqueueing cards', () => {
    // Initialize reducer.
    const gameView = new GameView();
    gameView.setStage(GameView.Stage.PLAY_PHASE);
    gameView.addHand(createPlayableWhiteCard('1'));
    gameView.addHand(createPlayableWhiteCard('2'));
    gameView.addHand(createPlayableWhiteCard('3'));
    gameView.addHand(createPlayableWhiteCard('4'));
    gameView.setCurrentBlackCard(createBlackCardInRound('123', 3));
    let state = reducer(undefined, setGameState(gameView));

    // Unqueueing a card that's not in the queue has no effect.
    state = reducer(state, queueCard({card: createPlayableWhiteCard('1')}));
    expect(state.queuedCardIds).toEqual([
      {cardName: '1', cardType: 1},
      null,
      null
    ]);
    state = reducer(state, unqueueCard(createPlayableWhiteCard('1')));
    expect(state.queuedCardIds).toEqual([null, null, null]);
  });
});
