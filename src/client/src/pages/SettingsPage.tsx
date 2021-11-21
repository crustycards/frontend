import * as React from 'react';
import ColorSchemeChanger from './SettingsPage/ColorSchemeChanger';
import {StoreState} from '../store';
import {useSelector} from 'react-redux';
import {ContentWrap} from '../styles/globalStyles';
import {Typography, Paper, Theme} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useTheme} from '@mui/system';

const Root = styled('div')(({theme}) => ({
  display: 'flex',
  flexWrap: 'wrap',
  '& > *': {
    margin: theme.spacing(1)
  }
}));

const SettingsPage = () => {
  const {userSettings} = useSelector(
    ({global: {userSettings}}: StoreState) => ({userSettings})
  );

  const theme = useTheme();

  if (userSettings === undefined) {
    return (
      <ContentWrap>
        <Typography
          variant={'h4'}
          align={'center'}
        >
          Settings
        </Typography>
        <div>
          You must be logged in to view your settings
        </div>
      </ContentWrap>
    );
  }

  return (
    <ContentWrap>
      <Typography
        variant={'h4'}
        align={'center'}
      >
        Settings
      </Typography>
      <Root>
        <Paper elevation={3} sx={{padding: `${theme.spacing(1)} ${theme.spacing(2)}`}}>
          <Typography
            variant={'h6'}
            align={'center'}
          >
            Display/Appearance
          </Typography>
          <ColorSchemeChanger userSettings={userSettings}/>
        </Paper>
      </Root>
    </ContentWrap>
  );
};

export default SettingsPage;
