import { SupportDetail } from './SupportDetail';
import { LanguageOption } from '../utils';

const TWC2_DETAIL: Record<LanguageOption, SupportDetail> = {
  en: {
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
    carouselSection: [],
    ctaButtonText: '+65 6297 7564',
    ctaLink: 'https://wa.me/6562977564',
    ctaIcon: '/images/whatsapp-icon.svg',
  },
};

export function getTwc2Detail(language: LanguageOption): SupportDetail {
  return TWC2_DETAIL[language];
}

const PRO_BONO_SG_DETAIL: Record<LanguageOption, SupportDetail> = {
  en: {
    logo: 'https://www.probono.sg/wp-content/uploads/2022/12/Pro-Bono-SG-Logo.png',
    name: 'Pro Bono SG',
    website: 'https://www.probono.sg/',
    blurbIntro:
      'Pro Bono SG (UEN No. 201700430E) is a registered charity with the status of Institution of a Public Character and a company limited by guarantee. It started as a department within The Law Society of Singapore and later became Law Society Pro Bono Services. Since 2007, we’ve expanded our legal initiatives and programs, helping over 132,000 people with legal awareness, guidance, and representation. In FY 21/22, we helped over 17,000 individuals and community organisations. Our volunteer base has grown to 1,000 registered volunteers from various industries and specialities.',
    carouselSection: [
      {
        title: 'Webinars',
        description: 'Videos to help you',
        iconPath: '/images/webinars.svg',
        ctaText: 'Watch on YouTube',
        route: '',
      },
      {
        title: 'Know Your Rights',
        description: 'General information to know your rights',
        iconPath: '/images/know-your-rights.svg',
        ctaText: 'English',
        route: '',
      },
      {
        title: 'Legal Glossary',
        description: 'Useful terms to know for your legal clinic session',
        iconPath: '/images/legal-glossary.svg',
        ctaText: 'English/বাংলা',
        route: '',
      },
    ],
    blurbFacebookLinks: {
      title: '',
      imageSrc: '',
      links: [
        {
          href: '',
          text: '',
        },
        {
          href: '',
          text: '',
        },
      ],
    },
    ctaButtonText: 'Schedule a Free Legal Clinic',
    ctaLink:
      'https://forms.office.com/Pages/ResponsePage.aspx?id=2SIByMB8W06hRKsXHMIqYg9U_LFeiCRHgqHNQqZ_EfxUMTJZNkhEMUlOMU00WVlUODROTFBMTU5IMyQlQCN0PWcu',
    ctaIcon: '',
  },
};

export function getProBonoSGDetail(language: LanguageOption): SupportDetail {
  return PRO_BONO_SG_DETAIL[language];
}
