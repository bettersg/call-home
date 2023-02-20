import './ServiceCard.css';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ServiceCardAbout } from '../../services';

export function ServiceCard(props: ServiceCardAbout) {
  const { logo, name, shortBlurb, route } = props;
  return (
    <Card sx={{ display: 'flex', marginBottom: '16px' }}>
      <CardMedia
        component="img"
        sx={{ width: '5rem', height: '5rem', margin: 'auto 16px' }}
        image={logo}
        alt={`${name} logo`}
      />
      <CardActionArea component={Link} to={route}>
        <Box sx={{ flex: '1 0 auto' }}>
          <CardContent>
            <Typography
              component="div"
              variant="h5"
              sx={{
                fontSize: 16,
                fontWeight: 600,
                color: '#297B94',
                fontFamily: 'Hind',
                textDecoration: 'underline',
              }}
            >
              {name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{
                fontSize: 14,
                fontWeight: 400,
                color: '#000000',
                fontFamily: 'Hind',
              }}
            >
              {shortBlurb}
            </Typography>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
}
