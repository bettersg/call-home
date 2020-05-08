import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

export default withStyles((theme) => ({
  root: {
    color: theme.palette.primary[300],
    borderRadius: '1000px', // TODO This just needs to be >50% of the button's height
  },
}))(Button);
