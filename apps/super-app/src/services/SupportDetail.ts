// TODO This is a stub for testing, eventually replace this with Strapi Calls

import { Support } from './Support';
import type { LanguageOption } from '../utils';

// Data shared by every Support detail page.
// Strings that stay constant on each Support detail page.
export interface SupportDetailStrings {
  headerTitle: string;
}

const SUPPORT_DETAIL_STRINGS: Record<LanguageOption, SupportDetailStrings> = {
  en: {
    headerTitle: 'Free Support Services',
  },
};

export function getSupportDetailStrings(
  language: LanguageOption
): SupportDetailStrings {
  return SUPPORT_DETAIL_STRINGS[language];
}

// Data used by every Support detail page that changes per page.
export interface SupportDetail extends Support {
  // Url of org website.
  website: string;
  // Blurb introduction section. Subsequent parts of the blurb are defined
  // separately.
  blurbIntro: string;
  // Blurb section for Facebook links
  blurbFacebookLinks: FacebookLinksSection;
  // Carousel section to display details in a carousel component.
  carouselSection: CarouselCard[];
  // Text for CTA button.
  // TODO This won't handle images/icons in the button. Figure that out.
  ctaButtonText: string;
  ctaLink: string;
  ctaIcon: string;
}

// Interfaces to store facebook-specific outreach information
// for a service.
export interface FacebookLinksSection {
  title: string;
  imageSrc: string;
  links: FacebookLink[];
}

export interface FacebookLink {
  href: string;
  text: string;
}

export interface CarouselCard {
  title: string;
  description: string;
  iconPath: string;
  ctaText: string;
  route: string;
}
