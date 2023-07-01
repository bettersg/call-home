import Button from '@mui/material/Button';
import { withStyles } from '../hack/withStyles';

const RoundedButton = withStyles({
  // This just needs to be >50% of the button's height
  borderRadius: '1000px',
})(Button);

const PrimaryButton = withStyles({
  color: 'white',
  // sx has direct access to the theme, so we provide just a string.
  backgroundColor: 'primary.700',
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
