import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Link, IconButton } from '@mui/material';
import {
  ArrowBackIosNew as ArrowBackIosNewIcon,
  Public as PublicIcon,
} from '@mui/icons-material';

import { Container, Carousel } from '..';
import { PrimaryButton } from '../RoundedButton';

import {
  SupportDetail,
  FacebookLinksSection,
  getSupportDetailStrings,
} from '../../../services';
import { AppPath } from '../../../routes/paths';
import { LanguageOption, useLanguage } from '../../../utils';

import './SupportDetailPage.css';

function Header(props: { title: string }) {
  const { title } = props;
  const navigate = useNavigate();
  return (
    <nav className="support-header">
      <IconButton
        aria-label="back"
        sx={{ color: 'text.primary' }}
        onClick={() => navigate(AppPath.Home)}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
      <Typography
        variant="h4"
        sx={{
          margin: '0',
        }}
      >
        {title}
      </Typography>
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

type BlurbProps = Pick<SupportDetail, 'blurbIntro' | 'blurbFacebookLinks'>;

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
  SupportDetail,
  'logo' | 'name' | 'website' | 'blurbIntro' | 'blurbFacebookLinks'
>;

function DescriptionSection(props: DescriptionProps) {
  const { logo, name, website, blurbIntro, blurbFacebookLinks } = props;
  return (
    // TODO: support logo overflows vertically if aspect ratio is tall.
    // Need to either square all logos or find a CSS solution
    <main className="support-description-container">
      <section className="support-description-header">
        <img src={logo} style={{ flexBasis: '3.5rem', width: '1px' }} />
        <Typography variant="h5" component="h2" style={{ flex: 1 }}>
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
            sx={{
              borderColor: 'primary.900',
              height: '2rem',
              width: '2rem',
            }}
          >
            <PublicIcon
              sx={{ color: 'primary.900', height: '1.5rem', width: '1.5rem' }}
            />
          </Box>
          <Typography variant="subtitle1">Website</Typography>
        </a>
      </section>
      <Blurb blurbIntro={blurbIntro} blurbFacebookLinks={blurbFacebookLinks} />
    </main>
  );
}

type CtaProps = Pick<SupportDetail, 'ctaButtonText' | 'ctaLink' | 'ctaIcon'>;

function CtaSection(props: CtaProps) {
  const { ctaButtonText, ctaLink, ctaIcon } = props;
  return (
    <Box className="support-cta-container" sx={{ borderTopColor: 'grey.200' }}>
      <PrimaryButton
        href={ctaLink}
        target="_blank"
        rel="noopener"
        sx={{
          flex: 5,
          backgroundColor: 'primary.700',
          height: '3.5rem',
          borderRadius: '0.25rem',
        }}
      >
        <img src={ctaIcon} style={{ padding: '0.25rem' }} />
        {ctaButtonText}
      </PrimaryButton>
    </Box>
  );
}

type SupportDetailPageProps = {
  getServiceDetailFunction: (language: LanguageOption) => SupportDetail;
};

export function SupportDetailPage({
  getServiceDetailFunction,
}: SupportDetailPageProps) {
  const [lang] = useLanguage();
  const fixedStrings = getSupportDetailStrings(lang);

  const [content, setContent] = useState<SupportDetail | null>(null);
  useEffect(() => {
    setContent(getServiceDetailFunction(lang));
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
    carouselSection,
    ctaButtonText,
    ctaLink,
    ctaIcon,
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
      <Carousel carouselSection={carouselSection}></Carousel>
      <CtaSection
        ctaButtonText={ctaButtonText}
        ctaLink={ctaLink}
        ctaIcon={ctaIcon}
      ></CtaSection>
    </Container>
  );
}
