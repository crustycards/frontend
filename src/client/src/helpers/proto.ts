import {User, UserSettings} from '../../../../proto-gen-out/api/model_pb';
import {Player, PlayableWhiteCard} from '../../../../proto-gen-out/game/game_service_pb';
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
        && twoArtificialUser.getId() === twoArtificialUser.getId();
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
  const blankCard = card.getBlankCard();
  if (blankCard) {
    return blankCard.getOpenText();
  }

  const whiteCard = card.getWhiteCard();
  if (whiteCard) {
    return whiteCard.getText();
  }

  return 'Unknown';
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
