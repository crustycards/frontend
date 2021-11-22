import {styled} from '@mui/material/styles';

export const Panel = styled('div')(({theme}) => ({
  background: theme.palette.mode === 'dark' ? '#3A3A3A' : '#F0F0F0',
  borderRadius: '0.5em',
  padding: '10px',
  margin: '5px'
}));

export const Subpanel = styled('div')(({theme}) => ({
  background: theme.palette.background.default,
  borderRadius: '0.25em',
  padding: '10px',
  margin: '5px'
}));

export const ContentWrap = styled('div')({
  maxWidth: '1000px',
  margin: '0 auto',
  padding: '10px'
});

export const Center = styled('div')({
  textAlign: 'center'
});