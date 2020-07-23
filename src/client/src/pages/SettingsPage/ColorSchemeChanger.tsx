import {Switch} from '@material-ui/core';
import * as React from 'react';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {UserSettings} from '../../../../../proto-gen-out/api/model_pb';
import {useUserService} from '../../api/context';
import {setUserSettings, showStatusMessage} from '../../store/modules/global';

const DARK_COLOR_SCHEME = UserSettings.ColorScheme.DEFAULT_DARK;
const LIGHT_COLOR_SCHEME = UserSettings.ColorScheme.DEFAULT_LIGHT;

interface ColorSchemeChangerProps {
  userSettings: UserSettings;
}

const ColorSchemeChanger = (props: ColorSchemeChangerProps) => {
  const dispatch = useDispatch();
  const userService = useUserService();
  const [isChecked, setIsChecked] = useState(
    props.userSettings.getColorScheme() === DARK_COLOR_SCHEME
  );
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      {/* TODO - Find a more Material-UI friendly
      way to display the 'Dark Mode' label. */}
      <div>Dark Mode</div>
      <Switch
        checked={isChecked}
        disabled={isLoading}
        onChange ={async (e, checked) => {
          const newColorScheme = checked ?
            DARK_COLOR_SCHEME : LIGHT_COLOR_SCHEME;
          setIsChecked(checked);
          setIsLoading(true);
          const newUserSettings = props.userSettings.clone();
          newUserSettings.setColorScheme(newColorScheme);
          dispatch(setUserSettings(newUserSettings));
          try {
            await userService.updateCurrentUserColorScheme(newColorScheme);
            dispatch(showStatusMessage('Settings saved!'));
          } catch (e) {
            dispatch(setUserSettings(props.userSettings));
            dispatch(showStatusMessage('Settings could not be saved!'));
          }
          setIsLoading(false);
        }}
      />
    </div>
  );
};

export default ColorSchemeChanger;
