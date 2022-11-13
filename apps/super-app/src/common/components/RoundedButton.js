import Button from '@mui/material/Button';

// This uses the mui5 sx prop.
// TODO Presumably there's something easier than this e.g. a styling solution
// that doesn't use the sx prop or an HOC that already does this exact thing,
// but I couldn't figure out where, and this has tortured me enough.
function withStylesSx(styles) {
  return (Component) => {
    return (props) => {
      const {
        sx,
        ...rest
      } = props;
      return <Component sx={[
        styles,
        ...(Array.isArray(sx) ? sx : [sx])
      ]}{...rest}></Component>
    }
  }
}

const RoundedButton = withStylesSx({
  // This just needs to be >50% of the button's height
  borderRadius: '1000px'
})(Button);

const PrimaryButton = withStylesSx({
  color: 'white',
  // sx has direct access to the theme, so we provide just a string.
  backgroundColor: 'primary.700',
  '&:hover': {
    backgroundColor: 'primary.700',
  }
})(RoundedButton);

const NeutralButton = withStylesSx({
  backgroundColor: 'white',
  color: 'primary.700',
})(RoundedButton);

const ErrorButton = withStylesSx({
  backgroundColor: 'error.main',
  color: 'white',
})(RoundedButton);

export default RoundedButton;
export { NeutralButton, PrimaryButton, ErrorButton };
