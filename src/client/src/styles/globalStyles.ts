import {
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';

export const useGlobalStyles = makeStyles((theme: Theme) =>
  createStyles({
    panel: {
      background: theme.palette.type === 'dark' ? '#3A3A3A' : '#F0F0F0',
      borderRadius: '0.5em',
      padding: '10px',
      margin: '5px'
    },
    subpanel: {
      background: theme.palette.background.default,
      borderRadius: '0.25em',
      padding: '10px',
      margin: '5px'
    },
    contentWrap: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '10px'
    }
  })
);