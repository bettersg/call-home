import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const RoundedButton = withStyles(() => ({
  root: {
    borderRadius: '1000px', // This just needs to be >50% of the button's height
  },
}))(Button);

const PrimaryButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary[700],
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.primary[700],
    },
  },
}))(RoundedButton);

const NeutralButton = withStyles((theme) => ({
  root: {
    backgroundColor: 'white',
    color: theme.palette.primary[700],
  },
}))(RoundedButton);

const ErrorButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.error.main,
    color: 'white',
  },
}))(RoundedButton);

export default RoundedButton;
export { NeutralButton, PrimaryButton, ErrorButton };
