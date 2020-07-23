import {
  AutocompleteCardpackSearchRequest,
  AutocompleteCardpackSearchResponse,
  BatchCreateBlackCardsRequest,
  BatchCreateBlackCardsResponse,
  BatchCreateWhiteCardsRequest,
  BatchCreateWhiteCardsResponse,
  BatchDeleteBlackCardsRequest,
  BatchDeleteBlackCardsResponse,
  BatchDeleteWhiteCardsRequest,
  BatchDeleteWhiteCardsResponse,
  CardpackSearchRequest,
  CardpackSearchResponse,
  CheckDoesUserLikeCardpackRequest,
  CheckDoesUserLikeCardpackResponse,
  CreateBlackCardRequest,
  CreateCardpackRequest,
  CreateWhiteCardRequest,
  DeleteBlackCardRequest,
  DeleteCardpackRequest,
  DeleteWhiteCardRequest,
  GetCardpackRequest,
  LikeCardpackRequest,
  ListBlackCardsRequest,
  ListBlackCardsResponse,
  ListCardpacksRequest,
  ListCardpacksResponse,
  ListWhiteCardsRequest,
  ListWhiteCardsResponse,
  UndeleteBlackCardRequest,
  UndeleteCardpackRequest,
  UndeleteWhiteCardRequest,
  UnlikeCardpackRequest,
  UpdateBlackCardRequest,
  UpdateCardpackRequest,
  UpdateWhiteCardRequest
} from '../../../../proto-gen-out/api/cardpack_service_pb';
import {BlackCard, Cardpack, WhiteCard} from '../../../../proto-gen-out/api/model_pb';
import {makeRpcFromBrowser} from '../../../server/rpc';

export const createCardpack = (parentUserName: string, cardpack: Cardpack):
Promise<Cardpack> => {
  const request = new CreateCardpackRequest();
  request.setParent(parentUserName);
  request.setCardpack(cardpack);
  return makeRpcFromBrowser(
    request,
    'CardpackService/CreateCardpack',
    Cardpack.deserializeBinary
  );
};

export const getCardpack = (cardpackName: string): Promise<Cardpack> => {
  const request = new GetCardpackRequest();
  request.setName(cardpackName);
  return makeRpcFromBrowser(
    request,
    'CardpackService/GetCardpack',
    Cardpack.deserializeBinary
  );
};

export const listCardpacks = (request: ListCardpacksRequest):
Promise<ListCardpacksResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/ListCardpacks',
    ListCardpacksResponse.deserializeBinary
  );
};

export const updateCardpack = (request: UpdateCardpackRequest):
Promise<Cardpack> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/UpdateCardpack',
    Cardpack.deserializeBinary
  );
};

export const deleteCardpack = (cardpackName: string): Promise<Cardpack> => {
  const request = new DeleteCardpackRequest();
  request.setName(cardpackName);
  return makeRpcFromBrowser(
    request,
    'CardpackService/DeleteCardpack',
    Cardpack.deserializeBinary
  );
};

export const createBlackCard =
(parentCardpackName: string, card: BlackCard): Promise<BlackCard> => {
  const request = new CreateBlackCardRequest();
  request.setParent(parentCardpackName);
  request.setBlackCard(card);
  return makeRpcFromBrowser(
    request,
    'CardpackService/CreateBlackCard',
    BlackCard.deserializeBinary
  );
};

export const createWhiteCard =
(parentCardpackName: string, card: WhiteCard): Promise<WhiteCard> => {
  const request = new CreateWhiteCardRequest();
  request.setParent(parentCardpackName);
  request.setWhiteCard(card);
  return makeRpcFromBrowser(
    request,
    'CardpackService/CreateWhiteCard',
    WhiteCard.deserializeBinary
  );
};

export const listBlackCards = (request: ListBlackCardsRequest):
Promise<ListBlackCardsResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/ListBlackCards',
    ListBlackCardsResponse.deserializeBinary
  );
};

export const listWhiteCards = (request: ListWhiteCardsRequest):
Promise<ListWhiteCardsResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/ListWhiteCards',
    ListWhiteCardsResponse.deserializeBinary
  );
};

export const updateBlackCard = (request: UpdateBlackCardRequest):
Promise<BlackCard> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/UpdateBlackCard',
    BlackCard.deserializeBinary
  );
};

export const updateWhiteCard = (request: UpdateWhiteCardRequest):
Promise<WhiteCard> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/UpdateWhiteCard',
    WhiteCard.deserializeBinary
  );
};

export const deleteBlackCard = (blackCardName: string): Promise<BlackCard> => {
  const request = new DeleteBlackCardRequest();
  request.setName(blackCardName);
  return makeRpcFromBrowser(
    request,
    'CardpackService/DeleteBlackCard',
    BlackCard.deserializeBinary
  );
};

export const deleteWhiteCard = (whiteCardName: string): Promise<WhiteCard> => {
  const request = new DeleteWhiteCardRequest();
  request.setName(whiteCardName);
  return makeRpcFromBrowser(
    request,
    'CardpackService/DeleteWhiteCard',
    WhiteCard.deserializeBinary
  );
};

export const batchCreateBlackCards =
(request: BatchCreateBlackCardsRequest):
Promise<BatchCreateBlackCardsResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/BatchCreateBlackCards',
    BatchCreateBlackCardsResponse.deserializeBinary
  );
};

export const batchCreateWhiteCards =
(request: BatchCreateWhiteCardsRequest):
Promise<BatchCreateWhiteCardsResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/BatchCreateWhiteCards',
    BatchCreateWhiteCardsResponse.deserializeBinary
  );
};

export const batchDeleteBlackCards =
(request: BatchDeleteBlackCardsRequest):
Promise<BatchDeleteBlackCardsResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/BatchDeleteBlackCards',
    BatchDeleteBlackCardsResponse.deserializeBinary
  );
};

export const batchDeleteWhiteCards =
(request: BatchDeleteWhiteCardsRequest):
Promise<BatchDeleteWhiteCardsResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/BatchDeleteWhiteCards',
    BatchDeleteWhiteCardsResponse.deserializeBinary
  );
};

export const undeleteCardpack = (request: UndeleteCardpackRequest):
Promise<Cardpack> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/UndeleteCardpack',
    Cardpack.deserializeBinary
  );
};

export const undeleteBlackCard = (request: UndeleteBlackCardRequest):
Promise<BlackCard> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/UndeleteBlackCard',
    BlackCard.deserializeBinary
  );
};

export const undeleteWhiteCard = (request: UndeleteWhiteCardRequest):
Promise<WhiteCard> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/UndeleteWhiteCard',
    WhiteCard.deserializeBinary
  );
};

export const likeCardpack = (request: LikeCardpackRequest):
Promise<Cardpack> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/LikeCardpack',
    Cardpack.deserializeBinary
  );
};

export const unlikeCardpack = (request: UnlikeCardpackRequest):
Promise<Cardpack> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/UnlikeCardpack',
    Cardpack.deserializeBinary
  );
};

export const checkDoesUserLikeCardpack =
(request: CheckDoesUserLikeCardpackRequest):
Promise<CheckDoesUserLikeCardpackResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/CheckDoesUserLikeCardpack',
    CheckDoesUserLikeCardpackResponse.deserializeBinary
  );
};

export const cardpackSearch = (request: CardpackSearchRequest):
Promise<CardpackSearchResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/CardpackSearch',
    CardpackSearchResponse.deserializeBinary
  );
};

export const autocompleteCardpackSearch =
(request: AutocompleteCardpackSearchRequest):
Promise<AutocompleteCardpackSearchResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/AutocompleteCardpackSearch',
    AutocompleteCardpackSearchResponse.deserializeBinary
  );
};
