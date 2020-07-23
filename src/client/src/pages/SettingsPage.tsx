import * as React from 'react';
import ColorSchemeChanger from './SettingsPage/ColorSchemeChanger';
import {StoreState} from '../store';
import {useSelector} from 'react-redux';
import {useGlobalStyles} from '../styles/globalStyles';

const SettingsPage = () => {
  const {userSettings} = useSelector(
    ({global: {userSettings}}: StoreState) => ({userSettings})
  );

  const globalClasses = useGlobalStyles();

  return (
    <div className={globalClasses.contentWrap}>
      <div className={globalClasses.panel}>
        <h3>Settings</h3>
        {
          userSettings ?
            <ColorSchemeChanger userSettings={userSettings}/>
            :
            <div>You must be logged in to view your settings</div>
        }
      </div>
    </div>
  );
};

export default SettingsPage;
