import { SupportDetail } from './SupportDetail';
import { LanguageOption } from '../utils';
import { ServicePath } from '../routes/paths';

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
    carouselSection: null,
    ctaButtonText: '+65 6297 7564',
    ctaLink: 'https://wa.me/6562977564',
    ctaIcon: '/images/whatsapp-icon.svg',
  },
};

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

const HEALTHSERVE_DETAIL: Record<LanguageOption, SupportDetail> = {
  en: {
    logo: 'https://img.paperform.co/fetch/w_400,f_auto/https://s3.amazonaws.com/pf-upload-01/u-40359/1/2019-10-07/xm03ygs/HealthServe%20Logo%20colour.png',
    name: 'HealthServe',
    website: 'https://www.healthserve.org.sg/',
    blurbIntro: `HealthServe provides holistic and affordable care including:
        1. Medical services such as consultations, chronic disease management, dental or eye check-ups
        2. Mental health services including a 24-hour helpline
        3. Casework support and other forms of social assistance`,
    carouselSection: null,
    blurbFacebookLinks: {
      title: 'Connect with us on Facebook',
      imageSrc: '/images/facebook-icon.svg',
      links: [
        {
          href: 'https://www.facebook.com/healthservesg/',
          text: 'Facebook page',
        },
      ],
    },
    ctaButtonText: 'Call our 24-hour helpline for counselling',
    ctaLink: 'tel:+65%203129%205000',
    ctaIcon: '',
  },
};

const AIDHA_DETAIL: Record<LanguageOption, SupportDetail> = {
  en: {
    logo: 'https://www.aidha.org/wp-content/uploads/2018/06/logo.jpg',
    name: 'Aidha',
    website: 'https://www.aidha.org/',
    blurbIntro: `Aidha offers courses and resources to help you:
      1. Plan your finances and future
      2. Learn technology skills
      3. Communicate better. 
      
      Students of AIDHA programs have started their own businesses, learned important skills to pass on to their children, and found new hobbies and friends.`,
    carouselSection: null,
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
    ctaButtonText: 'Enrol in free short courses',
    ctaLink: 'https://www.aidha.org/courses/free-short-courses/',
    ctaIcon: '',
  },
};

const HOME_DETAIL: Record<LanguageOption, SupportDetail> = {
  en: {
    logo: 'https://images.squarespace-cdn.com/content/v1/5a12725612abd96b9c737354/1512006074840-DDTG0JDU6HZ72GX7KSO9/HOME+Logo.jpg?format=1500w',
    name: 'HOME',
    website: 'https://www.home.org.sg/',
    blurbIntro:
      'HOME provides direct assistance for survivors of abuse and exploitation, employment advice, and legal aid. In addition, the HOME academy offers skills training for domestic workers.',
    carouselSection: null,
    blurbFacebookLinks: {
      title: '',
      imageSrc: '/images/facebook-icon.svg',
      links: [
        {
          href: 'https://www.facebook.com/home.migrants.sg/',
          text: 'Facebook page',
        },
      ],
    },
    ctaButtonText: '+65 9787 3122',
    ctaLink: 'https://wa.me/6597873122',
    ctaIcon: '/images/whatsapp-icon.svg',
  },
};

const CDE_DETAIL: Record<LanguageOption, SupportDetail> = {
  en: {
    logo: '/images/cde-logo.png',
    name: 'Centre for Domestic Employees (CDE)',
    website: 'https://www.cde.org.sg/wps/portal/cde/home/',
    blurbIntro:
      'CDE can provide assistance and aid if you are facing unfair treatment. They also conduct social activities that help with learning new skills and staying strong emotionally.',
    carouselSection: null,
    blurbFacebookLinks: {
      title: 'Find us on Facebook',
      imageSrc: '/images/facebook-icon.svg',
      links: [
        {
          href: 'https://www.facebook.com/cde.singapore',
          text: 'CDE Facebook',
        },
      ],
    },
    ctaButtonText: 'Call our 24-hour helpline',
    ctaLink: 'tel:+65%201800%202255%20233',
    ctaIcon: '',
  },
};

const FAST_DETAIL: Record<LanguageOption, SupportDetail> = {
  en: {
    logo: '/images/fast-logo.png',
    name: 'Foreign Domestic Worker Association for Social Support and Training (FAST)',
    website: 'https://www.fast.org.sg/',
    blurbIntro: `FAST offers several social services to help you feel good and assist in times of need. 

      It also has a Clubhouse with various amenities, provides training, and conducts several major events every year.`,
    carouselSection: null,
    blurbFacebookLinks: {
      title: 'Explore our services',
      imageSrc: '/images/link-icon.png',
      links: [
        {
          href: 'https://www.fast.org.sg/staticpage/event',
          text: 'Events',
        },
        {
          href: 'https://www.fast.org.sg/training/lifelong-learning',
          text: 'Training',
        },
        {
          href: 'https://www.fast.org.sg/clubhouse',
          text: 'Clubhouse',
        },
        {
          href: 'https://www.fast.org.sg/social-support',
          text: 'Our services: 24-hour helpline, counseling, mediation, befriender, legal aid, humanitarian aid',
        },
        {
          href: 'https://www.facebook.com/FAST.org.sg',
          text: 'Facebook page',
        },
      ],
    },
    ctaButtonText: 'Access social support services',
    ctaLink: 'https://www.fast.org.sg/social-support',
    ctaIcon: '',
  },
};

const HAGAR_DETAIL: Record<LanguageOption, SupportDetail> = {
  en: {
    logo: 'https://hagar.org.sg/wp-content/uploads/2019/05/Masterlogo300.jpg',
    name: 'Hagar',
    website: 'https://hagar.org.sg/human-trafficking-in-singapore/',
    blurbIntro:
      'Hagar Singapore gives full help to survivors of human trafficking. If you are or know a survivor, they can assist with providing shelter, advice, education, and job training.',
    carouselSection: null,
    blurbFacebookLinks: {
      title: '',
      imageSrc: '/images/facebook-icon.svg',
      links: [
        {
          href: 'https://www.facebook.com/HagarSingapore/',
          text: 'Facebook page',
        },
      ],
    },
    ctaButtonText: 'Message Hagar on Facebook',
    ctaLink: 'https://www.facebook.com/HagarSingapore/',
    ctaIcon: '',
  },
};

const JWB_DETAIL: Record<LanguageOption, SupportDetail> = {
  en: {
    logo: 'https://forjusticewithoutborders.org/wp-content/themes/jwb/dist/vue/ef4c8813de08deca2bebc3cab7c2c4c4.png',
    name: 'Justice Without Borders (JWB)',
    website: 'https://forjusticewithoutborders.org/about/',
    blurbIntro:
      'We support victims of labour exploitation and human trafficking in getting compensation against their abusers, even after they return home.',
    carouselSection: null,
    blurbFacebookLinks: {
      title: '',
      imageSrc: '/images/facebook-icon.svg',
      links: [
        {
          href: 'https://www.facebook.com/forJWB',
          text: 'Facebook page',
        },
      ],
    },
    ctaButtonText: 'Check if we can help you get your salary',
    ctaLink: 'https://forjusticewithoutborders.org/get-help/',
    ctaIcon: '',
  },
};

const ADEO_DETAIL: Record<LanguageOption, SupportDetail> = {
  en: {
    logo: '/images/adeo-logo.jpeg',
    name: 'Alliance of Domestic Employees Outreach (ADEO)',
    website: 'https://adeo.sg/#what-we-do',
    blurbIntro:
      'ADEO is a movement of the Hope Initiative Alliance and aims to provide programs and events to care for domestic helpers in the areas of mental wellness, case management, recreation activities, empowerment, and skill development',
    carouselSection: null,
    blurbFacebookLinks: {
      title: '',
      imageSrc: '/images/facebook-icon.svg',
      links: [
        {
          href: 'https://www.facebook.com/sgadeo',
          text: 'Facebook page',
        },
      ],
    },
    ctaButtonText: 'Message us',
    ctaLink: 'tel:+65%206304%203482',
    ctaIcon: '',
  },
};

const SGACCIDENTHELPCENTRE_DETAIL: Record<LanguageOption, SupportDetail> = {
  en: {
    logo: 'https://static.wixstatic.com/media/862048_3725dd21f0d64ef492b3e5665c257ab5~mv2.jpg/v1/crop/x_46,y_63,w_725,h_433/fill/w_219,h_131,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/IMG-20180416-WA0009%20(1).jpg',
    name: 'SG Accident Help Centre',
    website: 'https://www.sgaccident.org.sg/about',
    blurbIntro:
      'SG Accident Help Centre offers care and support if you or someone you know are hurt or need help. They also teach about work safety and preventing injuries.',
    carouselSection: null,
    blurbFacebookLinks: {
      title: '',
      imageSrc: '/images/facebook-icon.svg',
      links: [
        {
          href: 'https://www.facebook.com/pages/SG%20Accident%20Help%20Centre/335942880619911/',
          text: 'Facebook page',
        },
      ],
    },
    ctaButtonText: 'Call us',
    ctaLink: 'tel:+65%206291%200751',
    ctaIcon: '',
  },
};

const MWC_DETAIL: Record<LanguageOption, SupportDetail> = {
  en: {
    logo: '/images/mwc-logo.jpeg',
    name: "Migrant Workers' Centre",
    website: 'https://mwc.org.sg/wps/portal/mwc/home/Aboutus/whatwedo',
    blurbIntro:
      'MWC can advice you about unfair work practices, and provide food and a place to stay. They offer membership to protect you from sickness, accidents, and other problems.',
    carouselSection: null,
    blurbFacebookLinks: {
      title: 'Explore our services',
      imageSrc: '/images/link-icon.png',
      links: [
        {
          href: 'https://mwc.org.sg/wps/portal/mwc/home/services/associatemembership/',
          text: 'MWC Associate Membership',
        },
        {
          href: 'https://mwc.org.sg/wps/portal/mwc/home/services/freelegalclinic/',
          text: 'Free Legal Clinic',
        },
      ],
    },
    ctaButtonText: 'Call us',
    ctaLink: 'tel:+65%206536%202692',
    ctaIcon: '',
  },
};

const EMPTY_DETAIL: Record<LanguageOption, SupportDetail> = {
  en: {
    logo: '',
    name: '',
    website: '',
    blurbIntro: '',
    carouselSection: null,
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
    ctaButtonText: '',
    ctaLink: '',
    ctaIcon: '',
  },
};

export function getPartnerDetail(
  partner: ServicePath,
  language: LanguageOption
): SupportDetail {
  switch (partner) {
    case ServicePath.Twc2:
      return TWC2_DETAIL[language];
    case ServicePath.ProBonoSG:
      return PRO_BONO_SG_DETAIL[language];
    case ServicePath.HealthServe:
      return HEALTHSERVE_DETAIL[language];
    case ServicePath.Aidha:
      return AIDHA_DETAIL[language];
    case ServicePath.Home:
      return HOME_DETAIL[language];
    case ServicePath.Cde:
      return CDE_DETAIL[language];
    case ServicePath.Fast:
      return FAST_DETAIL[language];
    case ServicePath.Hagar:
      return HAGAR_DETAIL[language];
    case ServicePath.Jwb:
      return JWB_DETAIL[language];
    case ServicePath.Adeo:
      return ADEO_DETAIL[language];
    case ServicePath.SGAccidentHelpCentre:
      return SGACCIDENTHELPCENTRE_DETAIL[language];
    case ServicePath.Mwc:
      return MWC_DETAIL[language];
    default:
      return EMPTY_DETAIL[language];
  }
}
