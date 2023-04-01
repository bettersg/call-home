import './LandingPage.css';
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Container } from '../common/components';
import { ServiceCard } from '../common/components/ServiceCard';
import {
  useLanguage,
  getServiceCardDetails,
  getSupportDetailStrings,
  ServiceCardDetail,
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
  const serviceCardDetails: ServiceCardDetail[] = getServiceCardDetails();
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
          padding: '0 16px',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            padding: '16px 0',
          }}
        >
          {headerTitle}
        </Typography>
        {serviceCardDetails.map(({ logo, name, shortBlurb, route }) => (
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
