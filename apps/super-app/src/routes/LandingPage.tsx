import './LandingPage.css';
import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Container } from '../common/components';
import { ServiceCard } from '../common/components/ServiceCard';
import {
  getServiceCardAbouts,
  getSupportDetailStrings,
  ServiceCardAbout,
  SupportDetailStrings,
} from '../services/DetailServices';

export function LandingPage() {
  const [fixedStrings, setFixedStrings] = useState<SupportDetailStrings | null>(
    null
  );
  useEffect(() => {
    setFixedStrings(getSupportDetailStrings());
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
    </Container>
  );
}
