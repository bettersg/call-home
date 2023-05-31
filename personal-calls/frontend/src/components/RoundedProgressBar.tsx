import LinearProgress from '@mui/material/LinearProgress';
import { withStyles } from 'hack/withStyles';

export const RoundedProgressBar = withStyles({
  height: 8,
  borderRadius: 6,
  '& .MuiLinearProgress-barColorPrimary': {
    borderRadius: 6,
    backgroundColor: 'primary.700',
  },
  border: 'solid 1px',
  borderColor: 'primary.700',
  backgroundColor: '#ffffffff',
})(LinearProgress);
