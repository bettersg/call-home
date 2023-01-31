// TODO This smoke test probably won't be useful in production. Reevaluate when
// we start testing with real content types.
const smokeTestEndpoint = '/api/smoke-test';
const i18nSmokeTestEndpoint = '/api/smoke-test?locale=bn-BD';

// TODO move this into a better module
// Strapi wraps each model in a "data". Inside which, the things we care about
// are in "attributes".
interface StrapiModelResponse<T> {
  data: {
    attributes: T;
  };
}

interface SmokeTestView {
  test: boolean;
}

async function isUp(): Promise<boolean> {
  const response = await fetch(smokeTestEndpoint);
  const json: StrapiModelResponse<SmokeTestView> = await response.json();
  // Expect that the value we got is actually `true`.
  return !!json.data.attributes.test;
}

async function isI18nUp(): Promise<boolean> {
  const response = await fetch(i18nSmokeTestEndpoint);
  const json: StrapiModelResponse<SmokeTestView> = await response.json();
  // Expect that the value we got is actually `true`.
  return !!json.data.attributes.test;
}

export async function consoleSmokeTest() {
  // This unnecessarily waits for the slower promise to finish, but at least
  // it's parallel, looks clean and the speed won't matter anyway.
  const [up, i18nUp] = await Promise.all([isUp(), isI18nUp()]);
  if (up) {
    console.log('Connected to Strapi backend!!');
  } else {
    console.error(
      'Failed to connect to Strapi backend. Bad things might ensue.'
    );
  }
  if (i18nUp) {
    console.log('i18n enabled on Strapi!');
  } else {
    console.error('Failed to detect i18n on Strapi!');
  }
}
