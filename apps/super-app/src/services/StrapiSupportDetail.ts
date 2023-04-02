import type { LanguageOption } from './Language';
import type { Twc2SupportDetail } from './SupportDetail';

const endpoint = '/api/support-twc2?populate=*';

interface StrapiModelResponse<T> {
  data: {
    attributes: T;
  };
}

interface SupportTwc2StrapiView {
  support_basic: {
    name: string;
    logo: string;
    website: string;
    blurbIntro: string;
    ctaBlurb: string;
    ctaButtonText: string;
    ctaLink: string;
    ctaIcon: string;
  };
}

export async function getTwc2DetailStrapi(
  lang: LanguageOption
): Promise<Twc2SupportDetail> {
  const response = await fetch(endpoint);
  const json: StrapiModelResponse<SupportTwc2StrapiView> =
    await response.json();
  console.log(json);
  return {
    ...json.data.attributes.support_basic,
    // TODO not implemented
    blurbFacebookLinks: {
      title: '',
      imageSrc: '',
      links: [],
    },
  };
}
