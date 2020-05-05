import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    color: theme.palette.primary[300],
    borderRadius: '1000px', // TODO This just needs to be >50% of the button's height
  },
}));
