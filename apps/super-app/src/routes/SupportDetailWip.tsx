import { useEffect, useState } from 'react';
import { Box, Typography, Link } from '@mui/material';
import {
  ArrowBackIosNew as ArrowBackIosNewIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import {
  Twc2SupportDetail,
  FacebookLinksSection,
  SupportDetailStrings,
  getSupportDetailStrings,
  getTwc2Detail,
} from '../services';
import { Container } from '../common/components';
import { PrimaryButton } from '../common/components/RoundedButton';
import './SupportDetailWip.css';

function Header(props: { title: string }) {
  const { title } = props;
  return (
    <nav className="support-header">
      <ArrowBackIosNewIcon />
      <Typography variant="h4">{title}</Typography>
    </nav>
  );
}

function BlurbIntro(props: { text: string }) {
  const { text } = props;
  return (
    <section className="support-description-blurb-section">{text}</section>
  );
}

function BlurbFacebookLinks(props: FacebookLinksSection) {
  const { links, title, imageSrc } = props;
  return (
    <section className="support-description-blurb-section">
      <Typography variant="h6">{title}</Typography>
      {links.map(({ href, text }, idx) => (
        <div key={idx} className="support-description-blurb-facebook-link">
          <img
            src={imageSrc}
            className="support-description-blurb-facebook-link-icon"
          />
          <Link
            href={href}
            sx={{
              color: 'primary.800',
              textDecorationColor: (theme) =>
                // TODO it's hard to type the palette correctly because we use
                // a different convention from @Mui, disable the warning for
                // now.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (theme.palette.primary as any)[800],
            }}
          >
            {text}
          </Link>
        </div>
      ))}
    </section>
  );
}

type BlurbProps = Pick<Twc2SupportDetail, 'blurbIntro' | 'blurbFacebookLinks'>;

function Blurb(props: BlurbProps) {
  const { blurbIntro, blurbFacebookLinks } = props;
  return (
    <>
      <BlurbIntro text={blurbIntro} />
      <BlurbFacebookLinks {...blurbFacebookLinks} />
    </>
  );
}

type DescriptionProps = Pick<
  Twc2SupportDetail,
  'logo' | 'name' | 'website' | 'blurbIntro' | 'blurbFacebookLinks'
>;

function DescriptionSection(props: DescriptionProps) {
  const { logo, name, website, blurbIntro, blurbFacebookLinks } = props;
  return (
    <main className="support-description-container">
      <section className="support-description-header">
        <img src={logo} style={{ flexBasis: '6rem', width: '1px' }} />
        <Typography variant="h4" component="h2" style={{ flex: 1 }}>
          {name}
        </Typography>
        <a
          href={website}
          style={{
            flexBasis: '4rem',
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
            <PublicIcon
              sx={{ color: 'primary.900', height: '2.5rem', width: '2.5rem' }}
            />
          </Box>
          <Typography>Website</Typography>
        </a>
      </section>
      <Blurb blurbIntro={blurbIntro} blurbFacebookLinks={blurbFacebookLinks} />
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
  const [fixedStrings, setFixedStrings] = useState<SupportDetailStrings | null>(
    null
  );
  const [content, setContent] = useState<Twc2SupportDetail | null>(null);
  useEffect(() => {
    setContent(getTwc2Detail());
  }, []);
  useEffect(() => {
    setFixedStrings(getSupportDetailStrings());
  }, []);
  if (!content || !fixedStrings) {
    return null;
  }
  const { headerTitle } = fixedStrings;
  const {
    logo,
    name,
    website,
    blurbIntro,
    blurbFacebookLinks,
    ctaBlurb,
    ctaButtonText,
  } = content;
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
      <Header title={headerTitle}></Header>
      <DescriptionSection
        logo={logo}
        name={name}
        website={website}
        blurbIntro={blurbIntro}
        blurbFacebookLinks={blurbFacebookLinks}
      ></DescriptionSection>
      <CtaSection
        ctaBlurb={ctaBlurb}
        ctaButtonText={ctaButtonText}
      ></CtaSection>
    </Container>
  );
}
