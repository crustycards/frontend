import {User, UserSettings} from '../../../../proto-gen-out/crusty_cards_api/model_pb';
import {deserializePreloadedState, serializePreloadedState} from './proto';

describe('PreloadedState serialization/deserialization', () => {
  it('handles empty values', () => {
    let state = deserializePreloadedState(serializePreloadedState({}));
    expect(state.user).toBeUndefined();
    expect(state.userSettings).toBeUndefined();

    const user = new User();
    user.setName('testUser');
    state = deserializePreloadedState(serializePreloadedState({user}));
    expect(state.user).toBeDefined();
    expect(state.user?.getName()).toEqual('testUser');
    expect(state.userSettings).toBeUndefined();
  });

  it('handles non-empty values', () => {
    const user = new User();
    user.setName('testUser');
    const userSettings = new UserSettings();
    userSettings.setName('testUserSettings');
    const state = deserializePreloadedState(
      serializePreloadedState({user, userSettings}));
    expect(state.user).toBeDefined();
    expect(state.user?.getName()).toEqual('testUser');
    expect(state.userSettings).toBeDefined();
    expect(state.userSettings?.getName()).toEqual('testUserSettings');
  });
});
