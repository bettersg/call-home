import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

import { ServiceCard } from '../../common/components';
import { NavBarContainer } from '..';
import {
  getServiceCardDetails,
  getSupportDetailStrings,
  ServiceCardDetail,
  SupportDetailStrings,
} from '../../services';
import { useLanguage } from '../../utils';
import { SearchBar } from '..';

import './LandingPage.css';

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
    <NavBarContainer
      containerStyle={{
        background: 'no-repeat url(/images/background.svg) bottom center',
        backgroundSize: 'contain',
        padding: 0,
      }}
      aboveStyle={{
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
      <SearchBar />
      {serviceCardDetails.map(({ logo, name, shortBlurb, route }) => (
        <ServiceCard
          logo={logo}
          name={name}
          shortBlurb={shortBlurb}
          route={route}
        ></ServiceCard>
      ))}
    </NavBarContainer>
  );
}
