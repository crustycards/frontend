import * as React from 'react';
import ColorSchemeChanger from './SettingsPage/ColorSchemeChanger';
import {StoreState} from '../store';
import {useSelector} from 'react-redux';
import {useGlobalStyles} from '../styles/globalStyles';
import {Typography, Paper, Theme} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  settingsPaper: {
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`
  }
}));

const SettingsPage = () => {
  const {userSettings} = useSelector(
    ({global: {userSettings}}: StoreState) => ({userSettings})
  );

  const globalClasses = useGlobalStyles();
  const classes = useStyles();

  if (userSettings === undefined) {
    return (
      <div className={globalClasses.contentWrap}>
        <Typography
          variant={'h4'}
          align={'center'}
        >
          Settings
        </Typography>
        <div>
          You must be logged in to view your settings
        </div>
      </div>
    );
  }

  return (
    <div className={globalClasses.contentWrap}>
      <Typography
        variant={'h4'}
        align={'center'}
      >
        Settings
      </Typography>
      <div className={classes.root}>
        <Paper elevation={3} className={classes.settingsPaper}>
          <Typography
            variant={'h6'}
            align={'center'}
          >
            Display/Appearance
          </Typography>
          <ColorSchemeChanger userSettings={userSettings}/>
        </Paper>
      </div>
    </div>
  );
};

export default SettingsPage;
