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
import { ServiceCardDetail } from '../../../services';

export function ServiceCard(props: ServiceCardDetail) {
  const { logo, name, shortBlurb, route } = props;
  return (
    <Card sx={{ display: 'flex', marginBottom: '16px' }}>
      <CardMedia
        component="img"
        sx={{
          width: '3.5rem',
          height: '3.5rem',
          marginY: 'auto',
          marginLeft: '16px',
          marginRight: '0',
          objectFit: 'contain',
        }}
        image={logo}
        alt={`${name} logo`}
      />
      <CardActionArea component={Link} to={route}>
        <Box sx={{ flex: '1 0 auto' }}>
          <CardContent>
            <Typography component="div" variant="h6">
              {name}
            </Typography>
            <Typography variant="subtitle1" component="div">
              {shortBlurb}
            </Typography>
          </CardContent>
        </Box>
      </CardActionArea>
    </Card>
  );
}
