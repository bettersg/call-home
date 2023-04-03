import Button from '@mui/material/Button';
import { withStyles } from 'hack/withStyles';

const RoundedButton = withStyles({
  borderRadius: '1000px', // This just needs to be >50% of the button's height
})(Button);

const PrimaryButton = withStyles({
  backgroundColor: 'primary.700',
  color: 'white',
  '&:hover': {
    backgroundColor: 'primary.700',
  },
})(RoundedButton);

const NeutralButton = withStyles({
  backgroundColor: 'white',
  color: 'primary.700',
})(RoundedButton);

const ErrorButton = withStyles({
  backgroundColor: 'error.main',
  color: 'white',
})(RoundedButton);

export default RoundedButton;
export { NeutralButton, PrimaryButton, ErrorButton };
