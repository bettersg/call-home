import { Path } from '../routes/paths';
import { Support } from './Support';

export interface ServiceCardDetail extends Support {
  // The short blurb briefly explaining the services provided.
  shortBlurb: string;
  // The app internal route
  route: Path;
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