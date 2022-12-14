// TODO This is a stub for testing, eventually replace this with Strapi Calls
// Data shared by every Support detail page.
export interface SupportDetailAbout {
  // Url of logo image.
  logo: string;
  // The header of the about section.
  name: string;
  // Url of org website.
  website: string;
  // Blurb introduction section. Subsequent parts of the blurb are defined
  // separately.
  blurbIntro: string;
  // Blurb for CTA section.
  ctaBlurb: string;
  // Text for CTA button.
  // TODO This won't handle images/icons in the button. Figure that out.
  ctaButtonText: string;
}

// We should consider moving TWC2-specific things to their own file.
export type Twc2SupportDetail = SupportDetailAbout;

export function getTwc2Detail(): Twc2SupportDetail {
  return {
    logo: 'foo.bar',
    name: 'Transient Workers Count Too (TWC2)',
    website: 'foo.bar',
    blurbIntro: `TWC2 helps all foreigners working in Singapore, including those on Work Permits and S-Passes. They help for free. Most common issues are salary non-payment, contract issues and injuries.`,
    ctaBlurb: 'Call on Mondays to Fridays (9am - 9pm), message any time',
    ctaButtonText: '+65 6297 7564',
  };
}
