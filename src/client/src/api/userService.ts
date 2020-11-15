import {FieldMask} from 'google-protobuf/google/protobuf/field_mask_pb';
import {Store} from 'redux';
import {User, UserProfileImage, UserSettings, GameConfig} from '../../../../proto-gen-out/api/model_pb';
import {
  GetUserRequest,
  UpdateUserProfileImageRequest,
  UpdateUserRequest,
  UpdateUserSettingsRequest
} from '../../../../proto-gen-out/api/user_service_pb';
import {makeRpcFromBrowser} from '../../../server/rpc';
import {bindAllFunctionsToSelf} from '../helpers/bindAll';
import {StoreState} from '../store';
import {setUser, setUserSettings} from '../store/modules/global';

const updateUserSettings = async (request: UpdateUserSettingsRequest):
Promise<UserSettings> => {
  return makeRpcFromBrowser(
    request,
    'UserService/UpdateUserSettings',
    UserSettings.deserializeBinary
  );
};

const updateUserProfileImage =
async (request: UpdateUserProfileImageRequest): Promise<UserProfileImage> => {
  return new UserProfileImage(); // TODO - Implement.
};

export class UserService {
  constructor(
    private readonly currentUserName?: string,
    private readonly store?: Store<StoreState>) {
    bindAllFunctionsToSelf(this);
  }

  public async getUser(userName: string): Promise<User> {
    const request = new GetUserRequest();
    request.setName(userName);
    return makeRpcFromBrowser(
      request,
      'UserService/GetUser',
      User.deserializeBinary
    );
  }

  public getUserProfileImageUrl(userName: string): string {
    return ''; // TODO - Implement.
  }

  public async updateCurrentUserDisplayName(newDisplayName: string):
  Promise<User> {
    if (!this.currentUserName) {
      throw new Error('Cannot update display name - user is not logged in.');
    }

    const user = new User();
    user.setName(this.currentUserName);
    user.setDisplayName(newDisplayName);

    const updateMask = new FieldMask();
    updateMask.addPaths('display_name');

    const request = new UpdateUserRequest();
    request.setUser(user);
    request.setUpdateMask(updateMask);

    const updatedUser = await makeRpcFromBrowser(
      request,
      'UserService/UpdateUser',
      User.deserializeBinary
    );
    if (this.store) {
      this.store.dispatch(setUser(updatedUser));
    }
    return updatedUser;
  }

  public async updateCurrentUserColorScheme(
    newColorScheme: UserSettings.ColorScheme): Promise<UserSettings> {
    const userSettings = new UserSettings();
    userSettings.setName(`${this.currentUserName}/settings`);
    userSettings.setColorScheme(newColorScheme);

    const updateMask = new FieldMask();
    updateMask.addPaths('color_scheme');

    const request = new UpdateUserSettingsRequest();
    request.setUserSettings(userSettings);
    request.setUpdateMask(updateMask);

    const updatedUserSettings = await updateUserSettings(request);
    if (this.store) {
      this.store.dispatch(setUserSettings(updatedUserSettings));
    }
    return updatedUserSettings;
  }

  public async updateCurrentUserQuickStartGameConfig(
    config: GameConfig | undefined): Promise<UserSettings> {
    const userSettings = new UserSettings();
    userSettings.setName(`${this.currentUserName}/settings`);
    if (config !== undefined) {
      userSettings.setQuickStartGameConfig(config);
    }

    const updateMask = new FieldMask();
    updateMask.addPaths('quick_start_game_config');

    const request = new UpdateUserSettingsRequest();
    request.setUserSettings(userSettings);
    request.setUpdateMask(updateMask);

    const updatedUserSettings = await updateUserSettings(request);
    if (this.store) {
      this.store.dispatch(setUserSettings(updatedUserSettings));
    }
    return updatedUserSettings;
  }

  public async updateCurrentUserProfileImage(
    newUserProfileImageData: string | Uint8Array): Promise<UserProfileImage> {
    const profileImage = new UserProfileImage();
    profileImage.setName(`${this.currentUserName}/profileImage`);
    profileImage.setImageData(newUserProfileImageData);

    const updateMask = new FieldMask();
    updateMask.addPaths('image_data');

    const request = new UpdateUserProfileImageRequest();
    request.setUserProfileImage(profileImage);
    request.setUpdateMask(updateMask);

    return await updateUserProfileImage(request);
  }
}
