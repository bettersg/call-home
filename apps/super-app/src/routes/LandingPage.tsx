import './LandingPage.css';
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Container } from '../common/components';
import { ServiceCard } from '../common/components/ServiceCard';
import {
  useLanguage,
  getServiceCardAbouts,
  getSupportDetailStrings,
  ServiceCardAbout,
  SupportDetailStrings,
} from '../services';
import { NavBar } from '../components';
import '../components/navbar/NavBarAbove.css';

export function LandingPage() {
  const [fixedStrings, setFixedStrings] = useState<SupportDetailStrings | null>(
    null
  );
  const [lang] = useLanguage();
  useEffect(() => {
    setFixedStrings(getSupportDetailStrings(lang));
  }, []);
  if (!fixedStrings) {
    // TODO return something (hint or loading spinner) since this is landing page, we can't return null
    return null;
  }
  const { headerTitle } = fixedStrings;
  const serviceCardAbouts: ServiceCardAbout[] = getServiceCardAbouts();
  return (
    <Container
      style={{
        background: 'no-repeat url(/images/background.svg) bottom center',
        backgroundSize: 'contain',
        padding: 0,
      }}
    >
      <Box
        className="navbar-above"
        style={{
          padding: '0px 20px',
        }}
      >
        <Typography
          component="div"
          variant="h5"
          sx={{
            margin: '16px 0px',
          }}
        >
          {headerTitle}
        </Typography>
        {serviceCardAbouts.map(({ logo, name, shortBlurb, route }) => (
          <ServiceCard
            logo={logo}
            name={name}
            shortBlurb={shortBlurb}
            route={route}
          ></ServiceCard>
        ))}
      </Box>
      <NavBar />
    </Container>
  );
}
