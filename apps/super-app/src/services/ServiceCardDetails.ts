import { ServicePath } from '../routes/paths';
import { Support } from './Support';

export interface ServiceCardDetail extends Support {
  // The short blurb briefly explaining the services provided.
  shortBlurb: string;
  // The app internal route
  route: string;
}

// This function defines all the service card details that we render on the main landing page
// TODO: Over time, we want to avoid relying on hardcoded strings in the code and use Strapi instead.
export function getServiceCardDetails(): ServiceCardDetail[] {
  return [
    {
      logo: '/images/twc2-logo.png',
      name: 'Transient Workers Count Too',
      shortBlurb:
        'Whatsapp call on Mondays to Fridays (9am - 9pm) or message anytime',
      route: ServicePath.Twc2,
    },
    {
      logo: 'https://www.probono.sg/wp-content/uploads/2022/12/Pro-Bono-SG-Logo.png',
      name: 'Pro Bono SG',
      shortBlurb:
        'Book in-person appointment with a lawyer and get free basic legal advice',
      route: ServicePath.ProBonoSG,
    },
    {
      logo: 'https://img.paperform.co/fetch/w_400,f_auto/https://s3.amazonaws.com/pf-upload-01/u-40359/1/2019-10-07/xm03ygs/HealthServe%20Logo%20colour.png',
      name: 'HealthServe',
      shortBlurb: 'Call us for mental health and counseling hotline',
      route: ServicePath.HealthServe,
    },
    {
      logo: 'https://www.aidha.org/wp-content/uploads/2018/06/logo.jpg',
      name: 'Aidha',
      shortBlurb: 'Learn financial literacy and confidence skills',
      route: ServicePath.Aidha,
    },
    {
      logo: 'https://images.squarespace-cdn.com/content/v1/5a12725612abd96b9c737354/1512006074840-DDTG0JDU6HZ72GX7KSO9/HOME+Logo.jpg?format=1500w',
      name: 'HOME',
      shortBlurb: 'Get in touch with our helpline',
      route: ServicePath.Home,
    },
    {
      logo: '/images/cde-logo.png',
      name: 'Centre for Domestic Employees (CDE)',
      shortBlurb: '24-hour toll-free helpline and fun social activities',
      route: ServicePath.Cde,
    },
    {
      logo: '/images/fast-logo.png',
      name: 'Foreign Domestic Worker Association for Social Support and Training (FAST)',
      shortBlurb: 'Visit our website for social support, training, and events',
      route: ServicePath.Fast,
    },
    {
      logo: 'https://hagar.org.sg/wp-content/uploads/2019/05/Masterlogo300.jpg',
      name: 'Hagar Singapore',
      shortBlurb:
        'Message us for advise on recovery and reintegration programs, for victims of human trafficking',
      route: ServicePath.Hagar,
    },
    {
      logo: 'https://forjusticewithoutborders.org/wp-content/themes/jwb/dist/vue/ef4c8813de08deca2bebc3cab7c2c4c4.png',
      name: 'Justice Without Borders (JWB)',
      shortBlurb:
        'Message us for help to get your compensation, even after returning home',
      route: ServicePath.Jwb,
    },
    {
      logo: '/images/adeo-logo.jpeg',
      name: 'Alliance of Domestic Employees Outreach (ADEO)',
      shortBlurb:
        'Message us for mental wellness programs, case management, and meaningful events',
      route: ServicePath.Adeo,
    },
    {
      logo: 'https://static.wixstatic.com/media/862048_3725dd21f0d64ef492b3e5665c257ab5~mv2.jpg/v1/crop/x_46,y_63,w_725,h_433/fill/w_219,h_131,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/IMG-20180416-WA0009%20(1).jpg',
      name: 'SG Accident Help Centre',
      shortBlurb:
        'Call us if you are injured and need help in transport or recovery',
      route: ServicePath.SGAccidentHelpCentre,
    },
    {
      logo: '/images/mwc-logo.jpeg',
      name: 'Migrant Workers’ Centre (MWC)',
      shortBlurb:
        'If you have any employment-related issues, call our 24/7 helpline @ 65362692',
      route: ServicePath.Mwc,
    },
  ];
}
