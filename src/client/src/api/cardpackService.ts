import {
  AutocompleteCustomCardpackSearchRequest,
  AutocompleteCustomCardpackSearchResponse,
  BatchCreateCustomBlackCardsRequest,
  BatchCreateCustomBlackCardsResponse,
  BatchCreateCustomWhiteCardsRequest,
  BatchCreateCustomWhiteCardsResponse,
  BatchDeleteCustomBlackCardsRequest,
  BatchDeleteCustomBlackCardsResponse,
  BatchDeleteCustomWhiteCardsRequest,
  BatchDeleteCustomWhiteCardsResponse,
  CustomCardpackSearchRequest,
  CustomCardpackSearchResponse,
  CheckDoesUserLikeCustomCardpackRequest,
  CheckDoesUserLikeCustomCardpackResponse,
  CreateCustomBlackCardRequest,
  CreateCustomCardpackRequest,
  CreateCustomWhiteCardRequest,
  DeleteCustomBlackCardRequest,
  DeleteCustomCardpackRequest,
  DeleteCustomWhiteCardRequest,
  GetCustomCardpackRequest,
  LikeCustomCardpackRequest,
  ListCustomBlackCardsRequest,
  ListCustomBlackCardsResponse,
  ListCustomCardpacksRequest,
  ListCustomCardpacksResponse,
  ListCustomWhiteCardsRequest,
  ListCustomWhiteCardsResponse,
  UndeleteCustomBlackCardRequest,
  UndeleteCustomCardpackRequest,
  UndeleteCustomWhiteCardRequest,
  UnlikeCustomCardpackRequest,
  UpdateCustomBlackCardRequest,
  UpdateCustomCardpackRequest,
  UpdateCustomWhiteCardRequest,
  GetDefaultCardpackRequest,
  ListDefaultCardpacksRequest,
  ListDefaultCardpacksResponse,
  ListDefaultBlackCardsResponse,
  ListDefaultWhiteCardsRequest,
  ListDefaultWhiteCardsResponse,
  ListDefaultBlackCardsRequest
} from '../../../../proto-gen-out/api/cardpack_service_pb';
import {CustomBlackCard, CustomCardpack, CustomWhiteCard, DefaultCardpack} from '../../../../proto-gen-out/api/model_pb';
import {makeRpcFromBrowser} from '../../../server/rpc';

export const createCustomCardpack =
(parentUserName: string, customCardpack: CustomCardpack):
Promise<CustomCardpack> => {
  const request = new CreateCustomCardpackRequest();
  request.setParent(parentUserName);
  request.setCustomCardpack(customCardpack);
  return makeRpcFromBrowser(
    request,
    'CardpackService/CreateCustomCardpack',
    CustomCardpack.deserializeBinary
  );
};

export const getCustomCardpack =
(customCardpackName: string): Promise<CustomCardpack> => {
  const request = new GetCustomCardpackRequest();
  request.setName(customCardpackName);
  return makeRpcFromBrowser(
    request,
    'CardpackService/GetCustomCardpack',
    CustomCardpack.deserializeBinary
  );
};

export const listCustomCardpacks = (request: ListCustomCardpacksRequest):
Promise<ListCustomCardpacksResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/ListCustomCardpacks',
    ListCustomCardpacksResponse.deserializeBinary
  );
};

export const updateCustomCardpack = (request: UpdateCustomCardpackRequest):
Promise<CustomCardpack> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/UpdateCustomCardpack',
    CustomCardpack.deserializeBinary
  );
};

export const deleteCustomCardpack = (customCardpackName: string):
Promise<CustomCardpack> => {
  const request = new DeleteCustomCardpackRequest();
  request.setName(customCardpackName);
  return makeRpcFromBrowser(
    request,
    'CardpackService/DeleteCustomCardpack',
    CustomCardpack.deserializeBinary
  );
};

export const createCustomBlackCard =
(parentCustomCardpackName: string, card: CustomBlackCard):
Promise<CustomBlackCard> => {
  const request = new CreateCustomBlackCardRequest();
  request.setParent(parentCustomCardpackName);
  request.setCustomBlackCard(card);
  return makeRpcFromBrowser(
    request,
    'CardpackService/CreateCustomBlackCard',
    CustomBlackCard.deserializeBinary
  );
};

export const createCustomWhiteCard =
(parentCustomCardpackName: string, card: CustomWhiteCard):
Promise<CustomWhiteCard> => {
  const request = new CreateCustomWhiteCardRequest();
  request.setParent(parentCustomCardpackName);
  request.setCustomWhiteCard(card);
  return makeRpcFromBrowser(
    request,
    'CardpackService/CreateCustomWhiteCard',
    CustomWhiteCard.deserializeBinary
  );
};

export const listCustomBlackCards = (request: ListCustomBlackCardsRequest):
Promise<ListCustomBlackCardsResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/ListCustomBlackCards',
    ListCustomBlackCardsResponse.deserializeBinary
  );
};

export const listCustomWhiteCards = (request: ListCustomWhiteCardsRequest):
Promise<ListCustomWhiteCardsResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/ListCustomWhiteCards',
    ListCustomWhiteCardsResponse.deserializeBinary
  );
};

export const updateCustomBlackCard = (request: UpdateCustomBlackCardRequest):
Promise<CustomBlackCard> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/UpdateCustomBlackCard',
    CustomBlackCard.deserializeBinary
  );
};

export const updateCustomWhiteCard = (request: UpdateCustomWhiteCardRequest):
Promise<CustomWhiteCard> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/UpdateCustomWhiteCard',
    CustomWhiteCard.deserializeBinary
  );
};

export const deleteCustomBlackCard =
(customBlackCardName: string): Promise<CustomBlackCard> => {
  const request = new DeleteCustomBlackCardRequest();
  request.setName(customBlackCardName);
  return makeRpcFromBrowser(
    request,
    'CardpackService/DeleteCustomBlackCard',
    CustomBlackCard.deserializeBinary
  );
};

export const deleteCustomWhiteCard =
(customWhiteCardName: string): Promise<CustomWhiteCard> => {
  const request = new DeleteCustomWhiteCardRequest();
  request.setName(customWhiteCardName);
  return makeRpcFromBrowser(
    request,
    'CardpackService/DeleteCustomWhiteCard',
    CustomWhiteCard.deserializeBinary
  );
};

export const batchCreateCustomBlackCards =
(request: BatchCreateCustomBlackCardsRequest):
Promise<BatchCreateCustomBlackCardsResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/BatchCreateCustomBlackCards',
    BatchCreateCustomBlackCardsResponse.deserializeBinary
  );
};

export const batchCreateCustomWhiteCards =
(request: BatchCreateCustomWhiteCardsRequest):
Promise<BatchCreateCustomWhiteCardsResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/BatchCreateCustomWhiteCards',
    BatchCreateCustomWhiteCardsResponse.deserializeBinary
  );
};

export const batchDeleteCustomBlackCards =
(request: BatchDeleteCustomBlackCardsRequest):
Promise<BatchDeleteCustomBlackCardsResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/BatchDeleteCustomBlackCards',
    BatchDeleteCustomBlackCardsResponse.deserializeBinary
  );
};

export const batchDeleteCustomWhiteCards =
(request: BatchDeleteCustomWhiteCardsRequest):
Promise<BatchDeleteCustomWhiteCardsResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/BatchDeleteCustomWhiteCards',
    BatchDeleteCustomWhiteCardsResponse.deserializeBinary
  );
};

export const getDefaultCardpack =
(defaultCardpackName: string): Promise<DefaultCardpack> => {
  const request = new GetDefaultCardpackRequest();
  request.setName(defaultCardpackName);
  return makeRpcFromBrowser(
    request,
    'CardpackService/GetDefaultCardpack',
    DefaultCardpack.deserializeBinary
  );
};

export const listDefaultCardpacks = (request: ListDefaultCardpacksRequest):
Promise<ListDefaultCardpacksResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/ListDefaultCardpacks',
    ListDefaultCardpacksResponse.deserializeBinary
  );
};

export const listDefaultBlackCards = (request: ListDefaultBlackCardsRequest):
Promise<ListDefaultBlackCardsResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/ListDefaultBlackCards',
    ListDefaultBlackCardsResponse.deserializeBinary
  );
};

export const listDefaultWhiteCards = (request: ListDefaultWhiteCardsRequest):
Promise<ListDefaultWhiteCardsResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/ListDefaultWhiteCards',
    ListDefaultWhiteCardsResponse.deserializeBinary
  );
};

export const undeleteCustomCardpack = (request: UndeleteCustomCardpackRequest):
Promise<CustomCardpack> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/UndeleteCustomCardpack',
    CustomCardpack.deserializeBinary
  );
};

export const undeleteCustomBlackCard =
(request: UndeleteCustomBlackCardRequest):
Promise<CustomBlackCard> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/UndeleteCustomBlackCard',
    CustomBlackCard.deserializeBinary
  );
};

export const undeleteCustomWhiteCard =
(request: UndeleteCustomWhiteCardRequest):
Promise<CustomWhiteCard> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/UndeleteCustomWhiteCard',
    CustomWhiteCard.deserializeBinary
  );
};

export const likeCustomCardpack = (request: LikeCustomCardpackRequest):
Promise<CustomCardpack> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/LikeCustomCardpack',
    CustomCardpack.deserializeBinary
  );
};

export const unlikeCustomCardpack = (request: UnlikeCustomCardpackRequest):
Promise<CustomCardpack> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/UnlikeCustomCardpack',
    CustomCardpack.deserializeBinary
  );
};

export const checkDoesUserLikeCustomCardpack =
(request: CheckDoesUserLikeCustomCardpackRequest):
Promise<CheckDoesUserLikeCustomCardpackResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/CheckDoesUserLikeCustomCardpack',
    CheckDoesUserLikeCustomCardpackResponse.deserializeBinary
  );
};

export const customCardpackSearch = (request: CustomCardpackSearchRequest):
Promise<CustomCardpackSearchResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/CustomCardpackSearch',
    CustomCardpackSearchResponse.deserializeBinary
  );
};

export const autocompleteCustomCardpackSearch =
(request: AutocompleteCustomCardpackSearchRequest):
Promise<AutocompleteCustomCardpackSearchResponse> => {
  return makeRpcFromBrowser(
    request,
    'CardpackService/AutocompleteCustomCardpackSearch',
    AutocompleteCustomCardpackSearchResponse.deserializeBinary
  );
};
