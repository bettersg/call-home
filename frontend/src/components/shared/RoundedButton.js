import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const RoundedButton = withStyles(() => ({
  root: {
    borderRadius: '1000px', // TODO This just needs to be >50% of the button's height
  },
}))(Button);

const PrimaryButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary[700],
    color: 'white',
  },
}))(RoundedButton);

const ErrorButton = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.error.main,
    color: 'white',
  },
}))(RoundedButton);

export default RoundedButton;
export { PrimaryButton, ErrorButton };
