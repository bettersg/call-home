import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/styles';

export const RoundedProgressBar = withStyles((theme) => ({
  root: {
    height: 8,
    borderRadius: 6,
    '& .MuiLinearProgress-barColorPrimary': {
      borderRadius: 6,
      backgroundColor: theme.palette.primary[700],
    },
    border: 'solid 1px',
    borderColor: theme.palette.primary[700],
    backgroundColor: '#ffffffff',
  },
}))(LinearProgress);
