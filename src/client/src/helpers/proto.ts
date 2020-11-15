import {User, UserSettings} from '../../../../proto-gen-out/api/model_pb';
import {Player, PlayableWhiteCard, BlackCardInRound} from '../../../../proto-gen-out/api/game_service_pb';
import {
  opaqueSerializedStringToUint8Array,
  uint8ArrayToOpaqueSerializedString
} from './serialize';

// TODO - Write tests for these helper functions.

export const filterPlayerListToUserList = (players: Player[]): User[] => {
  const users: User[] = [];
  players.forEach((player) => {
    const user = player.getUser();
    if (user) {
      users.push(user);
    }
  });
  return users;
};

export const playersAreEqual =
(one: Player | undefined, two: Player | undefined): boolean => {
  if (!one || !two) {
    return false;
  }

  const oneUser = one.getUser();
  const twoUser = two.getUser();

  if (oneUser && twoUser) {
    return !!oneUser.getName().length &&
      oneUser.getName() === twoUser.getName();
  }

  const oneArtificialUser = one.getArtificialUser();
  const twoArtificialUser = two.getArtificialUser();

  if (oneArtificialUser && twoArtificialUser) {
    return !!oneArtificialUser.getId().length
        && oneArtificialUser.getId() === twoArtificialUser.getId();
  }

  return false;
};

export const getPlayerDisplayName = (player?: Player): string => {
  if (!player) {
    return 'Unknown';
  }

  const user = player.getUser();
  if (user) {
    return user.getDisplayName();
  }

  const artificialUser = player.getArtificialUser();
  if (artificialUser) {
    return artificialUser.getDisplayName();
  }

  return 'Unknown';
};

export const getDisplayTextForPlayableWhiteCard =
(card: PlayableWhiteCard): string => {
  const blankWhiteCard = card.getBlankWhiteCard();
  if (blankWhiteCard) {
    return blankWhiteCard.getOpenText();
  }

  const customWhiteCard = card.getCustomWhiteCard();
  if (customWhiteCard) {
    return customWhiteCard.getText();
  }

  const defaultWhiteCard = card.getDefaultWhiteCard();
  if (defaultWhiteCard) {
    return defaultWhiteCard.getText();
  }

  return 'Unknown';
};

export const getDisplayTextForBlackCardInRound =
(card: BlackCardInRound): string => {
  const customBlackCard = card.getCustomBlackCard();
  if (customBlackCard) {
    return customBlackCard.getText();
  }

  const defaultBlackCard = card.getDefaultBlackCard();
  if (defaultBlackCard) {
    return defaultBlackCard.getText();
  }

  return 'Unknown';
};

export const getAnswerFieldsForBlackCardInRound =
(card?: BlackCardInRound): number | undefined => {
  if (card === undefined) {
    return undefined;
  }

  const customBlackCard = card.getCustomBlackCard();
  if (customBlackCard) {
    return customBlackCard.getAnswerFields();
  }

  const defaultBlackCard = card.getDefaultBlackCard();
  if (defaultBlackCard) {
    return defaultBlackCard.getAnswerFields();
  }

  return undefined;
};

interface PreloadedState {
  user?: User;
  userSettings?: UserSettings;
}

export const serializePreloadedState = (state: PreloadedState): string => {
  const data: any = {};

  if (state.user) {
    data.userBinary = uint8ArrayToOpaqueSerializedString(
      state.user.serializeBinary());
  }

  if (state.userSettings) {
    data.userSettingsBinary = uint8ArrayToOpaqueSerializedString(
      state.userSettings.serializeBinary());
  }

  return JSON.stringify(data);
};

export const deserializePreloadedState = (data: string): PreloadedState => {
  try {
    const parsedData = JSON.parse(data);
    if (!parsedData) {
      return parsedData;
    }

    const user = (typeof parsedData.userBinary === 'string')
      && User.deserializeBinary(
        opaqueSerializedStringToUint8Array(parsedData.userBinary));
    const userSettings = (typeof parsedData.userSettingsBinary === 'string')
      && UserSettings.deserializeBinary(
        opaqueSerializedStringToUint8Array(parsedData.userSettingsBinary));

    const state: PreloadedState = {};

    if (user) {
      state.user = user;
    }

    if (userSettings) {
      state.userSettings = userSettings;
    }

    return state;
  } catch (e) {
    return {};
  }
};
