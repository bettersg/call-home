import './Carousel.css';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { CarouselCard } from '../../../services';
import { Link } from 'react-router-dom';

export function Carousel(props: { carouselSection: CarouselCard[] }) {
  const { carouselSection } = props;
  return (
    <div className="carousel-container">
      {carouselSection.map((carouselCard: CarouselCard) => (
        <div className="card-container">
          <Card className="card" component={Link} to={carouselCard.route}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {carouselCard.title}
              </Typography>
              <Typography gutterBottom variant="body2" component="div">
                {carouselCard.description}
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              height="70px"
              width="auto !important"
              image={carouselCard.iconPath}
              alt={`${carouselCard.title} logo`}
              sx={{ objectFit: 'contain' }}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {carouselCard.ctaText}
              </Typography>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
