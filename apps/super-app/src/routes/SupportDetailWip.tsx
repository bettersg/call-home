import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Public as PublicIcon } from '@mui/icons-material';
import { Twc2SupportDetail, getTwc2Detail } from '../services';
import { Container } from '../common/components';
import { PrimaryButton } from '../common/components/RoundedButton';
import './SupportDetailWip.css';

function Header() {
  return <nav className="support-header">Navigation</nav>;
}

function BlurbIntro(props: { text: string }) {
  const { text } = props;
  return (
    <section className="support-description-blurb-section">{text}</section>
  );
}

type BlurbProps = Pick<Twc2SupportDetail, 'blurbIntro'>;

function Blurb(props: BlurbProps) {
  const { blurbIntro } = props;
  return (
    <>
      <BlurbIntro text={blurbIntro} />
    </>
  );
}

type DescriptionProps = Pick<
  Twc2SupportDetail,
  'logo' | 'name' | 'website' | 'blurbIntro'
>;

function DescriptionSection(props: DescriptionProps) {
  const { logo, name, website, blurbIntro } = props;
  return (
    <main className="support-description-container">
      <section className="support-description-header">
        <img src={logo} style={{ flexBasis: '8rem' }} />
        <Typography variant="h4" component="h2" style={{ flex: 1 }}>
          {name}
        </Typography>
        <a
          href={website}
          style={{
            flexBasis: '8rem',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            className="support-description-website-circle"
            sx={{ borderColor: 'primary.900' }}
          >
            <PublicIcon sx={{ color: 'primary.900' }} />
          </Box>
          <Typography>Website</Typography>
        </a>
      </section>
      <Blurb blurbIntro={blurbIntro} />
    </main>
  );
}

type CtaProps = Pick<Twc2SupportDetail, 'ctaBlurb' | 'ctaButtonText'>;

function CtaSection(props: CtaProps) {
  const { ctaBlurb, ctaButtonText } = props;
  return (
    <Box className="support-cta-container" sx={{ borderTopColor: 'grey.200' }}>
      <div style={{ flex: 4, height: '100%' }}>{ctaBlurb}</div>
      <PrimaryButton
        sx={{ flex: 5, backgroundColor: 'primary.700', height: '100%' }}
      >
        {ctaButtonText}
      </PrimaryButton>
    </Box>
  );
}

export function SupportDetailWip() {
  const [content, setContent] = useState<Twc2SupportDetail | null>(null);
  useEffect(() => {
    setContent(getTwc2Detail());
  }, []);
  if (!content) {
    return null;
  }
  const { logo, name, website, blurbIntro, ctaBlurb, ctaButtonText } = content;
  return (
    <Container
      style={{
        // TODO find a more elegant solution for this container variant
        backgroundImage: 'url(/images/background.svg)',
        backgroundRepeat: 'no-repeat',
        backgroundPositionX: 'center',
        backgroundPositionY: '-12rem',
        backgroundSize: 'contain',
        padding: '0',
        justifyContent: 'end',
      }}
    >
      <Header></Header>
      <DescriptionSection
        logo={logo}
        name={name}
        website={website}
        blurbIntro={blurbIntro}
      ></DescriptionSection>
      <CtaSection
        ctaBlurb={ctaBlurb}
        ctaButtonText={ctaButtonText}
      ></CtaSection>
    </Container>
  );
}
