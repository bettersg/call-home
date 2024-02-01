import { searchCategories } from '../utils';
import { ServicePath } from '../routes/paths';
import { Support } from './Support';

export interface ServiceCardDetail extends Support {
  // The short blurb briefly explaining the services provided.
  shortBlurb: string;
  // The app internal route
  route: ServicePath;
}

interface ServiceCardDetailWithCategories extends ServiceCardDetail {
  // Categories to be used for search
  categories: searchCategories[]
}

const SERVICE_CARD_DETAILS: ServiceCardDetailWithCategories[] = [
  {
    logo: '/images/twc2-logo.png',
    name: 'Transient Workers Count Too',
    shortBlurb:
      'Whatsapp call on Mondays to Fridays (9am - 9pm) or message anytime',
    route: ServicePath.Twc2,
    categories: [searchCategories.EMPLOYMENT_ISSUE, searchCategories.FOOD_WELFARE, searchCategories.LEGAL_AID, searchCategories.SALARY_CLAIM]
  },
  {
    logo: 'https://www.probono.sg/wp-content/uploads/2022/12/Pro-Bono-SG-Logo.png',
    name: 'Pro Bono SG',
    shortBlurb:
      'Book in-person appointment with a lawyer and get free basic legal advice',
    route: ServicePath.ProBonoSG,
    categories: [searchCategories.LEGAL_AID]
  },
  {
    logo: 'https://img.paperform.co/fetch/w_400,f_auto/https://s3.amazonaws.com/pf-upload-01/u-40359/1/2019-10-07/xm03ygs/HealthServe%20Logo%20colour.png',
    name: 'HealthServe',
    shortBlurb: 'Access healthcare services and call our 24-hour helpline for mental health support',
    route: ServicePath.HealthServe,
    categories: [searchCategories.MEDICAL_SERVICES, searchCategories.PHYSICAL_INJURY, searchCategories.MENTAL_HEALTH]
  },
  {
    logo: 'https://www.aidha.org/wp-content/uploads/2018/06/logo.jpg',
    name: 'Aidha',
    shortBlurb: 'Learn how to manage your money, use computers, communicate with confidence, and more',
    route: ServicePath.Aidha,
    categories: [searchCategories.SKILLS_LEARNING]
  },
  {
    logo: 'https://images.squarespace-cdn.com/content/v1/5a12725612abd96b9c737354/1512006074840-DDTG0JDU6HZ72GX7KSO9/HOME+Logo.jpg?format=1500w',
    name: 'HOME',
    shortBlurb: 'Contact us for assistance with employer or legal issues',
    route: ServicePath.Home,
    categories: [searchCategories.LEGAL_AID, searchCategories.EMPLOYMENT_ISSUE, searchCategories.FOOD_WELFARE, searchCategories.SKILLS_LEARNING]
  },
  {
    logo: '/images/cde-logo.png',
    name: 'Centre for Domestic Employees (CDE)',
    shortBlurb: 'Call our 24-hour helpline for work problems, and check out our events!',
    route: ServicePath.Cde,
    categories: [searchCategories.SKILLS_LEARNING]
  },
  {
    logo: '/images/fast-logo.png',
    name: 'Foreign Domestic Worker Association for Social Support and Training (FAST)',
    shortBlurb: 'Access social services, clubhouse facilities, and training courses',
    route: ServicePath.Fast,
    categories: [searchCategories.LEGAL_AID, searchCategories.MENTAL_HEALTH, searchCategories.SKILLS_LEARNING]
  },
  {
    logo: 'https://hagar.org.sg/wp-content/uploads/2019/05/Masterlogo300.jpg',
    name: 'Hagar Singapore',
    shortBlurb:
      'Call us for support if you are or know a survivor of human trafficking',
    route: ServicePath.Hagar,
    categories: [searchCategories.FOOD_WELFARE, searchCategories.LEGAL_AID]
  },
  {
    logo: 'https://forjusticewithoutborders.org/wp-content/themes/jwb/dist/vue/ef4c8813de08deca2bebc3cab7c2c4c4.png',
    name: 'Justice Without Borders (JWB)',
    shortBlurb:
      "Contact us if you need help getting back money from an employer, even when you're back home.",
    route: ServicePath.Jwb,
    categories: [searchCategories.SALARY_CLAIM, searchCategories.LEGAL_AID]
  },
  {
    logo: '/images/adeo-logo.jpeg',
    name: 'Alliance of Domestic Employees Outreach (ADEO)',
    shortBlurb:
      'Message us for mental wellness programs, case management, and meaningful events',
    route: ServicePath.Adeo,
    categories: [searchCategories.MENTAL_HEALTH, searchCategories.SKILLS_LEARNING, searchCategories.RECREATION]
  },
  {
    logo: 'https://static.wixstatic.com/media/862048_3725dd21f0d64ef492b3e5665c257ab5~mv2.jpg/v1/crop/x_46,y_63,w_725,h_433/fill/w_219,h_131,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/IMG-20180416-WA0009%20(1).jpg',
    name: 'SG Accident Help Centre',
    shortBlurb:
      'Call us if you are hurt and need a ride or any assistance',
    route: ServicePath.SGAccidentHelpCentre,
    categories: [searchCategories.PHYSICAL_INJURY]
  },
  {
    logo: '/images/mwc-logo.jpeg',
    name: 'Migrant Workers’ Centre (MWC)',
    shortBlurb:
      'If you have any employment-related issues, call our 24/7 helpline @ 65362692',
    route: ServicePath.Mwc,
    categories: [searchCategories.EMPLOYMENT_ISSUE, searchCategories.SALARY_CLAIM]
  },
];

// This function defines all the service card details that we render on the main landing page
// TODO: Over time, we want to avoid relying on hardcoded strings in the code and use Strapi instead.
export function getServiceCardDetails(queryString: string[]): ServiceCardDetail[] {
  if (queryString.length == 0) {
    return SERVICE_CARD_DETAILS;
  }
  return SERVICE_CARD_DETAILS.filter(x => x.categories.filter(y => queryString.includes(y)).length >= 1);
}
