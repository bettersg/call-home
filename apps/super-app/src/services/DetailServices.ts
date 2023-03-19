// TODO This is a stub for testing, eventually replace this with Strapi Calls

// TODO remove routes from this page, https://github.com/bettersg/call-home/pull/121#discussion_r1110573633
import { Path } from '../routes/paths';
import { Support } from './SupportServices';

// Data shared by every Support detail page.

export interface ServiceCardAbout extends Support {
  // The short blurb briefly explaining the services provided.
  shortBlurb: string;
  // The app internal route
  route: Path;
}

// Strings that stay constant on each Support detail page.
export interface SupportDetailStrings {
  headerTitle: string;
}

export function getSupportDetailStrings(): SupportDetailStrings {
  return {
    headerTitle: 'Free Support Services',
  };
}

// Data used by every Support detail page that changes per page.
export interface SupportDetailAbout extends Support {
  // Url of org website.
  website: string;
  // Blurb introduction section. Subsequent parts of the blurb are defined
  // separately.
  blurbIntro: string;
  // Text for CTA button.
  // TODO This won't handle images/icons in the button. Figure that out.
  ctaButtonText: string;
}

// We should consider moving TWC2-specific things to their own file.
export interface Twc2SupportDetail extends SupportDetailAbout {
  blurbFacebookLinks: FacebookLinksSection;
}

export interface FacebookLinksSection {
  title: string;
  imageSrc: string;
  links: FacebookLink[];
}

export interface FacebookLink {
  href: string;
  text: string;
}

export function getServiceCardAbouts(): ServiceCardAbout[] {
  return [
    {
      logo: '/images/twc2-logo.png',
      name: 'Transient Workers Count Too',
      shortBlurb:
        'Whatsapp call on Mondays to Fridays (9am - 9pm) or message anytime',
      route: Path.SupportDetail,
    },
    {
      logo: 'https://www.probono.sg/wp-content/uploads/2022/12/Pro-Bono-SG-Logo.png',
      name: 'Pro Bono SG',
      shortBlurb:
        'Book in-person appointment with a lawyer and get free basic legal advice',
      route: Path.ProBonoSG,
    },
  ];
}

export function getTwc2Detail(): Twc2SupportDetail {
  return {
    logo: '/images/twc2-logo.png',
    name: 'Transient Workers Count Too (TWC2)',
    website: 'https://twc2.org.sg/language-menu-for-qr-code/',
    blurbIntro: `TWC2 helps all foreigners working in Singapore, including those on Work Permits and S-Passes. They help for free. Most common issues are salary non-payment, contract issues and injuries.`,
    blurbFacebookLinks: {
      title: `Join TWC2's Facebook Community Pages!`,
      imageSrc: '/images/facebook-icon.svg',
      links: [
        {
          href: 'https://www.facebook.com/twc2bangla',
          text: 'Bengali বাংলা',
        },
        {
          href: 'https://www.facebook.com/twc2tamil',
          text: 'Tamil தமிழ்',
        },
      ],
    },
    ctaButtonText: '+65 6297 7564',
  };
}
