import {Store} from 'redux';
import {GameConfig} from '../../../../proto-gen-out/api/model_pb';
import {
  AddArtificialPlayerRequest,
  BanUserRequest,
  ChatMessage,
  CreateChatMessageRequest,
  CreateGameRequest,
  GameInfo,
  GameView,
  GetGameViewRequest,
  JoinGameRequest,
  KickUserRequest,
  LeaveGameRequest,
  PlayableWhiteCard,
  PlayCardsRequest,
  RemoveArtificialPlayerRequest,
  SearchGamesRequest,
  SearchGamesResponse,
  StartGameRequest,
  VoteStartNextRoundRequest,
  StopGameRequest,
  UnbanUserRequest,
  UnplayCardsRequest,
  VoteCardRequest
} from '../../../../proto-gen-out/api/game_service_pb';
import {StoreState} from '../store';
import {setGameState} from '../store/modules/game';
import {makeRpcFromBrowser} from '../../../server/rpc';
import {Empty} from 'google-protobuf/google/protobuf/empty_pb';
import {bindAllFunctionsToSelf} from '../helpers/bindAll';

// We're using a class here rather than exporting the raw RPC functions for two
// reasons.
//
// 1. Most game-related RPCs require providing a user in the request to specify
// who is performing the RPC. Providing the user is often annoying and not
// relevant to the context it's being called in, so using a class here allows
// us to provide the user up front when the class is instantiated.
//
// 2. Redux takes an instance of this class and transparently taps into most of
// its methods in order to automatically dispatch an action to update the game
// state when needed.
export class GameService {
  constructor(
    private readonly currentUserName: string,
    private readonly store?: Store<StoreState>) {
    bindAllFunctionsToSelf(this);
  }

  public async searchGames(request: SearchGamesRequest): Promise<GameInfo[]> {
    const response = await makeRpcFromBrowser(
      request,
      'GameService/SearchGames',
      SearchGamesResponse.deserializeBinary
    );
    return response.getGamesList();
  }

  public async createGame(config: GameConfig): Promise<GameView> {
    const request = new CreateGameRequest();
    request.setUserName(this.currentUserName);
    request.setGameConfig(config);
    const gameView = await makeRpcFromBrowser(
      request,
      'GameService/CreateGame',
      GameView.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(gameView));
    }
    return gameView;
  }

  public async startGame(): Promise<GameView> {
    const request = new StartGameRequest();
    request.setUserName(this.currentUserName);
    const gameView = await makeRpcFromBrowser(
      request,
      'GameService/StartGame',
      GameView.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(gameView));
    }
    return gameView;
  }

  public async stopGame(): Promise<GameView> {
    const request = new StopGameRequest();
    request.setUserName(this.currentUserName);
    const gameView = await makeRpcFromBrowser(
      request,
      'GameService/StopGame',
      GameView.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(gameView));
    }
    return gameView;
  }

  public async joinGame(gameId: string): Promise<GameView> {
    const request = new JoinGameRequest();
    request.setUserName(this.currentUserName);
    request.setGameId(gameId);
    const gameView = await makeRpcFromBrowser(
      request,
      'GameService/JoinGame',
      GameView.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(gameView));
    }
    return gameView;
  }

  public async leaveGame(): Promise<void> {
    const request = new LeaveGameRequest();
    request.setUserName(this.currentUserName);
    await makeRpcFromBrowser(
      request,
      'GameService/LeaveGame',
      Empty.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(undefined));
    }
  }

  public async kickUser(trollUserName: string): Promise<GameView> {
    const request = new KickUserRequest();
    request.setUserName(this.currentUserName);
    request.setTrollUserName(trollUserName);
    const gameView = await makeRpcFromBrowser(
      request,
      'GameService/KickUser',
      GameView.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(gameView));
    }
    return gameView;
  }

  public async banUser(trollUserName: string): Promise<GameView> {
    const request = new BanUserRequest();
    request.setUserName(this.currentUserName);
    request.setTrollUserName(trollUserName);
    const gameView = await makeRpcFromBrowser(
      request,
      'GameService/BanUser',
      GameView.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(gameView));
    }
    return gameView;
  }

  public async unbanUser(trollUserName: string): Promise<GameView> {
    const request = new UnbanUserRequest();
    request.setUserName(this.currentUserName);
    request.setTrollUserName(trollUserName);
    const gameView = await makeRpcFromBrowser(
      request,
      'GameService/UnbanUser',
      GameView.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(gameView));
    }
    return gameView;
  }

  public async playCards(cards: PlayableWhiteCard[]): Promise<GameView> {
    const request = new PlayCardsRequest();
    request.setUserName(this.currentUserName);
    request.setCardsList(cards);
    const gameView = await makeRpcFromBrowser(
      request,
      'GameService/PlayCards',
      GameView.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(gameView));
    }
    return gameView;
  }

  public async unplayCards(): Promise<GameView> {
    const request = new UnplayCardsRequest();
    request.setUserName(this.currentUserName);
    const gameView = await makeRpcFromBrowser(
      request,
      'GameService/UnplayCards',
      GameView.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(gameView));
    }
    return gameView;
  }

  public async voteCard(choice: number): Promise<GameView> {
    const request = new VoteCardRequest();
    request.setUserName(this.currentUserName);
    request.setChoice(choice);
    const gameView = await makeRpcFromBrowser(
      request,
      'GameService/VoteCard',
      GameView.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(gameView));
    }
    return gameView;
  }

  public async voteStartNextRound(): Promise<GameView> {
    const request = new VoteStartNextRoundRequest();
    request.setUserName(this.currentUserName);
    const gameView = await makeRpcFromBrowser(
      request,
      'GameService/VoteStartNextRound',
      GameView.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(gameView));
    }
    return gameView;
  }

  public async addArtificialPlayer(displayName?: string): Promise<GameView> {
    const request = new AddArtificialPlayerRequest();
    request.setUserName(this.currentUserName);
    if (displayName !== undefined) {
      request.setDisplayName(displayName);
    }
    const gameView = await makeRpcFromBrowser(
      request,
      'GameService/AddArtificialPlayer',
      GameView.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(gameView));
    }
    return gameView;
  }

  public async removeArtificialPlayer(artificialPlayerName?: string):
  Promise<GameView> {
    const request = new RemoveArtificialPlayerRequest();
    request.setUserName(this.currentUserName);
    if (artificialPlayerName !== undefined) {
      request.setArtificialPlayerId(artificialPlayerName);
    }
    const gameView = await makeRpcFromBrowser(
      request,
      'GameService/RemoveArtificialPlayer',
      GameView.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(gameView));
    }
    return gameView;
  }

  public async createChatMessage(text: string): Promise<GameView> {
    const request = new CreateChatMessageRequest();
    request.setUserName(this.currentUserName);
    const chatMessage = new ChatMessage();
    chatMessage.setText(text);
    request.setChatMessage(chatMessage);
    const gameView = await makeRpcFromBrowser(
      request,
      'GameService/CreateChatMessage',
      GameView.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(gameView));
    }
    return gameView;
  }

  public async getGameView(): Promise<GameView | undefined> {
    const request = new GetGameViewRequest();
    request.setUserName(this.currentUserName);
    const gameView = await makeRpcFromBrowser(
      request,
      'GameService/GetGameView',
      GameView.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setGameState(gameView));
    }
    return gameView;
  }
}
